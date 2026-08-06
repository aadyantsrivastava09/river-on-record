export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div>
          <p className="font-display text-sm font-bold text-snow">River on Record</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fog/70">
            A YIS 2026 · SDG 13 public-accountability project
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fog/70">
          Every number traced · every bulletin hashed
        </p>
      </div>
    </footer>
  );
}
