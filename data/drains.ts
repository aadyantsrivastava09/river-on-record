// ---------------------------------------------------------------------------
// RIVER ON RECORD — DATA LAYER
// Compiled from official public records — see
// "Yamuna 22 km Drain Public Records" (compiled Aug 2026):
// DPCC monthly drain analysis reports (Jul–Sep 2026), DPCC/DoE "Progress in
// Rejuvenation of River Yamuna" (Apr 2025), NMCG progress reports (Jan 2026),
// DJB discharge assessments (May 2026), HT/ANI/ET/The Hindu citing official
// data. Every figure carries its source. No number is invented.
// ---------------------------------------------------------------------------

import { RIVER_SAMPLES } from "@/data/water-quality";

export type TapStatus =
  | "Tapped"
  | "Partially tapped"
  | "Work in progress"
  | "To be tapped"
  | "Not to be tapped";

// UI colors for tapping status (shared by Scoreboard + DrainMap)
export const STATUS_COLORS: Record<TapStatus, string> = {
  Tapped: "#2fbf8f",
  "Partially tapped": "#f0b429",
  "Work in progress": "#f97316",
  "To be tapped": "#f05252",
  "Not to be tapped": "#56c8e8",
};

export type Drain = {
  id: number; // stable internal ID
  dpccId: number; // official DPCC S.No in the Sep 2026 report
  name: string;
  bank: "West" | "East";
  status: TapStatus; // latest public tapping status (NMCG Jan 2026)
  dischargePct: number | null; // share of 22-drain discharge, DPCC 2025
  bodPct: number | null; // share of BOD load, DPCC 2025
  passedStandards?: boolean; // only drain meeting all standards, DPCC Oct 2025
  noFlow?: boolean; // recorded NO FLOW in DPCC Sep 2026 sampling (07.09.2026)
  note: string;
  source: string;
  pos: number; // 0 = Wazirabad (top) .. 1 = Okhla (bottom), stylised map
};

