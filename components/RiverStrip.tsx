"use client";

import { useState } from "react";
import { DRAINS, DO_FC, STATUS_COLORS } from "@/data/drains";
import type { Drain } from "@/data/drains";
import { getDhs } from "@/data/dhs";
import Reveal from "@/components/Reveal";

// The 22 km transect — horizontal cut, Wazirabad (left) → Okhla (right).
const X0 = 40;
const X1 = 960;
const SPAN = X1 - X0;

// Gently wavy band: top edge y ≈ 60–76, bottom edge y ≈ 94–108.
const BAND =
  "M40 70 C 130 64, 210 76, 300 68 C 400 60, 500 74, 600 66 C 700 60, 850 74, 960 68 " +
  "L960 100 C 850 94, 700 108, 600 102 C 500 94, 400 108, 300 100 C 210 92, 130 104, 40 98 Z";
const TOP_EDGE = "M40 70 C 130 64, 210 76, 300 68 C 400 60, 500 74, 600 66 C 700 60, 850 74, 960 68";
const BOT_EDGE = "M40 98 C 130 104, 210 92, 300 100 C 400 108, 500 94, 600 102 C 700 108, 850 94, 960 100";

// River stations along the stretch, same order as the vertical map.
const STATION_FRACS = [0.05, 0.17, 0.36, 0.5, 0.64, 0.8, 0.95];

const KM_TICKS = [0, 5, 10, 15, 22];

const doColor = (doVal: number) => (doVal >= 5 ? "#2fbf8f" : doVal > 0 ? "#f0b429" : "#f05252");

const shortName = (d: Drain) => d.name.split(" ")[0];

// Pipe width ∝ share of the 22-drain discharge (DPCC 2025), sqrt-scaled so
// small drains stay visible next to Najafgarh's 69.77%.
const pipeWidth = (d: Drain) =>
  d.dischargePct == null ? 3 : 3 + 27 * Math.sqrt(d.dischargePct / 69.77);

const TAG_HALO = { paintOrder: "stroke" as const, stroke: "#0a1218", strokeWidth: 3.5 };

