// ---------------------------------------------------------------------------
// DHS — DRAIN HEALTH SCORE  (FINAL SYSTEM)
// ---------------------------------------------------------------------------
// Every drain is scored 0–100. 100 = Excellent (healthy drain), 0 = Critical.
//
//   DHS = 0.70(WQ) + 0.20(T) + 0.10(PL)
//
//   WQ  Water quality  (DO 25%, BOD 25%, Ammonia 20%, pH 10%, Turbidity 10%,
//                       Foam/Floating waste 10%) — thresholds per accepted
//                       water-quality standards (CPCB/DPCC/US EPA/EEA)
//   T   Trend          (major improvement 100 → major decline 0)
//   PL  Pollution load (mass/volume of pollution entering the river)
//
// Where DPCC publishes no flow share (the two newly reported drains), PL is
// excluded and the remaining 0.70/0.20 weights are renormalised. The UI says
// "not published" rather than pretending the load is zero.
//
// DISPLAYED SEPARATELY — never part of the score:
//   Confidence (%)   — how certain we are the score is correct
//   Risk level       — Low / Medium / High / Critical
//
// RULE: every input is a PUBLIC figure or a clearly-labelled inference.
// No number is invented. Drains without usable public data stay unrated.
// ---------------------------------------------------------------------------

import { DRAINS } from "@/data/drains";
import { DRAIN_SAMPLES, LATEST_ROUND, PREV_ROUND } from "@/data/water-quality";

export type TrendState = "muchBetter" | "better" | "same" | "worse" | "muchWorse";

export type WqKey = "do" | "bod" | "ammonia" | "ph" | "turbidity" | "waste";

export type WqReading = {
  value: number; // raw measurement (for "waste": 0–100 directly, 100 = clean)
  source: string;
  inferred?: boolean; // labelled inference from nearest public point — never hidden
};

export type DhsConfidence = {
  officialSources: number; // independent official/public reports backing the score
  volunteerVerified: boolean; // team field verification at the outfall
  liveSensor: boolean; // DJB/agency real-time monitor agreement
  droneImagery: boolean; // aerial imagery (none — no-drone project by design)
  note: string;
};

export type DhsInput = {
  drainId: number;
  wq: Partial<Record<WqKey, WqReading>>;
  trend: { state: TrendState; note: string };
  load?: { note: string };
  confidence: DhsConfidence;
  prev?: { wq: Partial<Record<WqKey, WqReading>> }; // for the previous-period score
};

// --- constants --------------------------------------------------------------

export const DHS_WEIGHTS = { wq: 0.7, trend: 0.2, pl: 0.1 } as const;

export const WQ_WEIGHTS: Record<WqKey, number> = {
  do: 0.25,
  bod: 0.25,
  ammonia: 0.2,
  ph: 0.1,
  turbidity: 0.1,
  waste: 0.1,
};

export const WQ_LABELS: Record<WqKey, string> = {
  do: "Dissolved oxygen (DO)",
  bod: "BOD",
  ammonia: "Ammonia (NH₃)",
  ph: "pH",
  turbidity: "Turbidity",
  waste: "Foam / floating waste",
};

export const TREND_SCORES: Record<TrendState, number> = {
  muchBetter: 100, // Major improvement
  better: 75, // Moderate improvement
  same: 50, // Stable
  worse: 25, // Moderate decline
  muchWorse: 0, // Major decline
};

export const TREND_LABELS: Record<TrendState, string> = {
  muchBetter: "Major improvement",
  better: "Moderate improvement",
  same: "Stable",
  worse: "Moderate decline",
  muchWorse: "Major decline",
};

export const TREND_GLYPH: Record<TrendState, { g: string; c: string }> = {
  muchBetter: { g: "▲▲", c: "#2fbf8f" },
  better: { g: "▲", c: "#2fbf8f" },
  same: { g: "→", c: "#f0b429" },
  worse: { g: "▼", c: "#f05252" },
  muchWorse: { g: "▼▼", c: "#f05252" },
};

// Najafgarh carries the largest share of the 22-drain discharge (DPCC 2025) —
// the normalisation ceiling for Pollution Load.
export const MAX_DISCHARGE_PCT = 69.77;

export type RiskLevel = { min: number; name: string; hex: string; blurb: string };

