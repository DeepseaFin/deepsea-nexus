import type { ExecutiveKpiItem } from "@/src/capabilities/executive/types/ExecutiveWorkspaceState";

type ExecutiveDashboardProps = {
  readonly items: readonly ExecutiveKpiItem[];
};

export default function ExecutiveDashboard({ items }: ExecutiveDashboardProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Executive Dashboard</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
            <p className="mt-1 text-base font-semibold text-slate-100">{item.value}</p>
            <p className="mt-1 text-xs text-slate-400">{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
