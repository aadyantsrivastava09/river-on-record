import type { Metadata } from "next";
import Link from "next/link";
import { DRAIN_ROUNDS } from "@/data/water-quality-history";

export const metadata: Metadata = {
  title: "Methodology & Sources — River on Record",
  description:
    "How the Yamuna drain scoreboard is built: the Drain Health Score, data sources, limitations, and every official report we use.",
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-ink pb-24">
      <header className="border-b border-line bg-abyss">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-sm font-bold uppercase tracking-[0.18em] text-snow">
            River on Record
          </Link>
          <nav className="flex gap-4 text-xs">
            <Link href="/#scoreboard" className="text-fog hover:text-snow">Scoreboard</Link>
            <Link href="/" className="text-fog hover:text-snow">Home</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 pt-16">
        <p className="label mb-3">Methodology</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-snow">
          How the scoreboard is built
        </h1>
        <p className="mt-4 text-base leading-relaxed text-fog">
          Every number on this site comes from a public government report. Nothing is estimated,
          nothing is smoothed for effect, and every limitation is stated up front. This page explains
          the Drain Health Score, the data sources, and the decisions we made so anyone can check
          our work.
        </p>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-snow">1. The Drain Health Score (DHS)</h2>
          <p className="mt-3 text-sm leading-relaxed text-fog">
            DHS is a 0–100 score for each drain. 100 = excellent, 0 = critical. It is a weighted
            combination of three publicly knowable things:
          </p>
          <div className="mt-5 space-y-3 rounded-xl border border-line bg-abyss p-5 text-sm text-fog">
            <p>
              <span className="font-bold text-snow">0.70 · Water Quality (WQ)</span> — BOD, pH, TSS,
              plus DO and ammonia where river data exists. Each parameter is scored against CPCB/BIS
              thresholds and weighted into a single WQ score.
            </p>
            <p>
              <span className="font-bold text-snow">0.20 · Trend</span> — whether the drain is getting
              better or worse compared with the previous DPCC round. Stable rounds score 50; major
              improvement scores 100; major decline scores 0.
            </p>
            <p>
              <span className="font-bold text-snow">0.10 · Pollution Load</span> — the drain’s share of
              total 22-drain discharge (DJB 2025 flow data). Where no published flow share exists
              (newly reported drains), this term is excluded and the remaining weights are
              renormalised; the UI shows “not published” instead of pretending it is zero.
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-fog">
            The current implementation uses the six WQ parameters available in DPCC drain reports:
            DO, BOD, ammonia, pH, turbidity (via TSS as a proxy), and foam/floating waste where
            noted. Fecal coliform is reported only at river stations, not individual drains, so it
            is not folded into per-drain DHS. This is a data-availability choice, not a methodological
            omission.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-snow">2. Data sources</h2>
          <p className="mt-3 text-sm leading-relaxed text-fog">
            The scoreboard is rebuilt from official reports only. The five drain rounds currently
            loaded are:
          </p>
          <div className="mt-5 overflow-hidden rounded-xl border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-abyss text-xs uppercase tracking-[0.12em] text-fog">
                <tr>
                  <th className="px-4 py-3">Round</th>
                  <th className="px-4 py-3">Report / Source</th>
                  <th className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-fog">
                {DRAIN_ROUNDS.map((r) => (
                  <tr key={r.key} className="bg-ink/50">
                    <td className="px-4 py-3 font-mono text-xs text-snow">
                      {r.label} <span className="text-fog/60">({r.sampled})</span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={r.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-alive hover:text-snow"
                      >
                        {r.report} ↗
                      </a>
                    </td>
                    <td className="px-4 py-3 text-xs">{r.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-fog">
            Supporting sources include NMCG’s Delhi MPR March 2025 (roster, flows, tapping status),
            DJB May 2026 discharge figures reported by Hindustan Times, and DPCC/NMCG progress
            reports on drain tapping.
          </p>

          <div className="mt-6 rounded-xl border border-line bg-abyss p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog">Raw sources bundled with this site</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="/sources/drain_sep2026.pdf" className="text-alive hover:text-snow">DPCC Sep 2026 drain report (PDF) ↗</a>
              </li>
              <li>
                <a href="/sources/river_sep2026.pdf" className="text-alive hover:text-snow">DPCC Sep 2026 river report (PDF) ↗</a>
              </li>
              <li>
                <a href="/sources/drain_aug2026.pdf" className="text-alive hover:text-snow">DPCC Aug 2026 drain report (PDF) ↗</a>
              </li>
              <li>
                <a href="/sources/river_aug2026.pdf" className="text-alive hover:text-snow">DPCC Aug 2026 river report (PDF) ↗</a>
              </li>
              <li>
                <a href="/sources/Yamuna%2022%20Drain%20Verified%20Data.xlsx" className="text-alive hover:text-snow">Verified data workbook (Excel) ↗</a>
              </li>
              <li>
                <a href="/sources/DHS_Revised_Methodology.docx" className="text-alive hover:text-snow">DHS revised methodology (DOCX) ↗</a>
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-snow">3. Roster change</h2>
          <p className="mt-3 text-sm leading-relaxed text-fog">
            The Sep 2026 DPCC table lists 22 outfalls. Two of them — RME/RD-180 and Drain No. 12A —
            appear for the first time in the public DPCC table. They replace Tehkhand and
            Tuglakabad, which are no longer sampled in this roster. The historical chart on the home
            page shows this break explicitly: no Mar/Jun/Jul data for the two new drains, and no
            Sep 2026 data for the two dropped drains.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-snow">4. Limitations we state up front</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-fog">
            <li>
              Piecewise-linear rating curves are a defensible simplification of published CPCB/BIS
              thresholds, but they are not smooth dose-response curves.
            </li>
            <li>
              Turbidity is proxied from TSS because DPCC drain reports do not report NTU directly.
            </li>
            <li>
              Fecal coliform — the strongest public-health signal — is not reported per drain by
              DPCC, so it cannot yet enter the per-drain DHS.
            </li>
            <li>
              Pollution load depends on flow-rate measurements that can vary seasonally; we use the
              most recent published DJB share.
            </li>
            <li>
              Foam/floating-waste scoring relies on documented episodes and official notes; where
              absent, it is treated as missing rather than assumed clean.
            </li>
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-snow">5. Use this data</h2>
          <p className="mt-3 text-sm leading-relaxed text-fog">
            The dataset is meant to be reused. Every report linked above is public, and the values
            transcribed into this site are stored in plain TypeScript files under{" "}
            <code className="rounded bg-abyss px-1 py-0.5 font-mono text-xs text-alive">data/</code>.
            If you want to push an agency for action, the RTI templates in the project’s local
            research pack cover DPCC drain quality, DJB discharge/STP data, and CPCB joint
            monitoring.
          </p>
        </section>

        <div className="mt-16 border-t border-line pt-8 text-center">
          <Link
            href="/"
            className="inline-flex rounded-full bg-alive px-6 py-3 font-display text-sm font-bold tracking-wide text-ink transition-transform hover:scale-[1.03]"
          >
            Back to the scoreboard
          </Link>
        </div>
      </div>
    </main>
  );
}