export const RISK_LEVELS: RiskLevel[] = [
  { min: 75, name: "Low", hex: "#2fbf8f", blurb: "Low risk — healthy drain" },
  { min: 60, name: "Medium", hex: "#f0b429", blurb: "Medium risk — impaired" },
  { min: 45, name: "High", hex: "#f97316", blurb: "High risk — degraded" },
  { min: 0, name: "Critical", hex: "#f05252", blurb: "Critical — severely polluted" },
];

export function riskFor(score: number): RiskLevel {
  return RISK_LEVELS.find((r) => score >= r.min) ?? RISK_LEVELS[RISK_LEVELS.length - 1];
}

// --- scoring functions ------------------------------------------------------

const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));

function paramScore(key: WqKey, v: number): number {
  switch (key) {
    case "do": // 5 mg/l healthy → 100, 0 → 0
      return clamp((100 * v) / 5);
    case "bod": // ≤ 3 mg/l → 100, 30 → 0 (standard ≤ 3)
      return clamp((100 * (30 - v)) / 27);
    case "ammonia": // ≤ 0.5 mg/l (CPCB bathing standard) → 100, 10 → 0
      return clamp((100 * (10 - v)) / 9.5);
    case "ph": // ideal 6.5–8.5 → 100, collapsing to 0 at 4 and 10
      if (v >= 6.5 && v <= 8.5) return 100;
      if (v < 6.5) return clamp((100 * (v - 4)) / 2.5);
      return clamp((100 * (10 - v)) / 1.5);
    case "turbidity": // ≤ 5 NTU → 100, 200 → 0
      return clamp((100 * (200 - v)) / 195);
    case "waste": // already 0–100; 100 = no floating waste/foam
      return clamp(v);
  }
}

export type WqDetail = {
  key: WqKey;
  weight: number;
  score: number;
  reading: WqReading;
};

function computeWq(wq: Partial<Record<WqKey, WqReading>>): { score: number; detail: WqDetail[]; missing: WqKey[] } {
  const detail: WqDetail[] = (Object.keys(wq) as WqKey[]).map((k) => ({
    key: k,
    weight: WQ_WEIGHTS[k],
    score: paramScore(k, wq[k]!.value),
    reading: wq[k]!,
  }));
  const totalW = detail.reduce((s, d) => s + d.weight, 0);
  const score = totalW > 0 ? detail.reduce((s, d) => s + d.weight * d.score, 0) / totalW : 0;
  const missing = (Object.keys(WQ_WEIGHTS) as WqKey[]).filter((k) => !(k in wq));
  return { score, detail, missing };
}

function computeLoad(input: DhsInput): number | null {
  if (!input.load) return null;
  const pct = DRAINS.find((d) => d.id === input.drainId)?.dischargePct;
  if (pct == null || pct <= 0) return null; // no published share — exclude PL
  return clamp(100 * (1 - pct / MAX_DISCHARGE_PCT));
}

export function computeConfidence(c: DhsConfidence): number {
  let x = 40; // baseline: at least one official public report exists
  x += Math.min(36, (c.officialSources - 1) * 12); // +12 per extra independent source
  if (c.volunteerVerified) x += 12;
  if (c.liveSensor) x += 12;
  if (c.droneImagery) x += 12;
  return clamp(x);
}

export type DhsResult = {
  drainId: number;
  wq: number;
  trend: number;
  pl: number | null;
  total: number;
  risk: RiskLevel;
  wqDetail: WqDetail[];
  wqMissing: WqKey[];
  confidence: number;
  prevTotal?: number;
  prevRisk?: RiskLevel;
};

export function computeDhs(input: DhsInput): DhsResult {
  const { score: wq, detail: wqDetail, missing: wqMissing } = computeWq(input.wq);
  const trend = TREND_SCORES[input.trend.state];
  const pl = computeLoad(input);
  const activeWeight = pl === null ? DHS_WEIGHTS.wq + DHS_WEIGHTS.trend : 1;
  const total = Math.round(
    (DHS_WEIGHTS.wq * wq + DHS_WEIGHTS.trend * trend + (pl ?? 0) * DHS_WEIGHTS.pl) / activeWeight
  );
  const confidence = computeConfidence(input.confidence);

  let prevTotal: number | undefined;
  let prevRisk: RiskLevel | undefined;
  if (input.prev) {
    const p = computeDhs({
      drainId: input.drainId,
      wq: input.prev.wq,
      trend: { state: "same", note: "" },
      load: input.load,
      confidence: input.confidence,
    });
    prevTotal = p.total;
    prevRisk = p.risk;
  }

  return {
    drainId: input.drainId,
    wq,
    trend,
    pl,
    total,
    risk: riskFor(total),
    wqDetail,
    wqMissing,
    confidence,
    prevTotal,
    prevRisk,
  };
}

