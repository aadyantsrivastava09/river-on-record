"use client";

import { DRAINS } from "@/data/drains";
import { DRAIN_ROUNDS, DRAIN_HISTORY } from "@/data/water-quality-history";
import Chart, { AXIS, TOOLTIP } from "@/components/Chart";
import Reveal from "@/components/Reveal";
import type { EChartsOption } from "echarts";

const COLORS = [
  "#2fbf8f",
  "#56c8e8",
  "#f0b429",
  "#f97316",
  "#f05252",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#6366f1",
  "#84cc16",
  "#d946ef",
  "#22d3ee",
  "#fb7185",
  "#f59e0b",
  "#10b981",
];

function shortName(name: string) {
  if (name.includes("RME")) return "RME";
  if (name.startsWith("Drain No.")) return name.replace("Drain No. ", "#");
  return name.split(" ")[0];
}

function bodFor(id: number, key: string): number | null {
  const s = DRAIN_HISTORY[id]?.[key];
  if (!s || s.noFlow) return null;
  return s.bod ?? null;
}

export default function DrainHistory() {
  const flowing = DRAINS.filter((d) => !d.noFlow);

  const series = flowing.map((d, i) => ({
    name: shortName(d.name),
    type: "line" as const,
    smooth: false,
    symbol: "circle",
    symbolSize: 6,
    lineStyle: { width: 2 },
    itemStyle: { color: COLORS[i % COLORS.length] },
    connectNulls: false,
    data: DRAIN_ROUNDS.map((r) => bodFor(d.id, r.key)),
  }));

  const option: EChartsOption = {
    backgroundColor: "transparent",
    tooltip: TOOLTIP,
    legend: {
      type: "scroll",
      top: 0,
      textStyle: { color: "#7e97a6", fontSize: 11 },
      pageIconColor: "#7e97a6",
      pageTextStyle: { color: "#7e97a6" },
    },
    grid: { left: 48, right: 24, top: 64, bottom: 32 },
    xAxis: {
      type: "category",
      data: DRAIN_ROUNDS.map((r) => r.label),
      ...AXIS,
    },
    yAxis: {
      type: "value",
      name: "BOD (mg/L)",
      nameTextStyle: { color: "#7e97a6" },
      ...AXIS,
      splitLine: { lineStyle: { color: "rgba(148,176,190,0.12)" } },
    },
    series: [
      ...series,
      {
        name: "BOD norm",
        type: "line" as const,
        data: DRAIN_ROUNDS.map(() => 30),
        lineStyle: { type: "dashed", color: "#f05252", width: 1.5 },
        symbol: "none",
        tooltip: { show: false },
        silent: true,
      },
    ],
  };

  // change from first available round to Sep 2026
  const changes = flowing
    .map((d) => {
      const first = DRAIN_ROUNDS.find((r) => bodFor(d.id, r.key) != null)?.key;
      const last = "sep-2026";
      const a = first ? bodFor(d.id, first) : null;
      const b = bodFor(d.id, last);
      if (a == null || b == null) return null;
      return { name: d.name, short: shortName(d.name), delta: b - a, first, a, b };
    })
    .filter(Boolean)
    .sort((x, y) => (y?.delta ?? 0) - (x?.delta ?? 0));

  const worsened = changes.slice(0, 3);
  const improved = changes.slice(-3).reverse();

  return (
    <section id="history" className="scroll-mt-24 border-y border-line bg-abyss py-20">
      <Reveal>
        <div className="mx-auto max-w-6xl px-6">
          <p className="label mb-3">Five rounds of official data</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-snow sm:text-4xl">
            How the drains changed, round by round
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fog">
            BOD values from Mar 2025 (NMCG) through Jun, Jul, Aug, and Sep 2026 (DPCC). RME/RD-180 and Drain No. 12A appear only from Aug/Sep 2026 because they replaced Tehkhand and Tuglakabad in the DPCC table.
          </p>

          <div className="mt-10 rounded-2xl border border-line bg-ink p-4 sm:p-6">
            <Chart option={option} className="h-[420px] w-full" />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="card p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dead">
                Worsened most (first available → Sep 2026)
              </p>
              <ul className="mt-4 space-y-3">
                {worsened.map((d) => (
                  <li key={d!.short} className="flex items-center justify-between text-sm">
                    <span className="text-mist">{d!.short}</span>
                    <span className="font-mono text-dead">
                      {d!.a.toFixed(0)} → {d!.b.toFixed(0)} (+{d!.delta.toFixed(0)})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-alive">
                Improved most (first available → Sep 2026)
              </p>
              <ul className="mt-4 space-y-3">
                {improved.map((d) => (
                  <li key={d!.short} className="flex items-center justify-between text-sm">
                    <span className="text-mist">{d!.short}</span>
                    <span className="font-mono text-alive">
                      {d!.a.toFixed(0)} → {d!.b.toFixed(0)} ({d!.delta > 0 ? "+" : ""}
                      {d!.delta.toFixed(0)})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
