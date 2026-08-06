// ---------------------------------------------------------------------------
// RoRES — RIVER ON RECORD ENVIRONMENTAL SCORE
// ---------------------------------------------------------------------------
// Every drain is scored 0–100. 100 = cleanest, 0 = most dangerous.
//
//   RoRES = 0.40(WQ) + 0.20(T) + 0.15(PL) + 0.15(ES) + 0.10(RS)
//
//   WQ  Water quality   (DO 30%, BOD 25%, pH 15%, Turbidity 15%, Waste/Foam 15%)
//   T   Trend           (last 4 weeks — rewards improvement, not just conditions)
//   PL  Pollution load  (daily discharge / share of load)
//   ES  Exposure        (ghats, schools, farms, dense colonies near the outfall)
//   RS  Reliability     (independent verified sources backing the score)
//
// RULE: every input is a PUBLIC figure or a clearly-labelled inference.
// No number is invented. Drains without usable public data stay unrated.
// ---------------------------------------------------------------------------

export type TrendState = "muchBetter" | "better" | "same" | "worse" | "muchWorse";

export type WqKey = "do" | "bod" | "ph" | "turbidity" | "waste";

export type WqReading = {
  value: number; // raw measurement (for "waste": 0–100 directly, 100 = clean)
  source: string;
  inferred?: boolean; // labelled inference from nearest public point — never hidden
};

export type RorInput = {
  drainId: number;
  wq: Partial<Record<WqKey, WqReading>>;
  trend: { state: TrendState; note: string };
  load?: { mgd?: number; share?: number; note: string };
  exposurePenalty: number; // 0–100, subtracted from Exposure
  exposureNote: string;
  sourceCount: number; // independent verified public sources backing the score
  prev?: { wq: Partial<Record<WqKey, WqReading>> }; // for the previous-period score
};

// --- constants --------------------------------------------------------------

export const ROR_WEIGHTS = { wq: 0.4, trend: 0.2, pl: 0.15, es: 0.15, rs: 0.1 } as const;

export const WQ_WEIGHTS: Record<WqKey, number> = {
  do: 0.3,
  bod: 0.25,
  ph: 0.15,
  turbidity: 0.15,
  waste: 0.15,
};

export const WQ_LABELS: Record<WqKey, string> = {
  do: "Dissolved oxygen (DO)",
  bod: "BOD",
  ph: "pH",
  turbidity: "Turbidity",
  waste: "Floating waste / foam",
};

export const TREND_SCORES: Record<TrendState, number> = {
  muchBetter: 100,
  better: 75,
  same: 50,
  worse: 25,
  muchWorse: 0,
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

export type Band = { min: number; name: string; hex: string; blurb: string };

export const BANDS: Band[] = [
  { min: 90, name: "Platinum", hex: "#2fbf8f", blurb: "Cleanest — near-natural conditions" },
  { min: 75, name: "Gold", hex: "#5fd8a8", blurb: "Healthy, minor pressure" },
  { min: 60, name: "Silver", hex: "#f0b429", blurb: "Impaired but recovering" },
  { min: 45, name: "Bronze", hex: "#f97316", blurb: "Degraded — needs attention" },
  { min: 25, name: "Watchlist", hex: "#f05252", blurb: "Dangerous — public alert" },
  { min: 0, name: "Critical", hex: "#000000", blurb: "Most dangerous" },
];

export function bandFor(score: number): Band {
  return BANDS.find((b) => score >= b.min) ?? BANDS[BANDS.length - 1];
}

// --- scoring functions ------------------------------------------------------

const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));

function paramScore(key: WqKey, v: number): number {
  switch (key) {
    case "do": // 5 mg/l healthy → 100, 0 → 0
      return clamp((100 * v) / 5);
    case "bod": // ≤ 3 mg/l → 100, 30 → 0 (standard ≤ 3)
      return clamp((100 * (30 - v)) / 27);
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

function computeWq(wq: Partial<Record<WqKey, WqReading>>): { score: number; detail: WqDetail[] } {
  const detail: WqDetail[] = (Object.keys(wq) as WqKey[]).map((k) => ({
    key: k,
    weight: WQ_WEIGHTS[k],
    score: paramScore(k, wq[k]!.value),
    reading: wq[k]!,
  }));
  const totalW = detail.reduce((s, d) => s + d.weight, 0);
  const score = totalW > 0 ? detail.reduce((s, d) => s + d.weight * d.score, 0) / totalW : 0;
  return { score, detail };
}

function computeLoad(input: RorInput): number {
  if (!input.load) return 0;
  const val = input.load.mgd ?? (input.load.share! / 68.71) * MAX_MGD; // share scaled to Najafgarh
  return clamp(100 * (1 - val / MAX_MGD));
}

export type RorResult = {
  drainId: number;
  wq: number;
  trend: number;
  pl: number;
  es: number;
  rs: number;
  total: number;
  band: Band;
  wqDetail: WqDetail[];
  prevTotal?: number;
  prevBand?: Band;
};

export function computeRor(input: RorInput): RorResult {
  const { score: wq, detail: wqDetail } = computeWq(input.wq);
  const trend = TREND_SCORES[input.trend.state];
  const pl = computeLoad(input);
  const es = clamp(100 - input.exposurePenalty);
  const rs = clamp(input.sourceCount * 25);
  const total = Math.round(
    ROR_WEIGHTS.wq * wq +
      ROR_WEIGHTS.trend * trend +
      ROR_WEIGHTS.pl * pl +
      ROR_WEIGHTS.es * es +
      ROR_WEIGHTS.rs * rs
  );

  let prevTotal: number | undefined;
  let prevBand: Band | undefined;
  if (input.prev) {
    const p = computeRor({
      drainId: input.drainId,
      wq: input.prev.wq,
      trend: { state: "same", note: "" },
      load: input.load,
      exposurePenalty: input.exposurePenalty,
      exposureNote: input.exposureNote,
      sourceCount: input.sourceCount,
    });
    prevTotal = p.total;
    prevBand = p.band;
  }

  return { drainId: input.drainId, wq, trend, pl, es, rs, total, band: bandFor(total), wqDetail, prevTotal, prevBand };
}

// --- rated drains (public data only) ----------------------------------------

export const ROR_INPUTS: RorInput[] = [
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
    exposurePenalty: 60,
    exposureNote: "Floodplain farms (Asghar Ali study), dense colonies, Category D wetland at outfall",
    sourceCount: 4, // SPRF · DJB · DPCC · NGT
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
    exposurePenalty: 55,
    exposureNote: "Dense residential (Sahibabad/Loni), farms at confluence, Noida colonies downstream",
    sourceCount: 3, // SPRF · DPCC · CPCB
  },
];

const RATINGS: Record<number, RorResult> = Object.fromEntries(
  ROR_INPUTS.map((i) => [i.drainId, computeRor(i)])
);

export function getRating(drainId: number): RorResult | undefined {
  return RATINGS[drainId];
}
