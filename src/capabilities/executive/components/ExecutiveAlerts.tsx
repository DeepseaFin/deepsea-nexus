import type { ExecutiveAlertItem } from "@/src/capabilities/executive/types/ExecutiveWorkspaceState";

type ExecutiveAlertsProps = {
  readonly items: readonly ExecutiveAlertItem[];
};

export default function ExecutiveAlerts({ items }: ExecutiveAlertsProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Executive Alerts</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{item.category}</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{item.message}</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <p className="uppercase tracking-[0.1em] text-cyan-300">{item.severity}</p>
              <p className="text-slate-500">{item.updatedAt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
