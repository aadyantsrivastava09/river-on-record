"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { DO_FC, TICKER_ITEMS } from "@/data/drains";
import CountUp from "@/components/CountUp";
import { RIVER_PATH } from "@/lib/river";

// Numeric targets for the animated counters — values match the FACTS strings above,
// so the count-up lands exactly on the published figure.
const COUNT_FACTS = [
  { label: "of river carrying >80% of the pollution — alive at Palla, dead at Okhla", to: 22, decimals: 0, unit: "km" },
  { label: "of drain flow pouring in every day (DJB, May 2026)", to: 1324.4, decimals: 1, unit: "MGD" },
  { label: "of 27 drains failed water-quality standards — only one passed", to: 26, decimals: 0, unit: "/27" },
  { label: "from one drain — Najafgarh, more than all 37 STPs combined", to: 862, decimals: 0, unit: "MGD", prefix: "~" },
  { label: "of the pollution load from just two drains — Najafgarh + Shahdara", to: 87, decimals: 0, unit: "%" },
];

const MARKER_FRACS = [0.05, 0.17, 0.36, 0.5, 0.64, 0.8, 0.95];

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
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    if (!pathRef.current) return;
    const total = pathRef.current.getTotalLength();
    setLen(total);
    const pts = DO_FC.map((p, i) => {
      const pt = pathRef.current!.getPointAtLength(MARKER_FRACS[i] * total);
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
    <div
      ref={wrapRef}
      className="relative mx-auto w-full max-w-[340px]"
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform 0.25s ease-out",
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ rx: -py * 4, ry: px * 6 });
      }}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
    >
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

          {/* glow halo — smooth, behind the river */}
          <path
            d={RIVER_PATH}
            fill="none"
            stroke="url(#riverGrad)"
            strokeWidth={20}
            strokeLinecap="round"
            className="river-glow"
          />

          {/* river bed + crisp line — the original smooth rendering */}
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

          {/* current: dashes flowing downstream */}
          <path
            d={RIVER_PATH}
            fill="none"
            stroke="rgba(233,241,245,0.4)"
            strokeWidth={1.6}
            strokeDasharray="3 9"
            className="animate-flow"
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

          {/* oxygen bubbles upstream, where the river is still alive */}
          {len > 0 &&
            [
              [0.02, "#2fbf8f", -12],
              [0.06, "#56c8e8", 12],
              [0.1, "#56c8e8", -12],
              [0.13, "#2fbf8f", 12],
              [0.05, "#56c8e8", -10],
            ].map(([f, c, dx], i) => {
              const pt = pathRef.current?.getPointAtLength((f as number) * len);
              if (!pt) return null;
              return (
                <circle
                  key={i}
                  cx={pt.x + (dx as number)}
                  cy={pt.y - 6}
                  r={i % 2 === 0 ? 2.2 : 3}
                  fill={c as string}
                  className="animate-bob"
                  style={{ animationDelay: `${i * 0.6}s` }}
                />
              );
            })}

          {/* DO station markers */}
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
              {m.do2026 <= 0 && (
                <circle cx={m.x} cy={m.y} r="6.5" fill="none" stroke="#f05252" strokeWidth="1.5" className="marker-ring" />
              )}
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
            {/* Vantalyne Labs branding */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-panel px-4 py-1.5 animate-rise">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-vl-cream">
                <Image
                  src="/vantalyne-navy.png"
                  alt="Vantalyne Labs"
                  width={291}
                  height={272}
                  className="h-3.5 w-auto"
                />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">
                A Vantalyne Labs venture
              </span>
            </div>

            <p className="label mb-5 animate-rise">
              Built entirely on public government data
            </p>

            <h1 className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-snow sm:text-5xl lg:text-[3.4rem] animate-rise">
              The river dies in 22 kilometres.
              <br />
              <span className="text-dead">We rate the drains</span>
              <br />
              that kill it.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-mist animate-rise">
              Rs 8,000 crore. 30 years of plans. 27 government monitoring points.
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
          {COUNT_FACTS.map((f) => (
            <div key={f.label} className="bg-abyss p-5">
              <p className="font-display text-2xl font-bold text-snow sm:text-[1.7rem]">
                {f.prefix && <span className="mr-1 font-mono text-sm font-normal text-fog">{f.prefix}</span>}
                <CountUp value={f.to} decimals={f.decimals} />
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

        {/* what is Vantalyne Labs */}
        <div className="mt-12 flex flex-col items-start gap-5 rounded-2xl border border-line bg-panel p-6 sm:flex-row sm:items-center sm:p-8">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-vl-cream">
            <Image
              src="/vantalyne-navy.png"
              alt="Vantalyne Labs"
              width={291}
              height={272}
              className="h-7 w-auto"
            />
          </span>
          <div>
            <p className="font-display text-sm font-bold tracking-wide text-snow">
              What is Vantalyne Labs?
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-mist">
              Vantalyne Labs is a youth-led ecosystem of builders. It never takes equity from
              founder-brought ventures, and support never costs ownership — once something is built
              here, it carries that history permanently. River on Record is one of those ventures:
              conceived, built, and published under the Vantalyne Labs name.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
