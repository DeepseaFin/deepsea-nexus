import type { InstitutionKpi } from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

type InstitutionDashboardProps = {
  readonly kpis: readonly InstitutionKpi[];
};

export default function InstitutionDashboard({ kpis }: InstitutionDashboardProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Institution Dashboard</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{kpi.label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{kpi.value}</p>
            <p className="mt-1 text-xs text-slate-400">{kpi.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
