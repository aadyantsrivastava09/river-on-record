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
  load?: { mgd?: number; share?: number; note: string };
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

// Najafgarh's published discharge (SPRF Mar 2026 / DJB reassessment May 2026)
// is the normalisation ceiling for Pollution Load.
export const MAX_MGD = 632;

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
  const val = input.load.mgd ?? (input.load.share! / 68.71) * MAX_MGD; // share scaled to Najafgarh
  return clamp(100 * (1 - val / MAX_MGD));
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
    // Najafgarh — 68.71% of the drain load
    drainId: 1,
    wq: {
      do: { value: 3.1, source: "DPCC May 2026 — Wazirabad station (nearest point below outfall)", inferred: true },
      bod: { value: 96, source: "SPRF Mar 2026 — 96 mg/l at discharge (drain standard ≤ 10)" },
      ph: { value: 7.5, source: "DPCC river pH range 2025–26", inferred: true },
      waste: { value: 30, source: "Foam episodes documented — NGT orders 2022; media Nov 2025" },
    },
    trend: {
      state: "worse",
      note: "DO at Wazirabad fell 6.8 → 3.1 (DPCC 2025 → May 2026)",
    },
    load: { mgd: 632, note: "~632 MGD (DJB reassessment May 2026: revised ~862 MGD)" },
    confidence: {
      officialSources: 4, // SPRF · DJB · DPCC · NGT
      volunteerVerified: true, // team visual checks during YIS 2026 field research
      liveSensor: false, // no DJB real-time monitor on this drain yet
      droneImagery: false, // no-drone project by design
      note: "4 independent official reports + field verification. No live sensor on this drain.",
    },
    prev: {
      wq: {
        do: { value: 6.8, source: "DPCC 2025 — Wazirabad station", inferred: true },
        bod: { value: 96, source: "SPRF Mar 2026 (stable)" },
        ph: { value: 7.5, source: "DPCC river pH range", inferred: true },
        waste: { value: 30, source: "Foam episodes documented" },
      },
    },
  },
  {
    // Shahdara — 10.9% of the drain load
    drainId: 3,
    wq: {
      do: { value: 0, source: "DPCC May 2026 — Asgarpur exit station (downstream of outfall)", inferred: true },
      bod: { value: 130, source: "SPRF Mar 2026 — 100–159 mg/l range (mid-point)" },
      ph: { value: 7.5, source: "DPCC river pH range 2025–26", inferred: true },
      waste: { value: 30, source: "Foam visible at Okhla confluence — media Nov 2025" },
    },
    trend: {
      state: "same",
      note: "BOD stable 2020 → 2024 (Delhi Dept of Environment annual averages)",
    },
    load: { share: 10.9, note: "10.9% of 22-drain load (SPRF Mar 2026); 45% of flow arrives from UP" },
    confidence: {
      officialSources: 3, // SPRF · DPCC · CPCB
      volunteerVerified: true, // team visual checks during YIS 2026 field research
      liveSensor: false,
      droneImagery: false,
      note: "3 independent official reports + field verification. No live sensor on this drain.",
    },
  },
];

const RESULTS: Record<number, DhsResult> = Object.fromEntries(
  DHS_INPUTS.map((i) => [i.drainId, computeDhs(i)])
);

export function getDhs(drainId: number): DhsResult | undefined {
  return RESULTS[drainId];
}
