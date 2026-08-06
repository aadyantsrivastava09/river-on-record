"use client";

import { useMemo, useState } from "react";
import { DRAINS } from "@/data/drains";
import {
  BANDS,
  ROR_INPUTS,
  TREND_GLYPH,
  WQ_LABELS,
  getRating,
} from "@/data/ror";
import type { Band } from "@/data/ror";

type SortKey = "score" | "rank" | "share" | "name";

const COMPONENTS = [
  { label: "Water quality", weight: "40%", key: "wq" as const },
  { label: "Trend", weight: "20%", key: "trend" as const },
  { label: "Pollution load", weight: "15%", key: "pl" as const },
  { label: "Exposure", weight: "15%", key: "es" as const },
  { label: "Reliability", weight: "10%", key: "rs" as const },
];

const barColor = (v: number) => (v > 74 ? "#2fbf8f" : v > 44 ? "#f0b429" : "#f05252");

function ScoreChip({ total, band }: { total: number; band: Band }) {
  const critical = band.name === "Critical";
  return (
    <span
      className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-mono"
      style={{
        color: critical ? "#e9f1f5" : band.hex,
        border: `1px solid ${critical ? "rgba(148,176,190,0.4)" : band.hex + "66"}`,
        background: critical ? "rgba(0,0,0,0.55)" : band.hex + "14",
      }}
    >
      <span className="text-base font-bold leading-none">{total}</span>
      <span className="text-[9px] uppercase leading-none tracking-[0.14em]">{band.name}</span>
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
      case "share":
        r.sort((a, b) => (b.share ?? -1) - (a.share ?? -1));
        break;
      case "score": {
        r.sort((a, b) => {
          const ra = getRating(a.id);
          const rb = getRating(b.id);
          if (ra && rb) return ra.total - rb.total; // most dangerous first
          if (ra) return -1;
          if (rb) return 1;
          return a.id - b.id;
        });
        break;
      }
      default:
        r.sort((a, b) => a.id - b.id);
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
      <div className="mx-auto max-w-6xl px-6">
        <p className="label mb-3">The product</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold tracking-tight text-snow sm:text-4xl">
            The 22-drain scoreboard
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-fog">
            Every drain that feeds the 22-km stretch, scored and republished weekly.
            One question, one number:{" "}
            <span className="text-snow">how environmentally harmful is this drain today?</span>
          </p>
        </div>

        {/* RoRES methodology */}
        <div className="mt-8 rounded-2xl border border-alive/25 bg-alive/[0.05] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-sm font-bold text-alive">
              RoRES — River on Record Environmental Score
            </p>
            <span className="rounded-full border border-alive/40 bg-alive/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-alive">
              Live · 0–100 · 100 = cleanest
            </span>
          </div>
          <p className="mt-3 max-w-3xl font-mono text-xs leading-relaxed text-mist">
            RoRES = 0.40 · Water Quality + 0.20 · Trend + 0.15 · Pollution Load + 0.15 ·
            Exposure + 0.10 · Reliability
          </p>
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-fog">
            Water quality (DO, BOD, pH, turbidity, floating waste) is half the story; the
            Trend term rewards improvement, not just good conditions; load, exposure and
            reliability keep the score honest. Explainable in under 30 seconds.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {BANDS.map((b, i) => {
              const critical = b.name === "Critical";
              const top = i === 0 ? 100 : BANDS[i - 1].min - 1;
              return (
                <span
                  key={b.name}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                  style={{
                    color: critical ? "#e9f1f5" : b.hex,
                    borderColor: critical ? "rgba(148,176,190,0.4)" : b.hex + "55",
                    background: critical ? "rgba(0,0,0,0.5)" : b.hex + "12",
                  }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: critical ? "#7e97a6" : b.hex }} />
                  {b.name} {b.min}–{top}
                </span>
              );
            })}
          </div>
        </div>

        {/* controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-6">
            {sortBtn("score", "Sort · Score")}
            {sortBtn("rank", "Sort · ID")}
            {sortBtn("share", "Sort · Load")}
            {sortBtn("name", "Sort · A–Z")}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
              {ROR_INPUTS.length} of {DRAINS.length} drains rated
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
          <table className="w-full min-w-[840px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-panel">
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">#</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Drain</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">RoRES</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Trend</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Worst public reading</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Load share</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => {
                const r = getRating(d.id);
                const open = expanded === d.id;
                const g = r ? (TREND_GLYPH[
                  ROR_INPUTS.find((i) => i.drainId === d.id)!.trend.state
                ] as { g: string; c: string }) : null;
                return (
                  <FragmentRow
                    key={d.id}
                    drainId={d.id}
                    open={open}
                    onToggle={() => setExpanded(open ? null : d.id)}
                    ror={r}
                    trendGlyph={g}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-fog/70">
          Sources: DPCC monthly Yamuna report · CPCB · DJB · NGT orders · SPRF (Mar 2026) · CSE/The Tribune
        </p>
      </div>
    </section>
  );
}

function FragmentRow({
  drainId,
  open,
  onToggle,
  ror,
  trendGlyph,
}: {
  drainId: number;
  open: boolean;
  onToggle: () => void;
  ror: ReturnType<typeof getRating>;
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
        <td className="px-4 py-3.5 font-mono text-xs text-fog">{String(d.id).padStart(2, "0")}</td>
        <td className="px-4 py-3.5">
          <p className="font-display text-sm font-semibold text-snow">{d.name}</p>
          <p className="mt-0.5 max-w-[240px] text-[11px] leading-snug text-fog">{d.note}</p>
        </td>
        <td className="px-4 py-3.5">
          {ror ? (
            <ScoreChip total={ror.total} band={ror.band} />
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
              <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse-dot" />
              awaiting public data
            </span>
          )}
        </td>
        <td className="px-4 py-3.5">
          {ror ? (
            <span className="inline-flex flex-col gap-0.5 font-mono text-xs">
              <span className="flex items-center gap-1.5" style={{ color: trendGlyph!.c }}>
                {trendGlyph!.g}
                <span className="text-snow">
                  {ror.prevTotal !== undefined
                    ? `${ror.prevTotal} → ${ror.total}`
                    : `first rating · ${ror.total}`}
                </span>
              </span>
              {ror.prevBand && (
                <span className="text-[9px] uppercase tracking-[0.12em] text-fog">
                  {ror.prevBand.name} → {ror.band.name}
                </span>
              )}
            </span>
          ) : (
            <span className="font-mono text-xs text-fog/60">—</span>
          )}
        </td>
        <td className="px-4 py-3.5 text-xs text-mist">
          {d.worst ?? <span className="text-fog/60">Awaiting public report</span>}
        </td>
        <td className="px-4 py-3.5">
          {d.share !== null ? (
            <span className="font-mono text-sm font-semibold text-snow">{d.share.toFixed(1)}%</span>
          ) : (
            <span className="font-mono text-xs text-fog/60">—</span>
          )}
        </td>
      </tr>
      {open && ror && (
        <tr className="border-b border-line/60 bg-panel/70">
          <td colSpan={6} className="px-6 py-6">
            <Breakdown ror={ror} drainName={d.name} />
          </td>
        </tr>
      )}
    </>
  );
}

function Breakdown({ ror, drainName }: { ror: NonNullable<ReturnType<typeof getRating>>; drainName: string }) {
  const input = ROR_INPUTS.find((i) => i.drainId === ror.drainId)!;
  const values: Record<string, number> = {
    wq: Math.round(ror.wq),
    trend: ror.trend,
    pl: Math.round(ror.pl),
    es: Math.round(ror.es),
    rs: ror.rs,
  };
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* component bars */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
          RoRES breakdown — {drainName}
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
                    <span className="font-bold" style={{ color: barColor(v) }}>
                      {Math.round(v)}
                    </span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-panel2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${v}%`, background: barColor(v) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
          Final: <span className="text-snow">RoRES {ror.total}</span> — {ror.band.name} band (
          {ror.band.blurb})
        </p>
      </div>

      {/* evidence */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
          Every input traced to a public source
        </p>
        <div className="mt-4 space-y-2.5">
          {ror.wqDetail.map((p) => (
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
                  <span className="ml-1 font-normal text-fog">· {p.reading.value}{p.key === "waste" ? "/100" : p.key === "ph" ? "" : " mg/l"}</span>
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
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fog">Exposure · </span>
            {input.exposureNote}
          </p>
          <p>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-fog">Reliability · </span>
            {input.sourceCount} independent verified source{input.sourceCount === 1 ? "" : "s"} ·{" "}
            {Math.min(100, input.sourceCount * 25)}/100
          </p>
        </div>
      </div>
    </div>
  );
}
