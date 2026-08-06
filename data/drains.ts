// ---------------------------------------------------------------------------
// RIVER ON RECORD — DATA LAYER
// Every number here comes from PUBLIC, government-backed sources only:
// DPCC monthly reports (May 2026), CPCB, DJB, NGT orders, CSE/Tribune, TERI.
// Source is attached to every row so each rating can be audited.
// ---------------------------------------------------------------------------

export type Drain = {
  id: number;
  name: string;
  share: number | null; // % of the 22-drain wastewater load
  discharge: string | null; // last public discharge figure
  bod: string | null; // last public BOD reading at discharge
  worst: string | null; // worst publicly reported parameter
  note: string;
  source: string;
  pos: number; // 0 = Wazirabad (top) .. 1 = Okhla (bottom), stylised map
};

export const DRAINS: Drain[] = [
  { id: 1, name: "Najafgarh", share: 68.71, discharge: "~632 MGD (revised ~862)", bod: "96 mg/l (discharge)", worst: "BOD 96 mg/l — ~10x the drain standard of 10", note: "126 sub-drains feed it. Meets the Yamuna just below Wazirabad. Category D wetland. Fish-kill incident 2022.", source: "SPRF Mar 2026; DJB reassessment May 2026", pos: 0.03 },
  { id: 2, name: "Supplementary Drain", share: null, discharge: null, bod: null, worst: null, note: "Runs parallel to Najafgarh; part of the same basin system.", source: "DPCC monthly report", pos: 0.05 },
  { id: 3, name: "Shahdara", share: 10.9, discharge: null, bod: "100–159 mg/l (some days)", worst: "COD 52 mg/l at confluence — worst point in the Delhi stretch", note: "45% of flow arrives from UP (Sahibabad, Loni). Joins below Okhla, near Noida. Built after the 1961 floods.", source: "SPRF Mar 2026; DPCC Aug report", pos: 1.0 },
  { id: 4, name: "Drain No. 14 (Khyber Pass)", share: null, discharge: null, bod: null, worst: null, note: "Major northern drain; monitored by DJB under the interceptor project.", source: "DPCC monthly report", pos: 0.08 },
  { id: 5, name: "Mori Gate", share: null, discharge: null, bod: null, worst: null, note: "Old city drain discharging into the Yamuna Bazaar stretch.", source: "DPCC monthly report", pos: 0.12 },
  { id: 6, name: "Yamuna Bazaar", share: null, discharge: null, bod: null, worst: null, note: "Central Delhi outfall near ISBT; dense urban catchment.", source: "DPCC monthly report", pos: 0.15 },
  { id: 7, name: "Delhi Gate", share: null, discharge: null, bod: null, worst: null, note: "One of the drains with DJB online monitoring already live.", source: "DJB online monitoring list", pos: 0.18 },
  { id: 8, name: "Sen Nursing Home", share: null, discharge: null, bod: null, worst: null, note: "DJB real-time monitoring live on this drain.", source: "DJB online monitoring list", pos: 0.22 },
  { id: 9, name: "Sweeper Colony", share: null, discharge: null, bod: null, worst: null, note: "Residential outfall, central stretch.", source: "DPCC monthly report", pos: 0.26 },
  { id: 10, name: "Kudesia Ghat", share: null, discharge: null, bod: null, worst: null, note: "Ghat-side drain north of the old city.", source: "DPCC monthly report", pos: 0.3 },
  { id: 11, name: "Civil Lines", share: null, discharge: null, bod: null, worst: null, note: "Northern outfall near the Wazirabad barrage zone.", source: "DPCC monthly report", pos: 0.1 },
  { id: 12, name: "Kushak (Moti Bagh)", share: null, discharge: null, bod: null, worst: null, note: "South-west Delhi drain; part of the interceptor network.", source: "DPCC monthly report", pos: 0.38 },
  { id: 13, name: "Barapullah", share: null, discharge: null, bod: null, worst: null, note: "Large southern drain running under the Barapullah flyover.", source: "DPCC monthly report", pos: 0.44 },
  { id: 14, name: "Maharani Bagh", share: null, discharge: null, bod: null, worst: null, note: "South Delhi outfall near the Ring Road corridor.", source: "DPCC monthly report", pos: 0.5 },
  { id: 15, name: "Taimoor Nagar", share: null, discharge: null, bod: null, worst: null, note: "Residential-industrial outfall, south stretch.", source: "DPCC monthly report", pos: 0.56 },
  { id: 16, name: "Nizamuddin", share: null, discharge: null, bod: null, worst: null, note: "Opposite Nizamuddin bridge — DO reads 0 at the adjacent monitoring point.", source: "DPCC May 2026", pos: 0.62 },
  { id: 17, name: "Sarai Kale Khan", share: null, discharge: null, bod: null, worst: null, note: "Drain at the Sarai Kale Khan interchange.", source: "DPCC monthly report", pos: 0.68 },
  { id: 18, name: "Okhla", share: null, discharge: null, bod: null, worst: null, note: "Feeds the Okhla barrage zone; the foam is most visible here.", source: "DPCC May 2026", pos: 0.78 },
  { id: 19, name: "Tehkhand", share: null, discharge: null, bod: null, worst: null, note: "South-east outfall near the Okhla industrial belt.", source: "DPCC monthly report", pos: 0.84 },
  { id: 20, name: "Tuglakabad", share: null, discharge: null, bod: null, worst: null, note: "Industrial-area drain in the south-east.", source: "DPCC monthly report", pos: 0.88 },
  { id: 21, name: "Kalindi Kunj", share: null, discharge: null, bod: null, worst: null, note: "The ghat where devotees stand in foam every Chhath Puja.", source: "DPCC monthly report", pos: 0.92 },
  { id: 22, name: "Jaitpur", share: null, discharge: null, bod: null, worst: null, note: "Southern-most drain; DJB online monitoring live here too.", source: "DJB online monitoring list", pos: 0.96 },
];