// DPCC Sep 2026 roster (22 outfalls). RME/RD-180 and Drain No. 12A replace
// Tehkhand and Tuglakabad in the Sep 2026 DPCC table; the latter two are not
// sampled in this round.
// Status counts: 10 tapped, 2 partially tapped, 3 work in progress,
// 6 to be tapped, 1 not to be tapped (NMCG Jan 2026).
export const DRAINS: Drain[] = [
  {
    id: 1,
    dpccId: 2,
    name: "Najafgarh Drain (ex-Sahibi River)",
    bank: "West",
    status: "Work in progress",
    dischargePct: 69.77,
    bodPct: 59.93,
    note: "Largest single source. Once the rain-fed Sahibi River (~51 km as a drain from Dhansa); 126 small and large drains feed its system. Discharge ~862 MGD — more than all 37 STPs combined (814.23 MGD). Joins near Sur Ghat / Signature Bridge. Sep 2026: BOD 62, TSS 120 mg/L — both above norms.",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; DPCC Aug 2026; NMCG Jan 2026; DJB May 2026; HT 16 Dec 2025; The Hindu 15 Apr 2026",
    pos: 0.05,
  },
  {
    id: 2,
    dpccId: 20,
    name: "Shahdara Drain",
    bank: "East",
    status: "Work in progress",
    dischargePct: 16.12,
    bodPct: 27.48,
    note: "Second-largest pollution source. Receives three UP outfalls — Banthala, Indrapuri and Sahibabad. Sep 2026: BOD 120, TSS 242 mg/L; UP feeders were 110–120 BOD in Jul 2026. Joins below Okhla Barrage near Noida.",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; DPCC Aug 2026; NMCG Jan 2026; DPCC Oct 2025 via HT; TNIE Jul 2025",
    pos: 0.97,
  },
  {
    id: 3,
    dpccId: 17,
    name: "Barapullah Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: 4.92,
    bodPct: 3.5,
    note: "Third-largest by flow (4.92% discharge, 3.50% BOD load, DPCC 2025). Tapped and routed to Okhla STP/Agra Canal, but DPCC still recorded flow in Sep 2026: BOD 125, the worst of the round.",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.52,
  },
  {
    id: 4,
    dpccId: 13,
    name: "Power House / Delhi Gate Drain",
    bank: "West",
    status: "Partially tapped",
    dischargePct: 4.16,
    bodPct: 3.52,
    note: "4.16% discharge, 3.52% BOD load (DPCC 2025). Partially tapped; Sep 2026 BOD 86, TSS 172 mg/L.",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.38,
  },
  {
    id: 5,
    dpccId: 7,
    name: "ISBT Drain (Qudsia Bagh / Mori Gate)",
    bank: "West",
    status: "To be tapped",
    dischargePct: 1.47,
    bodPct: 1.57,
    note: "Old-city drain at Qudsia Bagh / Mori Gate. 1.47% discharge, 1.57% BOD load (DPCC 2025). Untapped; STP proposed at the mouth. Sep 2026: BOD 90, TSS 140 mg/L.",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.3,
  },
  {
    id: 6,
    dpccId: 14,
    name: "Sen Nursing Home Drain",
    bank: "West",
    status: "Partially tapped",
    dischargePct: 1.47,
    bodPct: 1.38,
    note: "1.47% discharge, 1.38% BOD load (DPCC 2025). Partially tapped. Sep 2026: BOD 106, TSS 220 mg/L.",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.42,
  },
  {
    id: 7,
    dpccId: 18,
    name: "Maharani Bagh Drain",
    bank: "West",
    status: "Work in progress",
    dischargePct: 1.03,
    bodPct: 1.24,
    note: "South Delhi outfall near the Ring Road corridor. 1.03% discharge, 1.24% BOD load (DPCC 2025). Tapping work in progress. Sep 2026: BOD 88, TSS 168 mg/L.",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.55,
  },
  {
    id: 8,
    dpccId: 11,
    name: "Kailash Nagar Drain",
    bank: "East",
    status: "To be tapped",
    dischargePct: 0.46,
    bodPct: 0.35,
    note: "0.46% discharge, 0.35% BOD load (DPCC 2025). Untapped; STP proposed at the mouth. Sep 2026: BOD 82, TSS 126 mg/L.",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.58,
  },
  {
    id: 9,
    dpccId: 19,
    name: "Abul Fazal Drain",
    bank: "East",
    status: "Not to be tapped",
    dischargePct: 0.24,
    bodPct: 0.49,
    note: "0.24% discharge, 0.49% BOD load (DPCC 2025). NMCG Jan 2026 says it is not to be tapped: it will carry treated effluent from Okhla STP downstream to increase environmental flow. Sep 2026: BOD 48, TSS 96 mg/L.",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.62,
  },
  {
    id: 10,
    dpccId: 1,
    name: "Sonia Vihar Drain",
    bank: "East",
    status: "Tapped",
    dischargePct: 0.23,
    bodPct: 0.23,
    note: "North-east Delhi outfall. 0.23% discharge, 0.23% BOD load (DPCC 2025). Tapped to Sonia Vihar STP, but DPCC continues to record flow. Sep 2026: BOD 66, TSS 108 mg/L.",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.18,
  },
  {
    id: 11,
    dpccId: 22,
    name: "Jaitpur Drain",
    bank: "East",
    status: "To be tapped",
    dischargePct: 0.19,
    bodPct: 0.17,
    note: "Southern-most east-bank outfall. 0.19% discharge, 0.17% BOD load (DPCC 2025). Untapped; proposed STP at Tajpur Pahari. Sep 2026: BOD 70, TSS 130 mg/L.",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.88,
  },
  {
    id: 12,
    dpccId: 10,
    name: "Shastri Park Drain",
    bank: "East",
    status: "To be tapped",
    dischargePct: 0.18,
    bodPct: 0.13,
    passedStandards: true,
    note: "0.18% discharge, 0.13% BOD load (DPCC 2025). The ONLY drain meeting all water-quality standards in the DPCC Oct 2025 round. Sep 2026: BOD 85, TSS 156 — no longer meeting the norm.",
    source: "DPCC Apr 2025; DPCC Oct 2025 via HT; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.45,
  },
  {
    id: 13,
    dpccId: 6,
    name: "Metcalf House Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in DPCC Sep 2026 sampling (07.09.2026).",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.12,
  },
  {
    id: 14,
    dpccId: 5,
    name: "Khyber Pass Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in DPCC Sep 2026 sampling (07.09.2026).",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.16,
  },
  {
    id: 15,
    dpccId: 4,
    name: "Sweeper Colony Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in DPCC Sep 2026 sampling (07.09.2026).",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.45,
  },
  {
    id: 16,
    dpccId: 3,
    name: "Magazine Road Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in DPCC Sep 2026 sampling (07.09.2026).",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.28,
  },
  {
    id: 17,
    dpccId: 8,
    name: "Tonga Stand Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in DPCC Sep 2026 sampling (07.09.2026).",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.32,
  },
  {
    id: 18,
    dpccId: 9,
    name: "Moat Drain (Vijay Ghat)",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in DPCC Sep 2026 sampling (07.09.2026).",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.22,
  },
  {
    id: 19,
    dpccId: 16,
    name: "Drain No. 14",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: false,
    note: "Tapped, but carried monsoon flow in Sep 2026 — BOD 34 mg/L, the closest of any flowing drain to the 30 norm.",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.1,
  },
  {
    id: 20,
    dpccId: 21,
    name: "RME / RD-180 (Madanpur Khadar Extn)",
    bank: "East",
    status: "To be tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: false,
    note: "Newly identified drain in the current DPCC roster; replaces Tehkhand. Untapped, with an STP proposed at the mouth. Sep 2026: BOD 75, TSS 180 mg/L. No published 2025 flow share.",
    source: "DPCC Sep 2026 Report DPCC/W/D/2026/311–322; DPCC Aug 2026; NMCG Jan 2026",
    pos: 0.93,
  },
  {
    id: 21,
    dpccId: 12,
    name: "Civil Mill Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in DPCC Sep 2026 sampling (07.09.2026).",
    source: "DPCC Apr 2025; DPCC Sep 2026 Report DPCC/W/D/2026/311–322; NMCG Jan 2026",
    pos: 0.33,
  },
  {
    id: 22,
    dpccId: 15,
    name: "Drain No. 12A",
    bank: "West",
    status: "To be tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: false,
    note: "Newly reported in the current DPCC roster; replaces Tuglakabad. It was no flow in Aug 2026 but flowing in Sep 2026: BOD 120, TSS 244 mg/L. Untapped; STP proposed at the mouth. No published 2025 flow share.",
    source: "DPCC Sep 2026 Report DPCC/W/D/2026/311–322; DPCC Aug 2026; NMCG Jan 2026",
    pos: 0.47,
  },
];

