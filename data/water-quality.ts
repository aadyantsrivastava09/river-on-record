// ---------------------------------------------------------------------------
// WATER QUALITY — OFFICIAL ROUNDS
// ---------------------------------------------------------------------------
// Every value below comes from a DPCC "Waste Water Quality Status of Drain" or
// "Water Quality Status of River Yamuna" report. No values are interpolated.
// Missing cells stay null and are labelled in the UI.
//
// Sep 2026 drain report: DPCC/W/D/2026/311-322, sampled 07.09.2026
// Sep 2026 river report:  DPCC/W/Y/2026/63-69, sampled 07.09.2026
// Aug 2026 reports:       sampled 05.08.2026
// ---------------------------------------------------------------------------

export type RoundMeta = {
  key: string;
  label: string;
  sampled: string;
  drainReport: string;
  riverReport: string;
  drainUrl: string;
  riverUrl: string;
  indexUrl: string;
};

const INDEX_URL = "https://dpcc.delhi.gov.in/dpcc/analysis-reports";

export const LATEST_ROUND: RoundMeta = {
  key: "sep-2026",
  label: "Sep 2026",
  sampled: "07.09.2026",
  drainReport: "DPCC/W/D/2026/311–322",
  riverReport: "DPCC/W/Y/2026/63–69",
  drainUrl:
    "https://dpcc.delhi.gov.in/sites/default/files/DPCC/analysis-report/analysis_report_drain_sep-2026_0001_0001.pdf",
  riverUrl:
    "https://dpcc.delhi.gov.in/sites/default/files/DPCC/analysis-report/analysis_report_river_yamuna_sep-2026_0001.pdf",
  indexUrl: INDEX_URL,
};

export const PREV_ROUND: RoundMeta = {
  key: "aug-2026",
  label: "Aug 2026",
  sampled: "05.08.2026",
  drainReport: "DPCC/W/D/2026/245–266",
  riverReport: "DPCC/W/Y/2026/56–62",
  drainUrl:
    "https://dpcc.delhi.gov.in/sites/default/files/DPCC/analysis-report/drain_analysis_report_aug-2026%29_0001.pdf",
  riverUrl:
    "https://dpcc.delhi.gov.in/sites/default/files/DPCC/analysis-report/river_yamuna_analysis_report_aug-2026%29_0001.pdf",
  indexUrl: INDEX_URL,
};

export type DrainSample = {
  noFlow: boolean;
  ph: number | null;
  tss: number | null;
  cod: number | null;
  bod: number | null;
};

export type DrainSampleSet = {
  latest: DrainSample;
  prev: DrainSample;
};

const noFlow = (): DrainSample => ({
  noFlow: true,
  ph: null,
  tss: null,
  cod: null,
  bod: null,
});

const sample = (ph: number, tss: number, cod: number, bod: number): DrainSample => ({
  noFlow: false,
  ph,
  tss,
  cod,
  bod,
});

// Keyed by the app's stable internal drain ID.
export const DRAIN_SAMPLES: Record<number, DrainSampleSet> = {
  1: { latest: sample(7.3, 120, 148, 62), prev: sample(7.2, 116, 160, 66) }, // Najafgarh
  2: { latest: sample(7.2, 242, 264, 120), prev: sample(7.4, 240, 272, 120) }, // Shahdara
  3: { latest: sample(7.5, 216, 256, 125), prev: sample(7.3, 218, 256, 120) }, // Barapullah
  4: { latest: sample(6.8, 172, 204, 86), prev: sample(7.2, 168, 208, 86) }, // Power House
  5: { latest: sample(6.9, 140, 200, 90), prev: sample(7.2, 136, 212, 100) }, // ISBT
  6: { latest: sample(7.1, 220, 248, 106), prev: sample(7.4, 216, 240, 100) }, // Sen Nursing Home
  7: { latest: sample(6.8, 168, 220, 88), prev: sample(7.5, 164, 212, 86) }, // Maharani Bagh
  8: { latest: sample(7.3, 126, 208, 82), prev: sample(7.1, 130, 200, 80) }, // Kailash Nagar
  9: { latest: sample(6.9, 96, 108, 48), prev: sample(6.9, 92, 112, 46) }, // Abul Fazal
  10: { latest: sample(7.5, 108, 160, 66), prev: sample(7.3, 112, 164, 70) }, // Sonia Vihar
  11: { latest: sample(7.4, 130, 156, 70), prev: sample(7.3, 128, 152, 70) }, // Jaitpur
  12: { latest: sample(7.4, 156, 196, 85), prev: sample(7.3, 160, 204, 90) }, // Shastri Park
  13: { latest: noFlow(), prev: noFlow() }, // Metcalf House
  14: { latest: noFlow(), prev: noFlow() }, // Khyber Pass
  15: { latest: noFlow(), prev: noFlow() }, // Sweeper Colony
  16: { latest: noFlow(), prev: noFlow() }, // Magazine Road
  17: { latest: noFlow(), prev: noFlow() }, // Tonga Stand
  18: { latest: noFlow(), prev: noFlow() }, // Moat (Vijay Ghat)
  19: { latest: sample(7.3, 64, 100, 34), prev: sample(7.1, 60, 96, 34) }, // Drain No. 14
  20: { latest: sample(6.9, 180, 192, 75), prev: sample(6.9, 180, 196, 80) }, // RME / RD-180
  21: { latest: noFlow(), prev: noFlow() }, // Civil Mill
  22: { latest: sample(6.9, 244, 260, 120), prev: noFlow() }, // Drain No. 12A
};

export type RiverSample = {
  site: string;
  ph: number;
  bod: number;
  cod: number;
  do: number | null;
  fc: number;
  phosphate: number;
  ammonia: number;
};

// Sep 2026 river report. Wazirabad DO is blank in the official table; keep null.
export const RIVER_SAMPLES: RiverSample[] = [
  { site: "Palla (entry)", ph: 6.9, bod: 2.0, cod: 12, do: 6.5, fc: 1100, phosphate: 0.07, ammonia: 0.12 },
  { site: "Wazirabad", ph: 7.2, bod: 4.0, cod: 20, do: null, fc: 1300, phosphate: 0.12, ammonia: 0.19 },
  { site: "ISBT Bridge", ph: 7.3, bod: 30.0, cod: 92, do: 2.9, fc: 35000, phosphate: 0.98, ammonia: 1.12 },
  { site: "ITO Bridge", ph: 7.1, bod: 18.0, cod: 60, do: 4.2, fc: 17000, phosphate: 0.70, ammonia: 0.97 },
  { site: "Nizamuddin", ph: 7.2, bod: 14.0, cod: 56, do: 3.8, fc: 15000, phosphate: 0.67, ammonia: 0.85 },
  { site: "Okhla Barrage", ph: 7.4, bod: 10.0, cod: 40, do: 4.0, fc: 21000, phosphate: 0.43, ammonia: 0.73 },
  { site: "Asgarpur (exit)", ph: 7.6, bod: 18.0, cod: 68, do: 0, fc: 38000, phosphate: 1.85, ammonia: 1.05 },
];

// Historical May 2026 peaks used only where explicitly labelled as history.
export const MAY_2026_PEAK = {
  sampled: "May 2026",
  asgarpurDo: 0,
  asgarpurFc: 330000,
  asgarpurBod: 58,
};

export const DPCC_DRAIN_STANDARDS = {
  ph: "5.5–9.0",
  tss: 100,
  cod: 250,
  bod: 30,
};
