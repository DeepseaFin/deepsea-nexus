import type { ExposureDashboardItem } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

type ExposureDashboardProps = {
  readonly items: readonly ExposureDashboardItem[];
};

export default function ExposureDashboard({ items }: ExposureDashboardProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Exposure Dashboard</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{item.dimension}</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{item.value}</p>
            <p className="text-xs text-slate-400">Limit {item.limit}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-cyan-300">{item.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