export default function RiverStrip() {
  const [active, setActive] = useState<Drain | null>(null);

  const flowing = DRAINS.filter((d) => d.dischargePct !== null);
  const westTags = flowing.filter((d) => d.bank === "West");
  const eastTags = flowing.filter((d) => d.bank === "East");
  const tapped = DRAINS.filter((d) => d.noFlow);
  const rated = DRAINS.filter((d) => getDhs(d.id));
  const rating = active ? getDhs(active.id) : undefined;

  const renderPipe = (d: Drain) => {
    const x = X0 + d.pos * SPAN;
    const dhs = getDhs(d.id);
    const isEast = d.bank === "East";
    const color = d.noFlow ? "#40505c" : dhs ? dhs.risk.hex : STATUS_COLORS[d.status];
    const w = pipeWidth(d);
    const yOuter = isEast ? 190 : 30;
    const yBand = isEast ? 104 : 66;
    const hovered = active?.id === d.id;
    return (
      <g
        key={d.id}
        opacity={active && !hovered ? 0.25 : 1}
        className="cursor-pointer"
        onMouseEnter={() => setActive(d)}
        onMouseLeave={() => setActive(null)}
      >
        <line
          x1={x}
          y1={yOuter}
          x2={x}
          y2={yBand}
          stroke={color}
          strokeWidth={w}
          strokeLinecap="round"
          opacity={0.92}
        />
        {d.noFlow && (
          <text
            x={x}
            y={isEast ? yOuter - 10 : yOuter + 16}
            fill="#40505c"
            fontSize="9"
            textAnchor="middle"
            style={TAG_HALO}
          >
            ×
          </text>
        )}
        {/* junction where the drain meets the river */}
        <circle cx={x} cy={yBand} r={Math.max(4, w / 2)} fill={color} stroke="#05080b" strokeWidth={1.5} />
      </g>
    );
  };

  return (
    <section className="scroll-mt-24 border-y border-line bg-abyss py-20">
      <Reveal>
        <div className="mx-auto max-w-6xl px-6">
          <p className="label mb-3">The transect</p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-snow sm:text-4xl">
            Wazirabad → Okhla, 22 km
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fog">
            A horizontal cut of the same stretch — flow runs left to right. Every drain is drawn to
            scale: pipe width is its share of the 22-drain discharge, pipe colour is its DHS rating
            where public data allows (Najafgarh, Shahdara), otherwise its tapping status. Grey pipes
            are tapped drains that recorded no flow.
          </p>

          <div className="mt-10 overflow-x-auto pb-2">
            <svg viewBox="0 0 1000 220" className="w-full min-w-[760px]">
              <defs>
                <linearGradient id="stripGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2fbf8f" />
                  <stop offset="16%" stopColor="#f0b429" />
                  <stop offset="30%" stopColor="#f05252" />
                  <stop offset="100%" stopColor="#f05252" />
                </linearGradient>
              </defs>

              {/* east-bank pipes behind the river */}
              {DRAINS.filter((d) => d.bank === "East").map(renderPipe)}

              {/* the river bed */}
              <path d={BAND} fill="url(#stripGrad)" className="river-glow" />
              <path d={BAND} fill="url(#stripGrad)" />

              {/* surface shimmer — current flowing left → right */}
              {[76, 84, 92].map((y) => (
                <path
                  key={y}
                  d={`M${X0} ${y} L${X1} ${y}`}
                  fill="none"
                  stroke="rgba(233,241,245,0.22)"
                  strokeWidth={1.5}
                  strokeDasharray="6 20"
                  className="animate-flow-x"
                />
              ))}

              {/* banks */}
              <path d={TOP_EDGE} fill="none" stroke="#070c10" strokeWidth={6} strokeLinecap="round" />
              <path d={BOT_EDGE} fill="none" stroke="#070c10" strokeWidth={6} strokeLinecap="round" />

              {/* west-bank pipes */}
              {DRAINS.filter((d) => d.bank === "West").map(renderPipe)}

              {/* flow direction */}
              <text x={X0} y={54} fill="#7e97a6" fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="2">
                FLOW →
              </text>
              <text x={20} y={90} fill="#40505c" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="3" transform="rotate(-90 20 90)" textAnchor="middle">
                WEST BANK
              </text>
              <text x={980} y={90} fill="#40505c" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="3" transform="rotate(90 980 90)" textAnchor="middle">
                EAST BANK
              </text>

              {/* km rail */}
              {KM_TICKS.map((km) => {
                const x = X0 + (km / 22) * SPAN;
                return (
                  <g key={km} opacity={0.6}>
                    <line x1={x} y1={118} x2={x} y2={126} stroke="#7e97a6" strokeWidth="1" />
                    <text x={x} y={138} fill="#7e97a6" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle">
                      {km}{km === 22 ? " km" : ""}
                    </text>
                  </g>
                );
              })}

              {/* river stations — DO May 2026 (DPCC) */}
              {DO_FC.map((p, i) => {
                const x = X0 + STATION_FRACS[i] * SPAN;
                return (
                  <g key={p.site}>
                    <circle cx={x} cy={84} r="4.5" fill={doColor(p.do2026)} stroke="#05080b" strokeWidth="2" />
                    <text
                      x={x}
                      y={i % 2 === 0 ? 146 : 162}
                      fill={doColor(p.do2026)}
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      textAnchor="middle"
                      style={TAG_HALO}
                    >
                      {p.site.split(" ")[0]} · DO {p.do2026}
                    </text>
                  </g>
                );
              })}

              {/* drain tags — flowing drains only */}
              {westTags.map((d, i) => (
                <text
                  key={d.id}
                  x={X0 + d.pos * SPAN}
                  y={i % 2 === 0 ? 8 : 20}
                  fill="#b6c8d3"
                  fontSize="9.5"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                  style={TAG_HALO}
                >
                  {shortName(d)}
                </text>
              ))}
              {eastTags.map((d, i) => (
                <text
                  key={d.id}
                  x={X0 + d.pos * SPAN}
                  y={i % 2 === 0 ? 196 : 208}
                  fill="#b6c8d3"
                  fontSize="9.5"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                  style={TAG_HALO}
                >
                  {shortName(d)}
                </text>
              ))}
            </svg>
          </div>

          {/* hover readout */}
          <div className="mt-4 min-h-[22px] font-mono text-xs text-mist">
            {active ? (
              <>
                #{String(active.id).padStart(2, "0")} · {active.name} · {active.bank} bank ·{" "}
                {active.status}
                {active.noFlow && " · no flow"}
                {rating
                  ? ` · DHS ${rating.total} · ${rating.risk.name} risk`
                  : " · DHS: awaiting public data"}
              </>
            ) : (
              "Hover a drain to inspect it."
            )}
          </div>

          {/* legend */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="card p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">Rated drains · DHS</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {rated.map((d) => {
                  const r = getDhs(d.id)!;
                  return (
                    <span
                      key={d.id}
                      className="flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px]"
                      style={{
                        color: r.risk.hex,
                        borderColor: r.risk.hex + "55",
                        background: r.risk.hex + "12",
                      }}
                    >
                      <i className="h-2 w-2 rounded-full" style={{ background: r.risk.hex }} />
                      {shortName(d)} · DHS {r.total} · {r.risk.name}
                    </span>
                  );
                })}
                {rated.length === 0 && <span className="text-xs text-fog">Awaiting public data.</span>}
              </div>
            </div>

            <div className="card p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">Unrated · tapping status</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Object.keys(STATUS_COLORS) as (keyof typeof STATUS_COLORS)[]).map((s) => {
                  const n = DRAINS.filter((d) => d.status === s).length;
                  return (
                    <span
                      key={s}
                      className="flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] text-fog"
                    >
                      <i className="h-2 w-2 rounded-full" style={{ background: STATUS_COLORS[s] }} />
                      {s} × {n}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="card p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">Tapped · dry outfalls</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] text-fog">
                  <i className="h-2 w-2 rounded-full" style={{ background: "#40505c" }} />
                  × {tapped.length} drains · no flow (DPCC 2026)
                </span>
                <span className="flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] text-fog">
                  pipe width ∝ discharge share
                </span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
