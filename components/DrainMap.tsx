"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DRAINS, STATUS_COLORS } from "@/data/drains";
import type { Drain } from "@/data/drains";
import { getDhs } from "@/data/dhs";
import Reveal from "@/components/Reveal";
import { RIVER_PATH } from "@/lib/river";

export default function DrainMap() {
  const pathRef = useRef<SVGPathElement>(null);
  const [pts, setPts] = useState<Record<number, { x: number; y: number }>>({});
  const [selected, setSelected] = useState<Drain>(DRAINS[0]);

  useEffect(() => {
    if (!pathRef.current) return;
    const total = pathRef.current.getTotalLength();
    const out: Record<number, { x: number; y: number }> = {};
    for (const d of DRAINS) {
      const pt = pathRef.current!.getPointAtLength(d.pos * total);
      out[d.id] = { x: pt.x, y: pt.y };
    }
    setPts(out);
  }, []);

  const isBig = useMemo(() => (d: Drain) => d.dischargePct !== null, []);
  const rating = getDhs(selected.id);

  return (
    <section id="map" className="scroll-mt-24 border-y border-line bg-abyss py-20">
      <Reveal>
      <div className="mx-auto max-w-6xl px-6">
        <p className="label mb-3">The geography</p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-snow sm:text-4xl">
          The 22-kilometre crime scene
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fog">
          From Wazirabad barrage (top — the river is alive) to Okhla barrage (bottom —
          biologically dead). 22 drains pour in between. Click any marker.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* map */}
          <div className="card flex items-center justify-center p-6">
            <svg viewBox="0 0 300 640" className="w-full max-w-[320px]">
              <defs>
                <linearGradient id="mapGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2fbf8f" />
                  <stop offset="45%" stopColor="#2fbf8f" />
                  <stop offset="60%" stopColor="#f0b429" />
                  <stop offset="100%" stopColor="#f05252" />
                </linearGradient>
              </defs>
              <path ref={pathRef} d={RIVER_PATH} fill="none" stroke="none" />
              <path
                d={RIVER_PATH}
                fill="none"
                stroke="url(#mapGrad)"
                strokeWidth={24}
                strokeLinecap="round"
                className="river-glow"
              />

              {/* river bed + crisp line — smooth rendering */}
              <path
                d={RIVER_PATH}
                fill="none"
                stroke="url(#mapGrad)"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.18"
              />
              <path
                d={RIVER_PATH}
                fill="none"
                stroke="url(#mapGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <path
                d={RIVER_PATH}
                fill="none"
                stroke="rgba(233,241,245,0.4)"
                strokeWidth={1.6}
                strokeDasharray="3 9"
                className="animate-flow"
              />

              {Object.entries(pts).map(([id, p]) => {
                const d = DRAINS.find((x) => x.id === Number(id))!;
                const active = selected.id === d.id;
                const r = isBig(d) ? 8 : 5;
                return (
                  <g
                    key={id}
                    className="cursor-pointer"
                    onClick={() => setSelected(d)}
                    opacity={active ? 1 : 0.75}
                  >
                    <circle cx={p.x} cy={p.y} r={r + 5} fill="transparent" />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={r}
                      fill={active ? "#e9f1f5" : "#7e97a6"}
                      stroke={active ? "#2fbf8f" : "#05080b"}
                      strokeWidth={active ? 2.5 : 1.5}
                    />
                    {isBig(d) && (
                      <>
                        {/* pulsing ring on the biggest drains */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={r}
                          fill="none"
                          stroke="#f05252"
                          strokeWidth="1.5"
                          className="marker-ring"
                        />
                        <circle cx={p.x} cy={p.y} r={r + 3} fill="none" stroke="#f05252" strokeWidth="1" strokeDasharray="2 2" />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* detail card */}
          <div className="card p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label">Drain #{String(selected.id).padStart(2, "0")} · {selected.bank} bank</p>
                <h3 className="mt-1 font-display text-2xl font-bold text-snow">{selected.name}</h3>
              </div>
              {selected.dischargePct !== null && (
                <div className="text-right">
                  <p className="font-display text-3xl font-bold text-dead">{selected.dischargePct.toFixed(1)}%</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">of total flow</p>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-panel2 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">Discharge share</p>
                <p className="mt-1 text-sm font-semibold text-snow">
                  {selected.dischargePct != null
                    ? `${selected.dischargePct}% of 22-drain flow (DPCC 2025)`
                    : "Not in public reports yet"}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-panel2 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">BOD load</p>
                <p className="mt-1 text-sm font-semibold text-snow">
                  {selected.bodPct != null
                    ? `${selected.bodPct}% of total BOD (DPCC 2025)`
                    : "Not in public reports yet"}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-mist">{selected.note}</p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                style={{
                  color: STATUS_COLORS[selected.status],
                  borderColor: STATUS_COLORS[selected.status] + "55",
                  background: STATUS_COLORS[selected.status] + "12",
                }}
              >
                {selected.status}
                {selected.noFlow && <span className="text-fog/80"> · no flow</span>}
              </span>
              <span className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
                Source: {selected.source}
              </span>
              {rating ? (
                <span
                  className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                  style={{
                    color: rating.risk.name === "Critical" ? "#e9f1f5" : rating.risk.hex,
                    borderColor: rating.risk.hex + "66",
                    background: rating.risk.hex + "14",
                  }}
                >
                  DHS {rating.total} · {rating.risk.name} risk
                </span>
              ) : selected.noFlow ? (
                <span className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
                  DHS: no flow — tapped
                </span>
              ) : (
                <span className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-amber">
                  DHS: awaiting public data
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      </Reveal>
    </section>
  );
}
