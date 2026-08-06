"use client";

import Chart, { AXIS, TOOLTIP } from "@/components/Chart";
import type { EChartsOption } from "echarts";
import { BOD_TREND, DO_FC, LOAD_SPLIT } from "@/data/drains";

const SITES = DO_FC.map((p) => p.site);

// NOTE: object spreads widen literal types ("category" -> string) and fail
// ECharts' option types, so every axis/tooltip is written out explicitly.

const catAxis = (rotate = 0) => ({
  type: "category" as const,
  axisLine: AXIS.axisLine,
  axisLabel: { ...AXIS.axisLabel, rotate },
  splitLine: AXIS.splitLine,
});

const valAxis = (name: string) => ({
  type: "value" as const,
  name,
  nameTextStyle: { color: "#7e97a6", fontFamily: "JetBrains Mono, monospace", fontSize: 10 },
  axisLine: AXIS.axisLine,
  axisLabel: AXIS.axisLabel,
  splitLine: AXIS.splitLine,
});

const tooltipItem = {
  trigger: "item" as const,
  backgroundColor: TOOLTIP.backgroundColor,
  borderColor: TOOLTIP.borderColor,
  textStyle: TOOLTIP.textStyle,
};

const doOption: EChartsOption = {
  backgroundColor: "transparent",
  tooltip: TOOLTIP,
  grid: { left: 44, right: 16, top: 30, bottom: 40 },
  xAxis: { ...catAxis(22), data: SITES },
  yAxis: { ...valAxis("DO (mg/l)"), min: 0, max: 6 },
  series: [
    {
      name: "Dissolved oxygen",
      type: "line",
      data: DO_FC.map((p) => p.do2026),
      smooth: true,
      symbol: "circle",
      symbolSize: 7,
      lineStyle: { color: "#2fbf8f", width: 3 },
      itemStyle: { color: "#05080b", borderColor: "#2fbf8f", borderWidth: 2 },
      areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(47,191,143,0.25)" }, { offset: 1, color: "rgba(47,191,143,0)" }] } },
    },
    {
      name: "Healthy threshold",
      type: "line",
      data: SITES.map(() => 5),
      symbol: "none",
      lineStyle: { color: "rgba(126,151,166,0.5)", type: "dashed", width: 1 },
      tooltip: { show: false },
    },
  ],
};

const fcOption: EChartsOption = {
  backgroundColor: "transparent",
  tooltip: tooltipItem,
  grid: { left: 56, right: 16, top: 30, bottom: 40 },
  xAxis: { ...catAxis(22), data: SITES },
  yAxis: {
    type: "log" as const,
    name: "FC (log scale)",
    nameTextStyle: { color: "#7e97a6", fontFamily: "JetBrains Mono, monospace", fontSize: 10 },
    min: 1000,
    max: 1000000,
    axisLine: AXIS.axisLine,
    axisLabel: AXIS.axisLabel,
    splitLine: AXIS.splitLine,
  },
  series: [
    {
      name: "Faecal coliform",
      type: "bar",
      data: DO_FC.map((p) => ({
        value: p.fc,
        itemStyle: { color: p.fc > 2500 ? "#f05252" : "#2fbf8f", borderRadius: [4, 4, 0, 0] },
      })),
      barWidth: "45%",
    },
  ],
};

const bodOption: EChartsOption = {
  backgroundColor: "transparent",
  tooltip: TOOLTIP,
  legend: {
    top: 0,
    textStyle: { color: "#b6c8d3", fontFamily: "Inter, sans-serif", fontSize: 11 },
    data: ["2017", "2020", "2024"],
  },
  grid: { left: 44, right: 16, top: 40, bottom: 40 },
  xAxis: { ...catAxis(), data: BOD_TREND.map((b) => b.site) },
  yAxis: valAxis("BOD (mg/l)"),
  series: [
    { name: "2017", type: "bar", data: BOD_TREND.map((b) => b.y2017), itemStyle: { color: "rgba(126,151,166,0.55)" }, barWidth: "22%" },
    { name: "2020", type: "bar", data: BOD_TREND.map((b) => b.y2020), itemStyle: { color: "rgba(240,180,41,0.75)" }, barWidth: "22%" },
    { name: "2024", type: "bar", data: BOD_TREND.map((b) => b.y2024), itemStyle: { color: "#f05252" }, barWidth: "22%" },
  ],
};

const loadOption: EChartsOption = {
  backgroundColor: "transparent",
  tooltip: { ...tooltipItem, formatter: "{b}: {c}%" },
  legend: { bottom: 0, textStyle: { color: "#b6c8d3", fontFamily: "Inter, sans-serif", fontSize: 11 } },
  series: [
    {
      name: "Load share",
      type: "pie",
      radius: ["52%", "76%"],
      center: ["50%", "44%"],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: "#05080b", borderWidth: 3, borderRadius: 6 },
      label: { show: true, color: "#e9f1f5", fontFamily: "JetBrains Mono, monospace", fontSize: 12, formatter: "{c}%" },
      data: [
        { value: LOAD_SPLIT[0].value, name: "Najafgarh", itemStyle: { color: "#f05252" } },
        { value: LOAD_SPLIT[1].value, name: "Shahdara", itemStyle: { color: "#f0b429" } },
        { value: LOAD_SPLIT[2].value, name: "Other 20 drains", itemStyle: { color: "#7e97a6" } },
      ],
    },
  ],
};

export default function DataCharts() {
  return (
    <section id="data" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="label mb-3">The evidence · public data only</p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-snow sm:text-4xl">
          The numbers the government already has
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fog">
          Every chart below is drawn from published government data — DPCC monthly reports
          (May 2026), Delhi Department of Environment annual averages, DJB and CPCB. We
          added nothing; we simply refused to let it stay unread.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-snow">The 22-km death certificate</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">DO · May 2026 · DPCC</span>
            </div>
            <Chart option={doOption} className="h-72 w-full" />
            <p className="mt-3 text-xs leading-relaxed text-fog">
              Dissolved oxygen enters at 5.9 mg/l (healthy ≥ 5) — and hits zero before the
              first bridge inside the city. Everything downstream is already dead.
            </p>
          </div>

          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-snow">Raw sewage, measured</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">FC · log scale</span>
            </div>
            <Chart option={fcOption} className="h-72 w-full" />
            <p className="mt-3 text-xs leading-relaxed text-fog">
              Faecal coliform at Asgarpur: 330,000 MPN/100 ml — 132 times the legal maximum
              of 2,500. This is the fingerprint of untreated sewage.
            </p>
          </div>

          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-snow">Ten years, hundreds of crores</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">BOD annual averages</span>
            </div>
            <Chart option={bodOption} className="h-72 w-full" />
            <p className="mt-3 text-xs leading-relaxed text-fog">
              BOD downstream barely moved between 2017 and 2024 — the standard is ≤ 3 mg/l.
              The river at Asgarpur runs at ~29.
            </p>
          </div>

          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-snow">Two drains. Eighty percent.</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">Load share</span>
            </div>
            <Chart option={loadOption} className="h-72 w-full" />
            <p className="mt-3 text-xs leading-relaxed text-fog">
              Najafgarh alone carries 68.71% of the wastewater. Shahdara adds 10.9%. The
              scoreboard starts here — and it names every one of the other twenty too.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
