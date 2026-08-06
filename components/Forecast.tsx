export default function Forecast() {
  const days = [
    { day: "Today", place: "Kalindi Kunj", risk: "HIGH", tone: "text-dead border-dead/40 bg-dead/10", time: "12:00–18:00" },
    { day: "Tomorrow", place: "Okhla Barrage", risk: "HIGH", tone: "text-dead border-dead/40 bg-dead/10", time: "09:00–14:00" },
    { day: "Next 48h", place: "ITO", risk: "MEDIUM", tone: "text-amber border-amber/40 bg-amber/10", time: "Monitoring" },
  ];

  return (
    <section id="forecast" className="scroll-mt-24 border-y border-line bg-abyss py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="label mb-3">Coming soon · built on public monitor data</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold tracking-tight text-snow sm:text-4xl">
            Foam forecast — like weather, for the river
          </h2>
          <span className="rounded-full border border-amber/40 bg-amber/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber">
            Concept demo
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fog">
          Foam forms when three publicly-reported conditions align: high BOD, high surfactant
          load and turbulence at the barrages. The same government data we score — DPCC
          monitors, DJB flow records, seasonal patterns — can forecast where foam will
          appear, before devotees step into it.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {days.map((d) => (
            <div key={d.day} className="card p-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-fog">{d.day}</p>
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.12em] ${d.tone}`}>
                  {d.risk}
                </span>
              </div>
              <p className="mt-4 font-display text-xl font-bold text-snow">{d.place}</p>
              <p className="mt-1 font-mono text-xs text-fog">{d.time}</p>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-panel2">
                <div
                  className={`h-full rounded-full ${d.risk === "HIGH" ? "bg-dead w-[88%]" : "bg-amber w-[55%]"}`}
                />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-fog">
                {d.risk === "HIGH"
                  ? "Avoid contact. Foam concentrates heavy metals and toxic gases. Check the ghat alert."
                  : "Caution advised at barrages; monitor conditions before entering water."}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-fog/70">
          Forecast model is the next build — it uses only public monitor streams, same as the scoreboard.
        </p>
      </div>
    </section>
  );
}
