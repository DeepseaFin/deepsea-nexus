import type { LiquidityMetric } from "@/src/capabilities/treasury/types/TreasuryWorkspaceState";

type LiquidityDashboardProps = {
  readonly metrics: readonly LiquidityMetric[];
};

export default function LiquidityDashboard({ metrics }: LiquidityDashboardProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Liquidity Dashboard</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{metric.label}</p>
            <p className="mt-1 text-base font-semibold text-slate-100">{metric.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.1em] text-cyan-300">trend: {metric.trend}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
