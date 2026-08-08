import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div>
          <p className="font-display text-sm font-bold text-snow">River on Record</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fog/70">
            The public drain scoreboard for the Yamuna
          </p>
        </div>

        {/* Powered by Vantalyne Labs */}
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-vl-cream">
            <Image
              src="/vantalyne-navy.png"
              alt="Vantalyne Labs"
              width={291}
              height={272}
              className="h-5 w-auto"
            />
          </span>
          <div>
            <p className="font-display text-xs font-bold text-snow">Powered by Vantalyne Labs</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fog/70">
              A youth-led ecosystem of builders
            </p>
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog/70">
          Every number traced · every bulletin hashed
        </p>
      </div>
    </footer>
  );
}
