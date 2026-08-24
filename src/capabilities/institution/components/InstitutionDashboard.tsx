import type { InstitutionKpi } from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

type InstitutionDashboardProps = {
  readonly kpis: readonly InstitutionKpi[];
};

export default function InstitutionDashboard({ kpis }: InstitutionDashboardProps) {
  return (
    <section className="rounded-2xl border border-slate-800/90 bg-slate-900/40 p-5">
      <h2 className="text-lg font-semibold tracking-tight text-slate-100">Institution Dashboard</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{kpi.label}</p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-slate-100">{kpi.value}</p>
            <p className="mt-2 text-xs text-slate-400">{kpi.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
