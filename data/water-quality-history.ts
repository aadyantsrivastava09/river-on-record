
// ---------------------------------------------------------------------------
// HISTORICAL DRAIN ROUNDS — Mar 2025 → Sep 2026
// Transcribed from the verified workbook "Yamuna 22 Drain Verified Data.xlsx"
// Mar-2025 source: NMCG Delhi MPR March 2025, Annexure-3
// Jun/Jul-2026 source: DPCC monthly drain reports (scan-transcribed)
// Aug/Sep-2026 source: DPCC PDFs linked in LATEST_ROUND / PREV_ROUND
// ---------------------------------------------------------------------------

import { LATEST_ROUND, PREV_ROUND, DRAIN_SAMPLES } from "./water-quality";
import type { DrainSample } from "./water-quality";

export type DrainRoundMeta = {
  key: string;
  label: string;
  sampled: string;
  report: string;
  sourceUrl: string;
  note?: string;
};

export const DRAIN_ROUNDS: DrainRoundMeta[] = [
  {
    key: "mar-2025",
    label: "Mar 2025",
    sampled: "05.03.2025",
    report: "NMCG Delhi MPR March 2025, Annexure-3",
    sourceUrl: "http://nmcg.nic.in/writereaddata/fileupload/ngtmpr/51_Delhi%20-%20MPR%20March%202025.pdf",
    note: "22-drain roster and flows; WQ values for drains sampled by NMCG/DJB.",
  },
  {
    key: "jun-2026",
    label: "Jun 2026",
    sampled: "03.06.2026",
    report: "DPCC/W/D/2026/200-222",
    sourceUrl: PREV_ROUND.indexUrl,
    note: "DPCC PDF is a scan; values transcribed from the verified workbook.",
  },
  {
    key: "jul-2026",
    label: "Jul 2026",
    sampled: "06.07.2026",
    report: "DPCC/W/D/2026/223-244",
    sourceUrl: PREV_ROUND.indexUrl,
    note: "DPCC PDF is a scan; values transcribed from the verified workbook.",
  },
  {
    key: "aug-2026",
    label: "Aug 2026",
    sampled: PREV_ROUND.sampled,
    report: PREV_ROUND.drainReport,
    sourceUrl: PREV_ROUND.drainUrl,
  },
  {
    key: "sep-2026",
    label: "Sep 2026",
    sampled: LATEST_ROUND.sampled,
    report: LATEST_ROUND.drainReport,
    sourceUrl: LATEST_ROUND.drainUrl,
  },
];

