"use client";

import { useMemo, useState } from "react";
import { DRAINS, RATING_STATUS } from "@/data/drains";

type SortKey = "rank" | "name" | "share";

export default function Scoreboard() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("rank");

  const rows = useMemo(() => {
    let r = [...DRAINS];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      r = r.filter((d) => d.name.toLowerCase().includes(q) || (d.note ?? "").toLowerCase().includes(q));
    }
    switch (sort) {
      case "name":
        r.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "share":
        r.sort((a, b) => (b.share ?? -1) - (a.share ?? -1));
        break;
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
            Every drain that feeds the 22-km stretch, ranked and republished weekly.
            Each number traces to a dated public source — auditable by anyone.
          </p>
        </div>

        {/* rating system notice */}
        <div className="mt-8 rounded-2xl border border-amber/30 bg-amber/[0.06] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-bold text-amber">
                RATING SYSTEM — PENDING TEAM DESIGN
              </p>
              <p className="mt-1 text-sm text-mist">{RATING_STATUS.note}</p>
            </div>
            <span className="rounded-full border border-amber/40 bg-amber/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber">
              Plug-in ready
            </span>
          </div>
        </div>

        {/* controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-6">{sortBtn("rank", "Sort · ID")} {sortBtn("share", "Sort · Load")} {sortBtn("name", "Sort · A–Z")}</div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search drains…"
            className="w-full max-w-xs rounded-lg border border-line bg-panel px-4 py-2 font-mono text-sm text-snow placeholder:text-fog/60 focus:border-alive/50 focus:outline-none"
          />
        </div>

        {/* table */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-panel">
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">#</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Drain</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Rating</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Trend</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Worst public reading</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Load share</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className="group border-b border-line/60 bg-abyss transition-colors last:border-0 hover:bg-panel">
                  <td className="px-4 py-3.5 font-mono text-xs text-fog">{String(d.id).padStart(2, "0")}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-display text-sm font-semibold text-snow">{d.name}</p>
                    <p className="mt-0.5 max-w-[240px] text-[11px] leading-snug text-fog">{d.note}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    {RATING_STATUS.pending ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse-dot" />
                        pending
                      </span>
                    ) : (
                      <span className="font-display text-lg font-bold text-snow">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-fog">—</td>
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
              ))}
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
