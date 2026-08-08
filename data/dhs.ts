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
// DISPLAYED SEPARATELY — never part of the score:
//   Confidence (%)   — how certain we are the score is correct
//   Risk level       — Low / Medium / High / Critical
//
// RULE: every input is a PUBLIC figure or a clearly-labelled inference.
// No number is invented. Drains without usable public data stay unrated.
// ---------------------------------------------------------------------------

import { DRAINS } from "@/data/drains";

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
  same: { g: "＝", c: "#f0b429" },
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

function computeLoad(input: DhsInput): number {
  if (!input.load) return 0;
  const pct = DRAINS.find((d) => d.id === input.drainId)?.dischargePct;
  if (pct == null || pct <= 0) return 100; // tapped / no measurable outfall — no load
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
  pl: number;
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
  const total = Math.round(
    DHS_WEIGHTS.wq * wq + DHS_WEIGHTS.trend * trend + DHS_WEIGHTS.pl * pl
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

export const DHS_INPUTS: DhsInput[] = [
  {
    // Najafgarh — 69.77% of the 22-drain discharge (DPCC 2025)
    drainId: 1,
    wq: {
      do: { value: 3.1, source: "DPCC May 2026 — Wazirabad station (nearest point below outfall)", inferred: true },
      bod: { value: 70, source: "DPCC Jul 2026 — Report DPCC/W/D/2026/223–244//3039, sampled 06.07.2026 (norm ≤ 30)" },
      ph: { value: 7.4, source: "DPCC Jul 2026 drain report (same round)" },
      turbidity: { value: 120, source: "TSS 120 mg/L from same report, as turbidity proxy", inferred: true },
      waste: { value: 30, source: "Foam episodes documented — NGT orders 2022; media Nov 2025" },
    },
    trend: {
      state: "worse",
      note: "Outfall BOD 60 → 70 (Oct 2025 → Jul 2026); DO at Wazirabad fell 6.8 → 3.1 (DPCC 2025 → May 2026)",
    },
    load: { note: "69.77% of 22-drain discharge ≈ ~862 MGD (DJB May 2026) — more than all 37 STPs combined (814.23 MGD)" },
    confidence: {
      officialSources: 4, // DPCC · DJB · HT · NGT
      volunteerVerified: false, // field checks not confirmed — set true only if verified on the ground
      liveSensor: false, // no DJB real-time monitor on this drain yet
      droneImagery: false, // no-drone project by design
      note: "4 independent public reports. No live sensor on this drain.",
    },
    prev: {
      wq: {
        do: { value: 6.8, source: "DPCC 2025 — Wazirabad station", inferred: true },
        bod: { value: 60, source: "DPCC Oct 2025 via HT (stable)" },
        ph: { value: 7.5, source: "DPCC river pH range", inferred: true },
        waste: { value: 30, source: "Foam episodes documented" },
      },
    },
  },
  {
    // Shahdara — 16.12% of the 22-drain discharge (DPCC 2025)
    drainId: 2,
    wq: {
      do: { value: 0, source: "DPCC May 2026 — Asgarpur exit station (downstream of outfall)", inferred: true },
      bod: { value: 125, source: "DPCC Jul 2026 — Report DPCC/W/D/2026/223–244//3039, drain outfall, sampled 06.07.2026 (norm ≤ 30)" },
      ph: { value: 7.5, source: "DPCC Jul 2026 drain report (same round)" },
      turbidity: { value: 240, source: "TSS 240 mg/L from same report, as turbidity proxy", inferred: true },
      waste: { value: 30, source: "Foam visible at Okhla confluence — media Nov 2025" },
    },
    trend: {
      state: "same",
      note: "Outfall BOD 145 (Oct 2025, Sahibabad feeder) → 125 (Jul 2026, drain outfall); UP feeders still 110–120",
    },
    load: { note: "16.12% of 22-drain discharge (DPCC 2025); with Najafgarh ≈ 84% of drain pollution (TNIE, Jul 2025)" },
    confidence: {
      officialSources: 3, // DPCC · DJB · TNIE
      volunteerVerified: false, // field checks not confirmed — set true only if verified on the ground
      liveSensor: false,
      droneImagery: false,
      note: "3 independent public reports. No live sensor on this drain.",
    },
  },
];

// --- baseline round: DPCC Jul 2026 (Report No. DPCC/W/D/2026/223–244//3039,
// sampled 06.07.2026). One official source per drain → confidence 40%.
// Confidence rises as RTI replies and repeat rounds arrive.
const JUL26 = "DPCC Jul 2026 — Report DPCC/W/D/2026/223–244//3039, sampled 06.07.2026 (norm ≤ 30)";
const SINGLE = {
  officialSources: 1,
  volunteerVerified: false,
  liveSensor: false,
  droneImagery: false,
  note: "Single official source (DPCC Jul 2026 round). Confidence rises as more sources arrive.",
};

const NEW_DRAINS: DhsInput[] = [
  {
    // Barapulla — 4.92% discharge; worst BOD of the July round
    drainId: 3,
    wq: {
      bod: { value: 130, source: JUL26 },
      ph: { value: 7.1, source: "DPCC Jul 2026 drain report (same round)" },
      turbidity: { value: 216, source: "TSS 216 mg/L from same report, as turbidity proxy", inferred: true },
    },
    trend: { state: "same", note: "First rated on the Jul 2026 round — baseline." },
    load: { note: "4.92% of 22-drain discharge (DPCC 2025) — third-largest by flow" },
    confidence: SINGLE,
  },
  {
    // Power House / Delhi Gate — 4.16% discharge, partially tapped
    drainId: 4,
    wq: {
      bod: { value: 84, source: JUL26 },
      ph: { value: 7.4, source: "DPCC Jul 2026 drain report (same round)" },
      turbidity: { value: 172, source: "TSS 172 mg/L from same report, as turbidity proxy", inferred: true },
    },
    trend: { state: "same", note: "First rated on the Jul 2026 round — baseline." },
    load: { note: "4.16% of 22-drain discharge (DPCC 2025); partially tapped" },
    confidence: SINGLE,
  },
  {
    // ISBT (Qudsia Bagh / Mori Gate) — 1.47% discharge
    drainId: 5,
    wq: {
      bod: { value: 105, source: JUL26 },
      ph: { value: 7.2, source: "DPCC Jul 2026 drain report (same round)" },
      turbidity: { value: 134, source: "TSS 134 mg/L from same report, as turbidity proxy", inferred: true },
    },
    trend: { state: "same", note: "First rated on the Jul 2026 round — baseline." },
    load: { note: "1.47% of 22-drain discharge (DPCC 2025)" },
    confidence: SINGLE,
  },
  {
    // Sen Nursing Home — 1.47% discharge, partially tapped
    drainId: 6,
    wq: {
      bod: { value: 98, source: JUL26 },
      ph: { value: 7.2, source: "DPCC Jul 2026 drain report (same round)" },
      turbidity: { value: 212, source: "TSS 212 mg/L from same report, as turbidity proxy", inferred: true },
    },
    trend: { state: "same", note: "First rated on the Jul 2026 round — baseline." },
    load: { note: "1.47% of 22-drain discharge (DPCC 2025); partially tapped" },
    confidence: SINGLE,
  },
  {
    // Maharani Bagh — 1.03% discharge
    drainId: 7,
    wq: {
      bod: { value: 90, source: JUL26 },
      ph: { value: 7.2, source: "DPCC Jul 2026 drain report (same round)" },
      turbidity: { value: 170, source: "TSS 170 mg/L from same report, as turbidity proxy", inferred: true },
    },
    trend: { state: "same", note: "First rated on the Jul 2026 round — baseline." },
    load: { note: "1.03% of 22-drain discharge (DPCC 2025)" },
    confidence: SINGLE,
  },
  {
    // Kailash Nagar — 0.46% discharge, to be tapped
    drainId: 8,
    wq: {
      bod: { value: 80, source: JUL26 },
      ph: { value: 6.9, source: "DPCC Jul 2026 drain report (same round)" },
      turbidity: { value: 138, source: "TSS 138 mg/L from same report, as turbidity proxy", inferred: true },
    },
    trend: { state: "same", note: "First rated on the Jul 2026 round — baseline." },
    load: { note: "0.46% of 22-drain discharge (DPCC 2025)" },
    confidence: SINGLE,
  },
  {
    // Abul Fazal — 0.24% discharge; pH digit clipped in scan, inferred 7.0
    drainId: 9,
    wq: {
      bod: { value: 50, source: JUL26 },
      ph: { value: 7.0, source: "DPCC Jul 2026 drain report — second digit clipped in scan", inferred: true },
      turbidity: { value: 98, source: "TSS 98 mg/L from same report, as turbidity proxy", inferred: true },
    },
    trend: { state: "same", note: "First rated on the Jul 2026 round — baseline." },
    load: { note: "0.24% of 22-drain discharge (DPCC 2025)" },
    confidence: SINGLE,
  },
  {
    // Sonia Vihar — 0.23% discharge
    drainId: 10,
    wq: {
      bod: { value: 74, source: JUL26 },
      ph: { value: 7.1, source: "DPCC Jul 2026 drain report (same round)" },
      turbidity: { value: 108, source: "TSS 108 mg/L from same report, as turbidity proxy", inferred: true },
    },
    trend: { state: "same", note: "First rated on the Jul 2026 round — baseline." },
    load: { note: "0.23% of 22-drain discharge (DPCC 2025)" },
    confidence: SINGLE,
  },
  {
    // Jaitpur — 0.19% discharge, southern-most east-bank outfall
    drainId: 11,
    wq: {
      bod: { value: 75, source: JUL26 },
      ph: { value: 7.1, source: "DPCC Jul 2026 drain report (same round)" },
      turbidity: { value: 126, source: "TSS 126 mg/L from same report, as turbidity proxy", inferred: true },
    },
    trend: { state: "same", note: "First rated on the Jul 2026 round — baseline." },
    load: { note: "0.19% of 22-drain discharge (DPCC 2025)" },
    confidence: SINGLE,
  },
  {
    // Shastri Park — only Oct 2025 pass; failed again in Jul 2026 (BOD 95)
    drainId: 12,
    wq: {
      bod: { value: 95, source: JUL26 },
      ph: { value: 7.1, source: "DPCC Jul 2026 drain report (same round)" },
      turbidity: { value: 168, source: "TSS 168 mg/L from same report, as turbidity proxy", inferred: true },
    },
    trend: {
      state: "worse",
      note: "Only drain meeting all standards in Oct 2025 (BOD ≤30) — failed Jul 2026 at BOD 95",
    },
    load: { note: "0.18% of 22-drain discharge (DPCC 2025)" },
    confidence: {
      officialSources: 2, // DPCC Oct 2025 via HT + DPCC Jul 2026
      volunteerVerified: false,
      liveSensor: false,
      droneImagery: false,
      note: "Two official rounds — Oct 2025 (pass) and Jul 2026 (fail).",
    },
  },
  {
    // Drain No. 14 — tapped but carried monsoon flow in Jul 2026
    drainId: 19,
    wq: {
      bod: { value: 32, source: JUL26 },
      ph: { value: 7.3, source: "DPCC Jul 2026 drain report (same round)" },
      turbidity: { value: 64, source: "TSS 64 mg/L from same report, as turbidity proxy", inferred: true },
    },
    trend: { state: "same", note: "Tapped drain — monsoon flow in Jul 2026; closest of any flowing drain to the BOD norm" },
    load: { note: "Tapped — no standing outfall load; Jul 2026 monsoon overflow only" },
    confidence: SINGLE,
  },
];

DHS_INPUTS.push(...NEW_DRAINS);

const RESULTS: Record<number, DhsResult> = Object.fromEntries(
  DHS_INPUTS.map((i) => [i.drainId, computeDhs(i)])
);

export function getDhs(drainId: number): DhsResult | undefined {
  return RESULTS[drainId];
}