// DPCC Sep 2026 river-station readings, shared by the map and charts.
// Wazirabad DO is blank in the official table and remains null ("n/r").
export type QualityPoint = {
  site: string;
  do2026: number | null;
  fc: number;
  bod: number;
  ph: number;
};

export const DO_FC: QualityPoint[] = RIVER_SAMPLES.map((p) => ({
  site: p.site,
  do2026: p.do,
  fc: p.fc,
  bod: p.bod,
  ph: p.ph,
}));

// BOD annual averages — Delhi Dept of Environment (2017 / 2020 / 2024)
export const BOD_TREND = [
  { site: "Palla", y2017: 2.8, y2020: 2.7, y2024: 2.5 },
  { site: "Wazirabad", y2017: 7.4, y2020: 7.5, y2024: 6.8 },
  { site: "ISBT", y2017: 10.2, y2020: 10.3, y2024: 9.3 },
  { site: "ITO", y2017: 16.5, y2020: 16.8, y2024: 15.0 },
  { site: "Nizamuddin", y2017: 22.8, y2020: 23.2, y2024: 21.0 },
  { site: "Okhla", y2017: 27.5, y2020: 27.8, y2024: 26.0 },
  { site: "Asgarpur", y2017: 30.0, y2020: 30.8, y2024: 29.0 },
];

// Discharge share of the 22 drains — DPCC 2025 (official roster)
export const LOAD_SPLIT = [
  { name: "Najafgarh", value: 69.77 },
  { name: "Shahdara", value: 16.12 },
  { name: "Other 20 drains", value: 14.11 },
];

// ---------------------------------------------------------------------------
// HEADLINE FACTS (public records, compiled Sep 2026)
// ---------------------------------------------------------------------------
export const FACTS = [
  { value: "22", unit: "km", label: "from alive at Palla to nil DO at Asgarpur — barely 2% of the river, >80% of its pollution" },
  { value: "1,324.4", unit: "MGD", label: "drain flow, May 2026 — DJB revised it UP 76% from 750.4 MGD" },
  { value: "15/15", unit: "", label: "flowing drains failed the BOD 30 mg/L norm in the Sep 2026 DPCC round — range 34–125" },
  { value: "~862", unit: "MGD", label: "Najafgarh drain alone — more than all 37 STPs combined (814.23 MGD, DJB May 2026)" },
  { value: "87%", unit: "", label: "of the BOD load comes from two drains — Najafgarh 59.93% + Shahdara 27.48% (DPCC, Apr 2025)" },
];

export const TICKER_ITEMS = [
  "DO nil only at Asgarpur exit — ISBT 2.9, Okhla 4.0 (Sep 2026, DPCC)",
  "Najafgarh + Shahdara ≈ 87% of drain BOD load (DPCC, Apr 2025)",
  "Drain flow revised UP 76% — 750.4 → 1,324.4 MGD (DJB, May 2026)",
  "Sep 2026: all 15 flowing drains exceeded BOD 30 mg/L — range 34–125, worst Barapullah",
  "Shastri Park — the only Oct 2025 pass — BOD 85 in Sep 2026, still failing",
  "7 of 22 drains recorded NO FLOW on 07.09.2026 (DPCC)",
  "10 of 22 drains tapped; Abul Fazal not to be tapped (NMCG, Jan 2026)",
  "ISP deadline Dec 2026 — 26 sub-drains still untrapped (est. 30–40 MGD)",
  "No legal limit for surfactants in Indian rivers (TERI, Dec 2025)",
];

// ---------------------------------------------------------------------------
// RATING SYSTEM — see data/dhs.ts (DHS — Drain Health Score, final system)
// ---------------------------------------------------------------------------
