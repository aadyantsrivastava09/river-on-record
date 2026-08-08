// ---------------------------------------------------------------------------
// RIVER ON RECORD — DATA LAYER
// Compiled from official public records — see
// "Yamuna 22 km Drain Public Records" (compiled Aug 2026):
// DPCC monthly drain analysis reports (Jun–Jul 2026), DPCC/DoE "Progress in
// Rejuvenation of River Yamuna" (Apr 2025), DJB discharge assessments
// (May 2026), NMCG progress reports (Jul 2025), HT/ANI/ET/The Hindu citing
// official data. Every figure carries its source. No number is invented.
// ---------------------------------------------------------------------------

export type TapStatus = "Tapped" | "Partially tapped" | "Work in progress" | "To be tapped";

// UI colors for tapping status (shared by Scoreboard + DrainMap)
export const STATUS_COLORS: Record<TapStatus, string> = {
  Tapped: "#2fbf8f",
  "Partially tapped": "#f0b429",
  "Work in progress": "#f97316",
  "To be tapped": "#f05252",
};

export type Drain = {
  id: number;
  name: string;
  bank: "West" | "East";
  status: TapStatus; // interception/tapping status, DPCC Apr 2025
  dischargePct: number | null; // share of 22-drain discharge, DPCC 2025
  bodPct: number | null; // share of BOD load, DPCC 2025
  passedStandards?: boolean; // only drain meeting all standards, DPCC Oct 2025
  noFlow?: boolean; // recorded NO FLOW in recent DPCC sampling (tapped)
  note: string;
  source: string;
  pos: number; // 0 = Wazirabad (top) .. 1 = Okhla (bottom), stylised map
};

