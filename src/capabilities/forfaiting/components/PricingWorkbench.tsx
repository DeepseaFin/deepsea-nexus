import type { PricingWorkbenchItem } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

type PricingWorkbenchProps = {
  readonly items: readonly PricingWorkbenchItem[];
};

export default function PricingWorkbench({ items }: PricingWorkbenchProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Pricing Workbench</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.scenario}</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">Discount {item.discountRate}</p>
            <p className="mt-1 text-xs text-slate-400">Expected Yield {item.expectedYield}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-cyan-300">{item.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
