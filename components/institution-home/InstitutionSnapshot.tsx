import type { InstitutionSnapshotProps } from "./types";

const DEFAULT_METRICS = [
  { label: "Active Missions", value: "--" },
  { label: "Waiting Missions", value: "--" },
  { label: "At Risk Missions", value: "--" },
  { label: "Completed Today", value: "--" },
] as const;

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

export function InstitutionSnapshot({ metrics = DEFAULT_METRICS, className }: InstitutionSnapshotProps) {
  return (
    <section className={withClassName("space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4", className)}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Institution Snapshot</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-100">{metric.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}