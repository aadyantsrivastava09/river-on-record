export default function People() {
  const groups = [
    {
      title: "Chhath devotees",
      stat: "55.6%",
      statLabel: "of river-using households report waterborne illness",
      body: "Every November, thousands wade into water that failed every legal standard the day they did. They are not statistics — they are the reason the scoreboard is public.",
      source: "Delhi University study · YIS Research Pack",
    },
    {
      title: "Farmers of the floodplains",
      stat: "49%",
      statLabel: "of floodplain farmers earn under ₹10,000 a month",
      body: "They irrigate with this water and sell what it grows. They cannot afford to test it — so we publish what the state already measured about it.",
      source: "Asghar Ali Engineers · YIS Research Pack",
    },
    {
      title: "The last boatmen",
      stat: "3",
      statLabel: "active boatmen remain on the Okhla stretch",
      body: "A fishing economy that once fed families now survives on ferry rides. The river's collapse is measured in their shrinking count — the scoreboard names the reason.",
      source: "Community reports · YIS Research Pack",
    },
  ];

  return (
    <section id="people" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="label mb-3">Who bears it</p>
        <h2 className="font-display text-3xl font-bold tracking-tight text-snow sm:text-4xl">
          The river is a daily wage, a festival, a livelihood
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fog">
          The people who cannot filter, test or move — they are the stakeholders the
          scoreboard is accountable to.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title} className="card flex flex-col p-6">
              <p className="font-display text-sm font-bold text-mist">{g.title}</p>
              <p className="mt-4 font-display text-4xl font-bold text-snow">{g.stat}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fog">{g.statLabel}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-mist">{g.body}</p>
              <p className="mt-5 border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fog/70">
                {g.source}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
