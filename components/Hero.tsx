"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DO_FC, FACTS, TICKER_ITEMS } from "@/data/drains";

const RIVER_PATH =
  "M150 20 C 60 70, 240 110, 150 165 C 60 220, 240 270, 150 325 C 60 380, 240 430, 150 485 C 110 520, 190 545, 150 615";

type Marker = { x: number; y: number; site: string; do2026: number; fc: number };

function doColor(doVal: number) {
  if (doVal >= 5) return "#2fbf8f";
  if (doVal > 0) return "#f0b429";
  return "#f05252";
}

function RiverSVG() {
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (!pathRef.current) return;
    const total = pathRef.current.getTotalLength();
    setLen(total);
    const fracs = [0.05, 0.17, 0.36, 0.5, 0.64, 0.8, 0.95];
    const pts = DO_FC.map((p, i) => {
      const pt = pathRef.current!.getPointAtLength(fracs[i] * total);
      return { x: pt.x, y: pt.y, site: p.site, do2026: p.do2026, fc: p.fc };
    });
    setMarkers(pts);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 0.72", "end 0.88"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-[340px]">
      <div className="relative">
        <svg viewBox="0 0 300 640" className="w-full">
          <defs>
            <linearGradient id="riverGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2fbf8f" />
              <stop offset="42%" stopColor="#2fbf8f" />
              <stop offset="55%" stopColor="#f0b429" />
              <stop offset="70%" stopColor="#f05252" />
              <stop offset="100%" stopColor="#f05252" />
            </linearGradient>
          </defs>

          {/* river bed */}
          <motion.path
            ref={pathRef}
            d={RIVER_PATH}
            fill="none"
            stroke="url(#riverGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.18"
          />
          <motion.path
            d={RIVER_PATH}
            fill="none"
            stroke="url(#riverGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ pathLength }}
          />

          {/* km rail */}
          {[0, 5, 10, 15, 22].map((km) => (
            <g key={km} opacity={0.5}>
              <line x1="14" y1={30 + (km / 22) * 580} x2="26" y2={30 + (km / 22) * 580} stroke="#7e97a6" strokeWidth="1" />
              <text x="10" y={36 + (km / 22) * 580} fill="#7e97a6" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="end">
                {km}km
              </text>
            </g>
          ))}

          {markers.map((m, i) => (
            <g key={m.site}>
              <line
                x1={m.x}
                y1={m.y}
                x2={m.x > 180 ? 268 : 32}
                y2={m.y}
                stroke="rgba(148,176,190,0.35)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={m.x}
                cy={m.y}
                r="6.5"
                fill={doColor(m.do2026)}
                stroke="#05080b"
                strokeWidth="2"
              />
              <text
                x={m.x > 180 ? 264 : 36}
                y={m.y - 6}
                fill={i === 0 ? "#2fbf8f" : m.do2026 > 0 ? "#f0b429" : "#f05252"}
                fontSize="10.5"
                fontFamily="JetBrains Mono, monospace"
                textAnchor={m.x > 180 ? "end" : "start"}
              >
                {m.site.split(" ")[0]}
              </text>
              <text
                x={m.x > 180 ? 264 : 36}
                y={m.y + 9}
                fill="#7e97a6"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
                textAnchor={m.x > 180 ? "end" : "start"}
              >
                DO {m.do2026}
              </text>
            </g>
          ))}

          {/* caps */}
          <text x="150" y="10" fill="#2fbf8f" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" letterSpacing="2">
            WAZIRABAD
          </text>
          <text x="150" y="636" fill="#f05252" fontSize="9" fontFamily="JetBrains Mono, monospace" textAnchor="middle" letterSpacing="2">
            OKHLA
          </text>
        </svg>

        {len > 0 && (
          <div className="pointer-events-none absolute -right-1 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-fog [writing-mode:vertical-rl]">
            pollution flows ↓
          </div>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-10">
      {/* backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(47,191,143,0.09), transparent 60%), radial-gradient(40% 40% at 85% 30%, rgba(240,82,82,0.06), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="label mb-5 animate-rise">
              Youth Impact Summit 2026 · SDG 13 · Built entirely on public government data
            </p>

            <h1 className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-snow sm:text-5xl lg:text-[3.4rem] animate-rise">
              The river dies in 22 kilometres.
              <br />
              <span className="text-dead">We rate the drains</span>
              <br />
              that kill it.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-mist animate-rise">
              Rs 8,000 crore. 30 years of plans. 41 government real-time monitors.
              And still, no citizen, journalist or court can get a straight answer to one
              question:{" "}
              <span className="text-snow font-semibold">
                which drain is poisoning the Yamuna this week?
              </span>{" "}
              River on Record answers it — with the data the government already collects,
              repackaged into a public weekly scoreboard nobody can ignore.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 animate-rise">
              <a
                href="#scoreboard"
                className="rounded-full bg-alive px-6 py-3 font-display text-sm font-bold tracking-wide text-ink transition-transform hover:scale-[1.03] glow-alive"
              >
                See the scoreboard ↓
              </a>
              <a
                href="#data"
                className="rounded-full border border-line-strong px-6 py-3 font-mono text-sm tracking-wide text-mist transition-colors hover:border-alive/50 hover:text-snow"
              >
                How it's built
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {["No drones", "No sensors of our own", "No hardware budget", "Public data only"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fog"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <RiverSVG />
        </div>

        {/* facts strip */}
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
          {FACTS.map((f) => (
            <div key={f.label} className="bg-abyss p-5">
              <p className="font-display text-2xl font-bold text-snow sm:text-[1.7rem]">
                {f.value}
                {f.unit && <span className="ml-1 font-mono text-xs font-normal text-fog">{f.unit}</span>}
              </p>
              <p className="mt-2 text-[11.5px] leading-snug text-fog">{f.label}</p>
            </div>
          ))}
        </div>

        {/* ticker */}
        <div className="mt-10 overflow-hidden border-y border-line py-3">
          <div className="flex w-max animate-ticker gap-16">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span key={i} className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
                <span className="mr-2 text-dead">●</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
