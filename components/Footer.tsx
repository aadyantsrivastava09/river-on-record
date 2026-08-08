import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div>
          <Image
            src="/logo-round.png"
            alt="River on Record"
            width={993}
            height={1006}
            className="h-12 w-auto"
          />
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fog/70">
            The public drain scoreboard for the Yamuna
          </p>
        </div>

        {/* Powered by Vantalyne Labs */}
        <a
          href="https://vantalynelabs.in"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-vl-cream">
            <Image
              src="/vantalyne-navy.png"
              alt="Vantalyne Labs"
              width={291}
              height={272}
              className="h-5 w-auto"
            />
          </span>
          <span>
            <p className="font-display text-xs font-bold text-snow transition-colors group-hover:text-alive">
              Powered by Vantalyne Labs<span className="text-alive"> ↗</span>
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fog/70">
              A youth-led ecosystem of builders
            </p>
          </span>
        </a>

        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog/70">
          Every number traced · every figure sourced
        </p>
      </div>
    </footer>
  );
}
