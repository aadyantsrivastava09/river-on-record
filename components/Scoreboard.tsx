"use client";

import { useMemo, useState } from "react";
import { DRAINS, STATUS_COLORS } from "@/data/drains";
import {
  DHS_INPUTS,
  RISK_LEVELS,
  TREND_GLYPH,
  TREND_LABELS,
  WQ_LABELS,
  getDhs,
} from "@/data/dhs";
import type { DhsResult, RiskLevel, TrendState } from "@/data/dhs";
import Reveal from "@/components/Reveal";
import LatestSample from "@/components/LatestSample";
import { LATEST_ROUND, PREV_ROUND } from "@/data/water-quality";

type SortKey = "score" | "rank" | "load" | "name";

const COMPONENTS = [
  { label: "Water quality", weight: "70%", key: "wq" as const },
  { label: "Trend", weight: "20%", key: "trend" as const },
  { label: "Pollution load", weight: "10%", key: "pl" as const },
];

const barColor = (v: number) => (v > 74 ? "#2fbf8f" : v > 44 ? "#f0b429" : "#f05252");

function ScoreChip({ total, risk }: { total: number; risk: RiskLevel }) {
  const critical = risk.name === "Critical";
  return (
    <span
      className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-mono"
      style={{
        color: critical ? "#e9f1f5" : risk.hex,
        border: `1px solid ${risk.hex + "66"}`,
        background: risk.hex + "14",
      }}
    >
      <span className="text-base font-bold leading-none">{total}</span>
      <span className="text-[9px] uppercase leading-none tracking-[0.14em]">{risk.name}</span>
    </span>
  );
}