// --- rated drains (public data only) ----------------------------------------

const LATEST_SOURCE = `DPCC ${LATEST_ROUND.label} — Report ${LATEST_ROUND.drainReport}, sampled ${LATEST_ROUND.sampled} (norm <= 30)`;
const PREV_SOURCE = `DPCC ${PREV_ROUND.label} — Report ${PREV_ROUND.drainReport}, sampled ${PREV_ROUND.sampled} (norm <= 30)`;

function sampleWq(drainId: number, round: "latest" | "prev"): Partial<Record<WqKey, WqReading>> {
  const s = DRAIN_SAMPLES[drainId]?.[round];
  if (!s || s.noFlow || s.bod == null || s.ph == null || s.tss == null) return {};
  const roundLabel = round === "latest" ? LATEST_ROUND.label : PREV_ROUND.label;
  return {
    bod: { value: s.bod, source: round === "latest" ? LATEST_SOURCE : PREV_SOURCE },
    ph: { value: s.ph, source: `DPCC ${roundLabel} drain report (same round)` },
    turbidity: {
      value: s.tss,
      source: `TSS ${s.tss} mg/L from same report, as turbidity proxy`,
      inferred: true,
    },
  };
}

const SINGLE: DhsConfidence = {
  officialSources: 1,
  volunteerVerified: false,
  liveSensor: false,
  droneImagery: false,
  note: "Single official source (DPCC Sep 2026 round). Confidence rises as more sources arrive.",
};

function makeInput({
  drainId,
  loadNote,
  trendNote,
  confidence = SINGLE,
  wqExtra,
  prevExtra,
  trendState = "same",
}: {
  drainId: number;
  loadNote?: string;
  trendNote: string;
  confidence?: DhsConfidence;
  wqExtra?: Partial<Record<WqKey, WqReading>>;
  prevExtra?: Partial<Record<WqKey, WqReading>>;
  trendState?: TrendState;
}): DhsInput {
  const latest = sampleWq(drainId, "latest");
  const prev = sampleWq(drainId, "prev");
  const input: DhsInput = {
    drainId,
    wq: { ...latest, ...wqExtra },
    trend: { state: trendState, note: trendNote },
    confidence,
  };
  if (loadNote) input.load = { note: loadNote };
  if (Object.keys(prev).length > 0) {
    input.prev = { wq: { ...prev, ...prevExtra } };
  }
  return input;
}

const MAY_DO_WAZIRABAD: WqReading = {
  value: 3.1,
  source: "DPCC May 2026 — Wazirabad station; Sep 2026 DO not reported",
  inferred: true,
};
const SEP_DO_ASGARPUR: WqReading = {
  value: 0,
  source: "DPCC Sep 2026 — Asgarpur exit station (downstream); nil DO",
  inferred: true,
};
const FOAM_NAJAFGARH: WqReading = {
  value: 30,
  source: "Foam episodes documented — NGT orders 2022; media Nov 2025",
};
const FOAM_SHAHDARA: WqReading = {
  value: 30,
  source: "Foam visible at Okhla confluence — media Nov 2025",
};

const NAJAFGARH: DhsInput = makeInput({
  drainId: 1,
  loadNote:
    "69.77% of 22-drain discharge ≈ 862 MGD (DJB May 2026) — more than all 37 STPs combined (814.23 MGD)",
  trendNote: "BOD 66 → 62 mg/L (Aug → Sep); stable at a high level.",
  confidence: {
    officialSources: 4, // DPCC • DJB • HT • NGT
    volunteerVerified: false,
    liveSensor: false,
    droneImagery: false,
    note: "4 independent public reports. No live sensor on this drain.",
  },
  wqExtra: { do: MAY_DO_WAZIRABAD, waste: FOAM_NAJAFGARH },
  prevExtra: { do: MAY_DO_WAZIRABAD, waste: FOAM_NAJAFGARH },
});

