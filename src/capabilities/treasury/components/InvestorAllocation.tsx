import type { InvestorAllocationItem } from "@/src/capabilities/treasury/types/TreasuryWorkspaceState";

type InvestorAllocationProps = {
  readonly items: readonly InvestorAllocationItem[];
};

export default function InvestorAllocation({ items }: InvestorAllocationProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Investor Allocation</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-100">{item.investor}</p>
              <p className="text-xs uppercase tracking-[0.12em] text-cyan-300">{item.status}</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Allocation: {item.allocation}</p>
            <p className="mt-1 text-xs text-slate-500">Mandate: {item.mandate}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