export default function Scoreboard() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("score");
  const [expanded, setExpanded] = useState<number | null>(null);

  const rows = useMemo(() => {
    let r = [...DRAINS];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      r = r.filter(
        (d) => d.name.toLowerCase().includes(q) || (d.note ?? "").toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "name":
        r.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "load":
        r.sort((a, b) => (b.dischargePct ?? -1) - (a.dischargePct ?? -1));
        break;
      case "score": {
        r.sort((a, b) => {
          const ra = getDhs(a.id);
          const rb = getDhs(b.id);
          if (ra && rb) return ra.total - rb.total; // most dangerous first
          if (ra) return -1;
          if (rb) return 1;
          return a.dpccId - b.dpccId;
        });
        break;
      }
      default:
        r.sort((a, b) => a.dpccId - b.dpccId);
    }
    return r;
  }, [query, sort]);

  const sortBtn = (key: SortKey, label: string) => (
    <button
      onClick={() => setSort(key)}
      className={`font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
        sort === key ? "text-alive" : "text-fog hover:text-snow"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section id="scoreboard" className="scroll-mt-24 py-20">
      <Reveal>
      <div className="mx-auto max-w-6xl px-6">
        <p className="label mb-3">The product</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold tracking-tight text-snow sm:text-4xl">
            The 22-drain scoreboard
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-fog">
            Every drain that feeds the 22-km stretch, scored from the latest official DPCC round.
            One question, one number:{" "}
            <span className="text-snow">how healthy is this drain in the latest DPCC round?</span>
          </p>
        </div>

        {/* DHS methodology */}
        <div className="mt-8 rounded-2xl border border-alive/25 bg-alive/[0.05] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-sm font-bold text-alive">
              The score, in one line
            </p>
            <span className="rounded-full border border-alive/40 bg-alive/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-alive">
              Score · 0–100 · 100 = healthy drain
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[13px] sm:text-sm">
            <span className="rounded-lg border border-alive/50 bg-alive/15 px-3 py-1.5 font-bold text-alive">
              DHS
            </span>
            <span className="text-fog">=</span>
            <span className="rounded-lg border border-line-strong bg-panel px-3 py-1.5 text-snow">
              0.70 · <span className="font-bold text-alive">Water Quality</span>
            </span>
            <span className="text-fog">+</span>
            <span className="rounded-lg border border-line-strong bg-panel px-3 py-1.5 text-snow">
              0.20 · <span className="font-bold text-amber">Trend</span>
            </span>
            <span className="text-fog">+</span>
            <span className="rounded-lg border border-line-strong bg-panel px-3 py-1.5 text-snow">
              0.10 · <span className="font-bold text-dead">Pollution Load</span>
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              {
                k: "Water Quality",
                w: "70% of the score",
                desc: "What is actually in the water — BOD, pH, TSS, plus oxygen and ammonia where the river data exists — checked against legal standards.",
                c: "#2fbf8f",
              },
              {
                k: "Trend",
                w: "20% of the score",
                desc: "Rewards drains that are improving, not just the ones that test clean today.",
                c: "#f0b429",
              },
              {
                k: "Pollution Load",
                w: "10% of the score",
                desc: "Counts how much the drain dumps — a small weight, a big story.",
                c: "#f05252",
              },
            ].map((x) => (
              <div key={x.k} className="rounded-xl border border-line bg-panel2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-xs font-bold text-snow">{x.k}</p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: x.c }}>
                    {x.w}
                  </span>
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-fog">{x.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[11.5px] leading-relaxed text-fog">
            Confidence and Risk are shown separately — they never change the score. Every
            input traces to a public report; nothing is estimated where a number exists.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {RISK_LEVELS.map((r, i) => {
              const top = i === 0 ? 100 : RISK_LEVELS[i - 1].min - 1;
              return (
                <span
                  key={r.name}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                  style={{
                    color: r.hex,
                    borderColor: r.hex + "55",
                    background: r.hex + "12",
                  }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: r.hex }} />
                  {r.name} risk {r.min}–{top}
                </span>
              );
            })}
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fog/70">
              + Confidence % displayed separately
            </span>
          </div>
        </div>

        {/* controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-6">
            {sortBtn("score", "Sort · Score")}
            {sortBtn("rank", "Sort · ID")}
            {sortBtn("load", "Sort · Load")}
            {sortBtn("name", "Sort · A–Z")}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
              {DHS_INPUTS.length} of {DRAINS.length} drains rated · data as of {LATEST_ROUND.sampled}
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search drains…"
              className="w-full max-w-xs rounded-lg border border-line bg-panel px-4 py-2 font-mono text-sm text-snow placeholder:text-fog/60 focus:border-alive/50 focus:outline-none"
            />
          </div>
        </div>

        {/* table */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-panel">
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">#</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Drain</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Status</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">DHS</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Trend</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Confidence</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Discharge</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">BOD load</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => {
                const r = getDhs(d.id);
                const input = DHS_INPUTS.find((i) => i.drainId === d.id);
                const state = input?.trend.state as TrendState | undefined;
                const glyph = r && state ? TREND_GLYPH[state] : null;
                return (
                  <FragmentRow
                    key={d.id}
                    drainId={d.id}
                    open={expanded === d.id}
                    onToggle={() => setExpanded(expanded === d.id ? null : d.id)}
                    dhs={r}
                    trendState={state}
                    trendGlyph={glyph}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-fog/70">
          Sources: DPCC monthly drain reports · DJB · CPCB · NMCG · HT/ANI/The Hindu · latest round {LATEST_ROUND.label} ({LATEST_ROUND.sampled}).
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-alive">
          <a href={LATEST_ROUND.drainUrl} target="_blank" rel="noopener noreferrer" className="hover:text-snow">
            Drain report
          </a>
          {" | "}
          <a href={LATEST_ROUND.riverUrl} target="_blank" rel="noopener noreferrer" className="hover:text-snow">
            River report
          </a>
          {" | "}
          <a href={LATEST_ROUND.indexUrl} target="_blank" rel="noopener noreferrer" className="hover:text-snow">
            DPCC index
          </a>
        </p>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-fog/70">
          Roster note: the Sep 2026 DPCC table lists 22 outfalls, including RME/RD-180 and Drain No. 12A.
          Tehkhand and Tuglakabad are not in this table. Trend compares {PREV_ROUND.label} with {LATEST_ROUND.label}.
        </p>
      </div>
      </Reveal>
    </section>
  );
}

function FragmentRow({
  drainId,
  open,
  onToggle,
  dhs,
  trendState,
  trendGlyph,
}: {
  drainId: number;
  open: boolean;
  onToggle: () => void;
  dhs: DhsResult | undefined;
  trendState: TrendState | undefined;
  trendGlyph: { g: string; c: string } | null;
}) {
  const d = DRAINS.find((x) => x.id === drainId)!;
  return (
    <>
      <tr
        className={`group cursor-pointer border-b border-line/60 transition-colors last:border-0 ${
          open ? "bg-panel" : "bg-abyss hover:bg-panel"
        }`}
        onClick={onToggle}
      >
        <td className="px-4 py-3.5 font-mono text-xs text-fog">{String(d.dpccId).padStart(2, "0")}</td>
        <td className="px-4 py-3.5">
          <p className="font-display text-sm font-semibold text-snow">{d.name}</p>
          <p className="mt-0.5 max-w-[240px] text-[11px] leading-snug text-fog">{d.note}</p>
        </td>
        <td className="px-4 py-3.5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]"
            style={{
              color: STATUS_COLORS[d.status],
              borderColor: STATUS_COLORS[d.status] + "55",
              background: STATUS_COLORS[d.status] + "12",
            }}
          >
            {d.status}
            {d.noFlow && <span className="text-fog/80"> · no flow</span>}
          </span>
        </td>
        <td className="px-4 py-3.5">
          {dhs ? (
            <ScoreChip total={dhs.total} risk={dhs.risk} />
          ) : d.noFlow ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
              <span className="h-1.5 w-1.5 rounded-full bg-fog" />
              no flow · tapped
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
              <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse-dot" />
              awaiting public data
            </span>
          )}
        </td>
        <td className="px-4 py-3.5">
          {dhs && trendState && trendGlyph ? (
            <span className="inline-flex flex-col gap-0.5 font-mono text-xs">
              <span className="flex items-center gap-1.5" style={{ color: trendGlyph.c }}>
                {trendGlyph.g}
                <span className="text-snow">
                  {dhs.prevTotal !== undefined
                    ? `${dhs.prevTotal} → ${dhs.total}`
                    : `first rating · ${dhs.total}`}
                </span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-fog">
                {TREND_LABELS[trendState]}
                {dhs.prevRisk && ` · ${dhs.prevRisk.name} → ${dhs.risk.name}`}
              </span>
            </span>
          ) : (
            <span className="font-mono text-xs text-fog/60">—</span>
          )}
        </td>
        <td className="px-4 py-3.5">
          {dhs ? (
            <span className="font-mono text-xs text-mist">{dhs.confidence}%</span>
          ) : (
            <span className="font-mono text-xs text-fog/60">—</span>
          )}
        </td>
        <td className="px-4 py-3.5">
          {d.dischargePct != null ? (
            <span className="font-mono text-sm font-semibold text-snow">{d.dischargePct.toFixed(2)}%</span>
          ) : (
            <span className="font-mono text-xs text-fog/60">—</span>
          )}
        </td>
        <td className="px-4 py-3.5">
          {d.bodPct != null ? (
            <span className="font-mono text-sm font-semibold text-snow">{d.bodPct.toFixed(2)}%</span>
          ) : (
            <span className="font-mono text-xs text-fog/60">—</span>
          )}
        </td>
      </tr>
      {open && dhs && (
        <tr className="border-b border-line/60 bg-panel/70">
          <td colSpan={8} className="px-6 py-6">
            <div className="space-y-4">
              <LatestSample drainId={d.id} />
              <Breakdown dhs={dhs} drainName={d.name} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Breakdown({ dhs, drainName }: { dhs: DhsResult; drainName: string }) {
  const input = DHS_INPUTS.find((i) => i.drainId === dhs.drainId)!;
  const values: Record<string, number | null> = {
    wq: Math.round(dhs.wq),
    trend: dhs.trend,
    pl: dhs.pl === null ? null : Math.round(dhs.pl),
  };
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* component bars */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
          DHS breakdown — {drainName}
        </p>
        <div className="mt-4 space-y-4">
          {COMPONENTS.map((c) => {
            const v = values[c.key];
            return (
              <div key={c.key}>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="uppercase tracking-[0.14em] text-mist">{c.label}</span>
                  <span className="text-fog">
                    <span className="mr-2 text-fog/70">{c.weight}</span>
                    <span className="font-bold" style={{ color: v === null ? "#7e97a6" : barColor(v) }}>
                      {v === null ? "not published" : Math.round(v)}
                    </span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-panel2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${v ?? 0}%`, background: v === null ? "#40505c" : barColor(v) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs font-bold"
            style={{ color: dhs.risk.hex, border: `1px solid ${dhs.risk.hex + "66"}`, background: dhs.risk.hex + "14" }}
          >
            {dhs.total} · {dhs.risk.name} risk
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
            Confidence {dhs.confidence}% · displayed separately
          </span>
        </div>
      </div>

      {/* evidence */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
          Every input traced to a public source
        </p>
        <div className="mt-4 space-y-2.5">
          {dhs.wqDetail.map((p) => (
            <div key={p.key} className="rounded-xl border border-line bg-abyss p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-xs font-bold text-snow">
                  {WQ_LABELS[p.key]}
                  <span className="ml-2 font-mono text-[10px] font-normal text-fog">
                    weight {Math.round(p.weight * 100)}%
                  </span>
                </p>
                <span className="font-mono text-xs font-bold" style={{ color: barColor(p.score) }}>
                  {Math.round(p.score)}
                  <span className="ml-1 font-normal text-fog">
                    · {p.reading.value}
                    {p.key === "waste" ? "/100" : p.key === "ph" || p.key === "ammonia" ? "" : " mg/l"}
                  </span>
                </span>
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-fog">{p.reading.source}</p>
              {p.reading.inferred && (
                <span className="mt-1.5 inline-block rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-amber">
                  inferred — nearest public point
                </span>
              )}
            </div>
          ))}
          {dhs.wqMissing.length > 0 && (
            <p className="rounded-xl border border-dashed border-line bg-abyss p-3.5 text-[11px] leading-relaxed text-fog">
              No public reading yet: {dhs.wqMissing.map((k) => WQ_LABELS[k]).join(", ")} —
              excluded from Water Quality, weights redistributed to measured parameters.
            </p>
          )}
        </div>

        <div className="mt-4 space-y-2 text-[11px] leading-relaxed text-mist">
          <p>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fog">Trend · </span>
            {input.trend.note}
          </p>
          {input.load && (
            <p>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fog">Load · </span>
              {input.load.note}
            </p>
          )}
          <p>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fog">Confidence · </span>
            {input.confidence.note}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
            {input.confidence.officialSources} official reports ·{" "}
            {input.confidence.volunteerVerified ? "field-verified" : "no field check yet"} ·{" "}
            {input.confidence.liveSensor ? "live sensor" : "no live sensor"} ·{" "}
            {input.confidence.droneImagery ? "drone imagery" : "no drones — by design"}
          </p>
        </div>
      </div>
    </div>
  );
}