// Official 22-drain roster (DPCC Apr 2025 progress report + DPCC Jul 2026
// sampling, Report No. DPCC/W/D/2026/223–244//3039). 10 tapped, 2 partially
// tapped, 6 work in progress, 4 to be tapped.
export const DRAINS: Drain[] = [
  {
    id: 1,
    name: "Najafgarh Drain (ex-Sahibi River)",
    bank: "West",
    status: "Work in progress",
    dischargePct: 69.77,
    bodPct: 59.93,
    note: "Largest single source. Once the rain-fed Sahibi River (~51 km as a drain from Dhansa); 126 small and large drains feed its system. Discharge ~862 MGD — more than all 37 STPs combined (814.23 MGD). Joins near Sur Ghat / Signature Bridge. Jul 2026: BOD 70, TSS 120 mg/L — both far above norms.",
    source: "DPCC Apr 2025; DPCC Jul 2026 Report DPCC/W/D/2026/223–244//3039; DJB May 2026; HT 16 Dec 2025; The Hindu 15 Apr 2026",
    pos: 0.05,
  },
  {
    id: 2,
    name: "Shahdara Drain",
    bank: "East",
    status: "Work in progress",
    dischargePct: 16.12,
    bodPct: 27.48,
    note: "Second-largest pollution source. Receives three UP outfalls — Banthala, Indrapuri and Sahibabad. Jul 2026: drain outfall BOD 125, TSS 240 mg/L; UP feeders Banthala 120, Indrapuri 110, Sahibabad 115 BOD. Joins below Okhla Barrage near Noida.",
    source: "DPCC Apr 2025; DPCC Jul 2026 Report DPCC/W/D/2026/223–244//3039; DPCC Oct 2025 via HT; TNIE Jul 2025",
    pos: 0.97,
  },
  {
    id: 3,
    name: "Barapulla Drain",
    bank: "West",
    status: "Work in progress",
    dischargePct: 4.92,
    bodPct: 3.5,
    note: "Third-largest by flow (4.92% discharge, 3.50% BOD load, DPCC 2025). Runs under the Barapullah flyover corridor in south Delhi.",
    source: "DPCC Apr 2025",
    pos: 0.52,
  },
  {
    id: 4,
    name: "Power House / Delhi Gate Drain",
    bank: "West",
    status: "Partially tapped",
    dischargePct: 4.16,
    bodPct: 3.52,
    note: "4.16% discharge, 3.52% BOD load (DPCC 2025). Partially tapped as of Apr 2025.",
    source: "DPCC Apr 2025",
    pos: 0.38,
  },
  {
    id: 5,
    name: "ISBT Drain (Qudsia Bagh / Mori Gate)",
    bank: "West",
    status: "Work in progress",
    dischargePct: 1.47,
    bodPct: 1.57,
    note: "Old-city drain at Qudsia Bagh / Mori Gate. 1.47% discharge, 1.57% BOD load (DPCC 2025).",
    source: "DPCC Apr 2025",
    pos: 0.3,
  },
  {
    id: 6,
    name: "Sen Nursing Home Drain",
    bank: "West",
    status: "Partially tapped",
    dischargePct: 1.47,
    bodPct: 1.38,
    note: "1.47% discharge, 1.38% BOD load (DPCC 2025). Partially tapped as of Apr 2025.",
    source: "DPCC Apr 2025",
    pos: 0.42,
  },
  {
    id: 7,
    name: "Maharani Bagh Drain",
    bank: "West",
    status: "Work in progress",
    dischargePct: 1.03,
    bodPct: 1.24,
    note: "South Delhi outfall near the Ring Road corridor. 1.03% discharge, 1.24% BOD load (DPCC 2025).",
    source: "DPCC Apr 2025",
    pos: 0.55,
  },
  {
    id: 8,
    name: "Kailash Nagar Drain",
    bank: "East",
    status: "To be tapped",
    dischargePct: 0.46,
    bodPct: 0.35,
    note: "0.46% discharge, 0.35% BOD load (DPCC 2025). Interception not yet started.",
    source: "DPCC Apr 2025",
    pos: 0.58,
  },
  {
    id: 9,
    name: "Abul Fazal Drain",
    bank: "East",
    status: "To be tapped",
    dischargePct: 0.24,
    bodPct: 0.49,
    note: "0.24% discharge, 0.49% BOD load (DPCC 2025). Interception not yet started.",
    source: "DPCC Apr 2025",
    pos: 0.62,
  },
  {
    id: 10,
    name: "Sonia Vihar Drain",
    bank: "East",
    status: "Work in progress",
    dischargePct: 0.23,
    bodPct: 0.23,
    note: "North-east Delhi outfall. 0.23% discharge, 0.23% BOD load (DPCC 2025).",
    source: "DPCC Apr 2025",
    pos: 0.18,
  },
  {
    id: 11,
    name: "Jaitpur Drain",
    bank: "East",
    status: "To be tapped",
    dischargePct: 0.19,
    bodPct: 0.17,
    note: "Southern-most east-bank outfall. 0.19% discharge, 0.17% BOD load (DPCC 2025).",
    source: "DPCC Apr 2025",
    pos: 0.88,
  },
  {
    id: 12,
    name: "Shastri Park Drain",
    bank: "East",
    status: "To be tapped",
    dischargePct: 0.18,
    bodPct: 0.13,
    passedStandards: true,
    note: "0.18% discharge, 0.13% BOD load (DPCC 2025). The ONLY drain meeting all water-quality standards in the DPCC Oct 2025 round (BOD ≤30, COD ≤250, TSS ≤100, pH 5.5–9). Jul 2026: BOD 95, TSS 168 — no longer meeting the norm.",
    source: "DPCC Apr 2025; DPCC Oct 2025 via HT; DPCC Jul 2026 Report DPCC/W/D/2026/223–244//3039",
    pos: 0.45,
  },
  {
    id: 13,
    name: "Metcalf House Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in recent DPCC sampling.",
    source: "DPCC Apr 2025; DPCC 2026 sampling",
    pos: 0.12,
  },
  {
    id: 14,
    name: "Khyber Pass Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in recent DPCC sampling.",
    source: "DPCC Apr 2025; DPCC 2026 sampling",
    pos: 0.16,
  },
  {
    id: 15,
    name: "Sweeper Colony Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in recent DPCC sampling.",
    source: "DPCC Apr 2025; DPCC 2026 sampling",
    pos: 0.45,
  },
  {
    id: 16,
    name: "Magazine Road Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in recent DPCC sampling.",
    source: "DPCC Apr 2025; DPCC 2026 sampling",
    pos: 0.28,
  },
  {
    id: 17,
    name: "Tonga Stand Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in recent DPCC sampling.",
    source: "DPCC Apr 2025; DPCC 2026 sampling",
    pos: 0.32,
  },
  {
    id: 18,
    name: "Moat Drain (Vijay Ghat)",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in recent DPCC sampling.",
    source: "DPCC Apr 2025; DPCC 2026 sampling",
    pos: 0.22,
  },
  {
    id: 19,
    name: "Drain No. 14",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: false,
    note: "Tapped, but carried monsoon flow in the Jul 2026 DPCC round — BOD 32 mg/L, the closest of any flowing drain to the 30 norm.",
    source: "DPCC Apr 2025; DPCC Jul 2026 Report DPCC/W/D/2026/223–244//3039",
    pos: 0.1,
  },
  {
    id: 20,
    name: "Tehkhand Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in recent DPCC sampling. South-east industrial belt.",
    source: "DPCC Apr 2025; DPCC 2026 sampling",
    pos: 0.8,
  },
  {
    id: 21,
    name: "Civil Mill Drain",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in recent DPCC sampling.",
    source: "DPCC Apr 2025; DPCC 2026 sampling",
    pos: 0.33,
  },
  {
    id: 22,
    name: "Tuglakabad Drain (Kalkaji merged)",
    bank: "West",
    status: "Tapped",
    dischargePct: null,
    bodPct: null,
    noFlow: true,
    note: "Tapped — negligible remaining outfall share; recorded NO FLOW in recent DPCC sampling. Kalkaji Drain merged into it.",
    source: "DPCC Apr 2025; DPCC 2026 sampling",
    pos: 0.9,
  },
];