// ---------------------------------------------------------------------------
// WATER QUALITY — DO & FAECAL COLIFORM (May 2026, DPCC via India Today)
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

// Drain load split
export const LOAD_SPLIT = [
  { name: "Najafgarh", value: 68.71 },
  { name: "Shahdara", value: 10.9 },
  { name: "Other 20 drains", value: 20.39 },
];

// ---------------------------------------------------------------------------
// HEADLINE FACTS (public data)
// ---------------------------------------------------------------------------
export const FACTS = [
  { value: "22", unit: "km", label: "from alive (Palla) to biologically dead (Okhla)" },
  { value: "76–80%", unit: "", label: "of the entire Yamuna's pollution lands in this stretch — under 2% of its length" },
  { value: "330,000", unit: "MPN/100ml", label: "faecal coliform at Asgarpur — 132x the legal maximum of 2,500" },
  { value: "174–200", unit: "MGD", label: "of untreated sewage enters the drains every single day" },
  { value: "Rs 8,000+", unit: "crore", label: "spent across Yamuna Action Plans I–III and Namami Gange — and the river still dies in 22 km" },
];

export const TICKER_ITEMS = [
  "DO 0 at ISBT · ITO · Nizamuddin · Okhla (May 2026, DPCC)",
  "Najafgarh + Shahdara = ~80% of the drain load",
  "41 government real-time monitors installed — reports read by almost nobody",
  "No legal limit for surfactants in Indian rivers (TERI, Dec 2025)",
  "9 of 37 STPs failed CPCB standards in April 2026",
  "Home Minister demanded third-party verification (Jul 2025)",
];

// ---------------------------------------------------------------------------
// RATING SYSTEM — see data/ror.ts (RoRES — River on Record Environmental Score)
// ---------------------------------------------------------------------------
