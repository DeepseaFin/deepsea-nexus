import type { InstitutionHealthState } from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

type InstitutionHealthProps = {
  readonly health: InstitutionHealthState;
};

function tone(status: "strong" | "watch" | "critical"): string {
  if (status === "strong") return "text-emerald-300";
  if (status === "watch") return "text-amber-300";
  return "text-rose-300";
}

export default function InstitutionHealth({ health }: InstitutionHealthProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Institution Health</h2>
      <div className="mt-3 rounded border border-slate-800 bg-slate-950/60 p-3">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Composite Score</p>
        <p className="mt-1 text-2xl font-semibold text-slate-100">{health.score}</p>
        <p className={["mt-1 text-xs uppercase tracking-[0.14em]", tone(health.status)].join(" ")}>{health.status}</p>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {health.metrics.map((metric) => (
          <article key={metric.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{metric.label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{metric.value}</p>
            <p className={["text-xs", tone(metric.status)].join(" ")}>{metric.trend}</p>
          </article>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">Last Reviewed: {health.reviewedAt}</p>
    </section>
  );
}