// ---------------------------------------------------------------------------
// WATER QUALITY — DO & FAECAL COLIFORM (May 2026, DPCC via India Today)
// River-station readings along the 22 km stretch.
// ---------------------------------------------------------------------------
export type QualityPoint = {
  site: string;
  do2026: number;
  do2025: number | null;
  fc: number;
};

export const DO_FC: QualityPoint[] = [
  { site: "Palla (entry)", do2026: 5.9, do2025: 5, fc: 2200 },
  { site: "Wazirabad", do2026: 3.1, do2025: 6.8, fc: 3500 },
  { site: "ISBT Bridge", do2026: 0, do2025: 0, fc: 130000 },
  { site: "ITO Bridge", do2026: 0, do2025: 0, fc: 120000 },
  { site: "Nizamuddin", do2026: 0, do2025: 0, fc: 110000 },
  { site: "Okhla Barrage", do2026: 0, do2025: 0, fc: 140000 },
  { site: "Asgarpur (exit)", do2026: 0, do2025: 0, fc: 330000 },
];

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
// HEADLINE FACTS (public records, compiled Aug 2026)
// ---------------------------------------------------------------------------
export const FACTS = [
  { value: "22", unit: "km", label: "from alive (Palla) to biologically dead (Okhla) — barely 2% of the river, >80% of its pollution" },
  { value: "1,324.4", unit: "MGD", label: "drain flow, May 2026 — DJB revised it UP 76% from 750.4 MGD" },
  { value: "26/27", unit: "", label: "drains failed water-quality standards in the Oct 2025 DPCC round — only Shastri Park passed" },
  { value: "~862", unit: "MGD", label: "Najafgarh drain alone — more than all 37 STPs combined (814.23 MGD)" },
  { value: "87%", unit: "", label: "of the BOD load comes from two drains — Najafgarh 59.93% + Shahdara 27.48%" },
];

export const TICKER_ITEMS = [
  "DO 0 at ISBT · ITO · Nizamuddin · Okhla (May 2026, DPCC)",
  "Najafgarh + Shahdara ≈ 84% of drain pollution (TNIE, Jul 2025)",
  "Drain flow revised UP 76% — 750.4 → 1,324.4 MGD (DJB, May 2026)",
  "July 2026 round (06.07.2026): every flowing drain exceeded the BOD 30 mg/L norm — range 32–130, worst Barapulla",
  "Shastri Park — the only Oct 2025 pass — missed the norm again in Jul 2026 (BOD 95)",
  "10 of 22 drains tapped — NO FLOW in DPCC sampling (8 still no-flow in Jul 2026)",
  "ISP deadline Dec 2026 — 26 sub-drains still untrapped (est. 30–40 MGD)",
  "No legal limit for surfactants in Indian rivers (TERI, Dec 2025)",
];

// ---------------------------------------------------------------------------
// RATING SYSTEM — see data/dhs.ts (DHS — Drain Health Score, final system)
// ---------------------------------------------------------------------------
