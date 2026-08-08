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
          the reports are public. We simply turn them into a weekly, verifiable scoreboard —
          and let the public do the rest.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-dashed border-line bg-panel px-6 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-alive">
            Starting soon
          </p>
          <p className="mt-2 text-sm leading-relaxed text-fog">
            The Friday bulletin — one email a week on the scoreboard — opens for signups at launch.
          </p>
        </div>

        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog/70">
          No spam. One email a week — the bulletin.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {["DPCC data", "CPCB reports", "DJB flow records", "NGT orders", "27 DPCC monitors", "100% public"].map((c) => (
            <span key={c} className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