const SHAHDARA: DhsInput = makeInput({
  drainId: 2,
  loadNote:
    "16.12% of 22-drain discharge (DPCC 2025); with Najafgarh ≈ 87% of drain BOD load (DPCC 2025)",
  trendNote: "BOD 120 → 120 mg/L (Aug → Sep); stable.",
  confidence: {
    officialSources: 3, // DPCC • DJB • TNIE
    volunteerVerified: false,
    liveSensor: false,
    droneImagery: false,
    note: "3 independent public reports. No live sensor on this drain.",
  },
  wqExtra: { do: SEP_DO_ASGARPUR, waste: FOAM_SHAHDARA },
  prevExtra: { do: SEP_DO_ASGARPUR, waste: FOAM_SHAHDARA },
});

const TWO_ROUNDS: DhsConfidence = {
  officialSources: 2, // DPCC Oct 2025 via HT + DPCC Sep 2026
  volunteerVerified: false,
  liveSensor: false,
  droneImagery: false,
  note: "Two official rounds — Oct 2025 (pass) and Sep 2026 (fail).",
};

export const DHS_INPUTS: DhsInput[] = [
  NAJAFGARH,
  SHAHDARA,
  makeInput({
    drainId: 3,
    loadNote: "4.92% of 22-drain discharge (DPCC 2025) — third-largest by flow",
    trendNote: "BOD 120 → 125 mg/L (Aug → Sep); stable, still the worst of the round.",
  }),
  makeInput({
    drainId: 4,
    loadNote: "4.16% of 22-drain discharge (DPCC 2025); partially tapped",
    trendNote: "BOD 86 → 86 mg/L (Aug → Sep); stable.",
  }),
  makeInput({
    drainId: 5,
    loadNote: "1.47% of 22-drain discharge (DPCC 2025)",
    trendNote: "BOD 100 → 90 mg/L (Aug → Sep); still three times the norm.",
  }),
  makeInput({
    drainId: 6,
    loadNote: "1.47% of 22-drain discharge (DPCC 2025); partially tapped",
    trendNote: "BOD 100 → 106 mg/L (Aug → Sep); stable.",
  }),
  makeInput({
    drainId: 7,
    loadNote: "1.03% of 22-drain discharge (DPCC 2025)",
    trendNote: "BOD 86 → 88 mg/L (Aug → Sep); stable.",
  }),
  makeInput({
    drainId: 8,
    loadNote: "0.46% of 22-drain discharge (DPCC 2025)",
    trendNote: "BOD 80 → 82 mg/L (Aug → Sep); stable.",
  }),
  makeInput({
    drainId: 9,
    loadNote: "0.24% of 22-drain discharge (DPCC 2025)",
    trendNote: "BOD 46 → 48 mg/L (Aug → Sep); stable.",
  }),
  makeInput({
    drainId: 10,
    loadNote: "0.23% of 22-drain discharge (DPCC 2025)",
    trendNote: "BOD 70 → 66 mg/L (Aug → Sep); stable.",
  }),
  makeInput({
    drainId: 11,
    loadNote: "0.19% of 22-drain discharge (DPCC 2025)",
    trendNote: "BOD 70 → 70 mg/L (Aug → Sep); stable.",
  }),
  makeInput({
    drainId: 12,
    loadNote: "0.18% of 22-drain discharge (DPCC 2025)",
    trendNote: "BOD 90 → 85 mg/L (Aug → Sep); still above the norm after its Oct 2025 pass.",
    confidence: TWO_ROUNDS,
  }),
  makeInput({
    drainId: 19,
    loadNote: "Tapped — no standing outfall load; Sep 2026 monsoon flow only",
    trendNote: "BOD 34 → 34 mg/L (Aug → Sep); closest flowing drain to the 30 norm.",
  }),
  makeInput({
    drainId: 20,
    loadNote: "No published 2025 flow share for this newly identified drain; pollution load excluded",
    trendNote: "BOD 80 → 75 mg/L (Aug → Sep); still above the norm.",
  }),
  makeInput({
    drainId: 22,
    loadNote: "No published 2025 flow share for this newly reported drain; pollution load excluded",
    trendNote: "First rated on the Sep 2026 round — no flow sample in Aug 2026.",
  }),
];

const RESULTS: Record<number, DhsResult> = Object.fromEntries(
  DHS_INPUTS.map((i) => [i.drainId, computeDhs(i)])
);

export function getDhs(drainId: number): DhsResult | undefined {
  return RESULTS[drainId];
}
