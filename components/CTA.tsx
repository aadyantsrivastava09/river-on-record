"use client";

import { useState } from "react";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section id="join" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="label mb-3">Act now</p>
        <h2 className="font-display text-4xl font-bold tracking-tight text-snow">
          The data exists. <span className="text-alive">The scoreboard makes it count.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-fog">
          No drones. No sensors. No hardware budget. 41 government monitors already run 24×7;
          the reports are public. We simply turn them into a weekly, verifiable scoreboard —
          and let the public do the rest.
        </p>

        <form
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setDone(true);
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@agency.gov.in"
            className="flex-1 rounded-lg border border-line bg-panel px-4 py-3 font-mono text-sm text-snow placeholder:text-fog/60 focus:border-alive/50 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-alive px-5 py-3 font-display text-sm font-bold text-ink transition hover:brightness-110"
          >
            {done ? "Listed ✓" : "Watch the scoreboard"}
          </button>
        </form>

        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog/70">
          No spam. One email a week — the bulletin.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {["DPCC data", "CPCB reports", "DJB flow records", "NGT orders", "41 live monitors", "100% public"].map((c) => (
            <span key={c} className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
