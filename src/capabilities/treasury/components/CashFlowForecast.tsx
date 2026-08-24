import type { CashFlowForecastItem } from "@/src/capabilities/treasury/types/TreasuryWorkspaceState";

type CashFlowForecastProps = {
  readonly items: readonly CashFlowForecastItem[];
};

export default function CashFlowForecast({ items }: CashFlowForecastProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Cash Flow Forecast</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{item.bucket}</p>
            <p className="mt-1 text-xs text-slate-400">Inflow: {item.inflow}</p>
            <p className="mt-1 text-xs text-slate-400">Outflow: {item.outflow}</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">Net: {item.netPosition}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
