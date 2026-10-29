import { DRAIN_SAMPLES, LATEST_ROUND } from "@/data/water-quality";

export default function LatestSample({ drainId }: { drainId: number }) {
  const sample = DRAIN_SAMPLES[drainId]?.latest;

  if (!sample) return null;

  return (
    <div className="rounded-xl border border-line bg-abyss p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
          DPCC drain sample · {LATEST_ROUND.sampled}
        </p>
        <a
          href={LATEST_ROUND.drainUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] uppercase tracking-[0.12em] text-alive transition-colors hover:text-snow"
        >
          Source PDF ↗
        </a>
      </div>

      {sample.noFlow ? (
        <p className="mt-3 font-display text-sm font-semibold text-fog">
          No flow recorded on {LATEST_ROUND.sampled}.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "pH", value: sample.ph, unit: "" },
            { label: "TSS", value: sample.tss, unit: "mg/L" },
            { label: "COD", value: sample.cod, unit: "mg/L" },
            { label: "BOD", value: sample.bod, unit: "mg/L" },
          ].map((x) => (
            <div key={x.label}>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-fog">{x.label}</p>
              <p className="mt-0.5 font-display text-lg font-bold text-snow">
                {x.value}
                {x.unit && <span className="ml-1 font-mono text-[9px] font-normal text-fog">{x.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
