import type { SettlementTrackerItem } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

type SettlementTrackerProps = {
  readonly items: readonly SettlementTrackerItem[];
};

export default function SettlementTracker({ items }: SettlementTrackerProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Settlement Tracker</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-100">{item.milestone}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-cyan-300">{item.status}</p>
            <p className="mt-1 text-xs text-slate-500">ETA: {item.eta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
