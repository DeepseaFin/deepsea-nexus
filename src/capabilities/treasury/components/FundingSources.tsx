import type { FundingSourceItem } from "@/src/capabilities/treasury/types/TreasuryWorkspaceState";

type FundingSourcesProps = {
  readonly items: readonly FundingSourceItem[];
};

export default function FundingSources({ items }: FundingSourcesProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Funding Sources</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-100">{item.source}</p>
            <p className="mt-1 text-xs text-slate-400">Limit: {item.limit}</p>
            <p className="mt-1 text-xs text-slate-400">Available: {item.available}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-cyan-300">{item.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