export const DRAIN_HISTORY: Record<number, Partial<Record<string, DrainSample | null>>> = {
  1: {
    "mar-2025": { noFlow: false, ph: 7.3, tss: 118, cod: 267, bod: 96 },
    "jun-2026": { noFlow: false, ph: 7.3, tss: 116, cod: 160, bod: 68 },
    "jul-2026": { noFlow: false, ph: 7.4, tss: 120, cod: 168, bod: 70 },
    "aug-2026": DRAIN_SAMPLES[1].prev,
    "sep-2026": DRAIN_SAMPLES[1].latest,
  },
  2: {
    "mar-2025": { noFlow: false, ph: 7.9, tss: 172, cod: 342, bod: 112 },
    "jun-2026": { noFlow: false, ph: 7.5, tss: 244, cod: 276, bod: 115 },
    "jul-2026": { noFlow: false, ph: 7.5, tss: 240, cod: 280, bod: 125 },
    "aug-2026": DRAIN_SAMPLES[2].prev,
    "sep-2026": DRAIN_SAMPLES[2].latest,
  },
  3: {
    "mar-2025": { noFlow: false, ph: 7.5, tss: 90, cod: 223, bod: 92 },
    "jun-2026": { noFlow: false, ph: 7.2, tss: 218, cod: 288, bod: 115 },
    "jul-2026": { noFlow: false, ph: 7.1, tss: 216, cod: 280, bod: 130 },
    "aug-2026": DRAIN_SAMPLES[3].prev,
    "sep-2026": DRAIN_SAMPLES[3].latest,
  },
  4: {
    "mar-2025": { noFlow: false, ph: 7.8, tss: 66, cod: 243, bod: 88 },
    "jun-2026": { noFlow: false, ph: 7.5, tss: 164, cod: 204, bod: 86 },
    "jul-2026": { noFlow: false, ph: 7.4, tss: 172, cod: 212, bod: 84 },
    "aug-2026": DRAIN_SAMPLES[4].prev,
    "sep-2026": DRAIN_SAMPLES[4].latest,
  },
  5: {
    "mar-2025": { noFlow: false, ph: 7.3, tss: 88, cod: 173, bod: 54 },
    "jun-2026": { noFlow: false, ph: 7.2, tss: 130, cod: 212, bod: 95 },
    "jul-2026": { noFlow: false, ph: 7.2, tss: null, cod: 220, bod: 105 },
    "aug-2026": DRAIN_SAMPLES[5].prev,
    "sep-2026": DRAIN_SAMPLES[5].latest,
  },
  6: {
    "mar-2025": { noFlow: false, ph: 7.4, tss: 134, cod: 327, bod: 124 },
    "jun-2026": { noFlow: false, ph: 7.3, tss: 208, cod: 224, bod: 94 },
    "jul-2026": { noFlow: false, ph: 7.2, tss: 212, cod: 232, bod: 98 },
    "aug-2026": DRAIN_SAMPLES[6].prev,
    "sep-2026": DRAIN_SAMPLES[6].latest,
  },
  7: {
    "mar-2025": { noFlow: false, ph: 7.5, tss: 210, cod: 262, bod: 88 },
    "jun-2026": { noFlow: false, ph: 7.4, tss: 172, cod: 220, bod: 94 },
    "jul-2026": { noFlow: false, ph: 7.2, tss: 170, cod: 220, bod: 90 },
    "aug-2026": DRAIN_SAMPLES[7].prev,
    "sep-2026": DRAIN_SAMPLES[7].latest,
  },
  8: {
    "mar-2025": { noFlow: false, ph: 7.5, tss: 54, cod: 173, bod: 52 },
    "jun-2026": { noFlow: false, ph: 7.3, tss: 134, cod: 212, bod: 84 },
    "jul-2026": { noFlow: false, ph: 6.9, tss: 138, cod: 208, bod: 80 },
    "aug-2026": DRAIN_SAMPLES[8].prev,
    "sep-2026": DRAIN_SAMPLES[8].latest,
  },
  9: {
    "mar-2025": { noFlow: false, ph: 7.7, tss: 31, cod: 267, bod: 92 },
    "jun-2026": { noFlow: false, ph: 6.9, tss: 94, cod: 116, bod: 48 },
    "jul-2026": { noFlow: false, ph: null, tss: 98, cod: 120, bod: 50 },
    "aug-2026": DRAIN_SAMPLES[9].prev,
    "sep-2026": DRAIN_SAMPLES[9].latest,
  },
  10: {
    "mar-2025": { noFlow: false, ph: 7.6, tss: 470, cod: 292, bod: 116 },
    "jun-2026": { noFlow: false, ph: 6.8, tss: 112, cod: 184, bod: 80 },
    "jul-2026": { noFlow: false, ph: 7.1, tss: 108, cod: 176, bod: 74 },
    "aug-2026": DRAIN_SAMPLES[10].prev,
    "sep-2026": DRAIN_SAMPLES[10].latest,
  },
  11: {
    "mar-2025": { noFlow: false, ph: 7.3, tss: 150, cod: 332, bod: 120 },
    "jun-2026": { noFlow: false, ph: 7.1, tss: 124, cod: 168, bod: 70 },
    "jul-2026": { noFlow: false, ph: 7.1, tss: 126, cod: 160, bod: 75 },
    "aug-2026": DRAIN_SAMPLES[11].prev,
    "sep-2026": DRAIN_SAMPLES[11].latest,
  },
  12: {
    "mar-2025": { noFlow: false, ph: 7.2, tss: 200, cod: 287, bod: 100 },
    "jun-2026": { noFlow: false, ph: 7.1, tss: 156, cod: 200, bod: 85 },
    "jul-2026": { noFlow: false, ph: 7.1, tss: 168, cod: 216, bod: 95 },
    "aug-2026": DRAIN_SAMPLES[12].prev,
    "sep-2026": DRAIN_SAMPLES[12].latest,
  },
  13: {
    "mar-2025": { noFlow: false, ph: 7.6, tss: 42, cod: 104, bod: 48 },
    "jun-2026": null,
    "jul-2026": { noFlow: false, ph: null, tss: 134, cod: 220, bod: null },
    "aug-2026": DRAIN_SAMPLES[13].prev,
    "sep-2026": DRAIN_SAMPLES[13].latest,
  },
  14: {
    "mar-2025": { noFlow: true },
    "jun-2026": { noFlow: true },
    "jul-2026": { noFlow: true },
    "aug-2026": DRAIN_SAMPLES[14].prev,
    "sep-2026": DRAIN_SAMPLES[14].latest,
  },
  15: {
    "mar-2025": null,
    "jun-2026": { noFlow: true },
    "jul-2026": null,
    "aug-2026": DRAIN_SAMPLES[15].prev,
    "sep-2026": DRAIN_SAMPLES[15].latest,
  },
  16: {
    "mar-2025": { noFlow: true },
    "jun-2026": null,
    "jul-2026": null,
    "aug-2026": DRAIN_SAMPLES[16].prev,
    "sep-2026": DRAIN_SAMPLES[16].latest,
  },
  17: {
    "mar-2025": { noFlow: true },
    "jun-2026": { noFlow: true },
    "jul-2026": { noFlow: true },
    "aug-2026": DRAIN_SAMPLES[17].prev,
    "sep-2026": DRAIN_SAMPLES[17].latest,
  },
  18: {
    "mar-2025": null,
    "jun-2026": { noFlow: true },
    "jul-2026": { noFlow: true },
    "aug-2026": DRAIN_SAMPLES[18].prev,
    "sep-2026": DRAIN_SAMPLES[18].latest,
  },
  19: {
    "mar-2025": { noFlow: true },
    "jun-2026": { noFlow: false, ph: 7.3, tss: 62, cod: 96, bod: 36 },
    "jul-2026": { noFlow: false, ph: 7.3, tss: 64, cod: 92, bod: 32 },
    "aug-2026": DRAIN_SAMPLES[19].prev,
    "sep-2026": DRAIN_SAMPLES[19].latest,
  },
  20: {
    "mar-2025": null,
    "jun-2026": { noFlow: false, ph: 6.9, tss: 180, cod: 208, bod: 85 },
    "jul-2026": { noFlow: false, ph: 6.9, tss: 170, cod: 200, bod: 80 },
    "aug-2026": DRAIN_SAMPLES[20].prev,
    "sep-2026": DRAIN_SAMPLES[20].latest,
  },
  21: {
    "mar-2025": { noFlow: true },
    "jun-2026": { noFlow: true },
    "jul-2026": { noFlow: true },
    "aug-2026": DRAIN_SAMPLES[21].prev,
    "sep-2026": DRAIN_SAMPLES[21].latest,
  },
  22: {
    "mar-2025": null,
    "jun-2026": { noFlow: true },
    "jul-2026": { noFlow: true },
    "aug-2026": DRAIN_SAMPLES[22].prev,
    "sep-2026": DRAIN_SAMPLES[22].latest,
  },
};
