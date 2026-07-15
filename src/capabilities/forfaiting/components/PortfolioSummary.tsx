import type { PortfolioSummaryState } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

type PortfolioSummaryProps = {
  readonly summary: PortfolioSummaryState;
  readonly compact?: boolean;
};

export default function PortfolioSummary({ summary, compact = false }: PortfolioSummaryProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Portfolio Summary</h2>
      <div className={compact ? "mt-3 space-y-2" : "mt-3 grid gap-2 sm:grid-cols-2"}>
        <article className="rounded border border-slate-800 bg-slate-950/60 p-3"><p className="text-xs text-slate-500">Outstanding</p><p className="mt-1 text-sm font-semibold text-slate-100">{summary.outstanding}</p></article>
        <article className="rounded border border-slate-800 bg-slate-950/60 p-3"><p className="text-xs text-slate-500">Concentration</p><p className="mt-1 text-sm font-semibold text-slate-100">{summary.concentration}</p></article>
        <article className="rounded border border-slate-800 bg-slate-950/60 p-3"><p className="text-xs text-slate-500">Weighted Tenor</p><p className="mt-1 text-sm font-semibold text-slate-100">{summary.weightedTenor}</p></article>
        <article className="rounded border border-slate-800 bg-slate-950/60 p-3"><p className="text-xs text-slate-500">Active Deals</p><p className="mt-1 text-sm font-semibold text-slate-100">{summary.activeDeals}</p></article>
      </div>
    </section>
  );
}
