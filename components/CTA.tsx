"use client";

export default function CTA() {
  return (
    <section id="join" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="label mb-3">Get involved</p>
        <h2 className="font-display text-4xl font-bold tracking-tight text-snow">
          The data exists. <span className="text-alive">The scoreboard makes it count.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-fog">
          No drones. No sensors. No hardware budget. 27 DPCC monitoring locations already sample the river;
          the reports are public. We simply turn them into a current, verifiable scoreboard —
          and let the public do the rest.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {["DPCC data", "CPCB reports", "DJB flow records", "NMCG (Jan 2026)", "27 DPCC monitors", "100% public"].map((c) => (
            <span key={c} className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
