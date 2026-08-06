export default function Verify() {
  const chain = [
    { hash: "0x9f2e…41c7", label: "Weekly Bulletin #1 · DO 5.9→0.0", state: "committed" },
    { hash: "0xb8a3…77d2", label: "Scoreboard v1 · 22 drains ranked", state: "committed" },
    { hash: "0x3e11…09af", label: "Foam Forecast model · v0.9", state: "committed" },
  ];

  return (
    <section id="verify" className="scroll-mt-24 border-y border-line bg-abyss py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="label mb-3">The honesty layer</p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-snow sm:text-4xl">
          YamunaChain — public data, tamper-evident
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fog">
          Every weekly bulletin gets a SHA-256 fingerprint, chained to the previous one.
          Anyone can verify, in seconds, that a score was never edited after publication.
          The chain runs on a free public ledger — no server, no cost, no trust required.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {chain.map((b, i) => (
              <div key={b.hash} className="card flex flex-wrap items-center gap-3 p-4">
                <span className="rounded-full border border-line bg-panel2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">
                  Block {i + 1}
                </span>
                <p className="flex-1 text-sm text-snow">{b.label}</p>
                <code className="font-mono text-xs text-alive">{b.hash}</code>
              </div>
            ))}
            <div className="card flex flex-wrap items-center gap-3 border-dashed p-4 opacity-70">
              <span className="rounded-full border border-amber/40 bg-amber/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-amber">
                Next block
              </span>
              <p className="flex-1 text-sm text-fog">This week&apos;s bulletin — published every Friday</p>
              <code className="font-mono text-xs text-fog">…</code>
            </div>
          </div>

          <div className="card p-6">
            <p className="font-display text-sm font-bold text-amber">Why it kills the denial</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-mist">
              <li>— The scoreboard republishes DPCC&apos;s own numbers, hash-linked to its source table.</li>
              <li>— When an agency publishes, we publish the record of it — immutable.</li>
              <li>— Politicians, DJB, DPCC and NGOs can argue about policy; they cannot argue about the receipt.</li>
              <li>— Verification is one line of code: hash the bulletin, compare with the chain.</li>
            </ul>
            <p className="mt-5 border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-fog/70">
              PoC staged in the project repo · public ledger integration next
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
