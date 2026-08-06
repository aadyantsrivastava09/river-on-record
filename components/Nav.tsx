"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#scoreboard", label: "Scoreboard" },
  { href: "#map", label: "Map" },
  { href: "#data", label: "Data" },
  { href: "#forecast", label: "Forecast" },
  { href: "#people", label: "People" },
  { href: "#verify", label: "Verify" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ink/85 backdrop-blur-md border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3 group">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-dead animate-pulse-dot" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-dead" />
          </span>
          <span className="font-display text-sm font-bold tracking-[0.18em] text-snow uppercase">
            River<span className="text-dead"> on </span>Record
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog transition-colors hover:text-snow"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#join"
          className="rounded-full border border-alive/40 bg-alive/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-alive transition-all hover:bg-alive/20"
        >
          Join the watch
        </a>
      </div>
    </header>
  );
}
