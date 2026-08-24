import type { PurchasePanelItem } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

type PurchasePanelProps = {
  readonly items: readonly PurchasePanelItem[];
};

export default function PurchasePanel({ items }: PurchasePanelProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Purchase Panel</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-100">Receivable {item.receivableId}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-cyan-300">{item.purchaseStatus}</p>
            <p className="mt-1 text-xs text-slate-400">Owner: {item.owner}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
