import type { RiskIndicatorItem } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

type RiskIndicatorsProps = {
  readonly indicators: readonly RiskIndicatorItem[];
  readonly compact?: boolean;
};

export default function RiskIndicators({ indicators, compact = false }: RiskIndicatorsProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Risk Indicators</h2>
      <div className={compact ? "mt-3 space-y-2" : "mt-3 grid gap-2"}>
        {indicators.map((indicator) => (
          <article key={indicator.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-100">{indicator.indicator}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-cyan-300">{indicator.level}</p>
            <p className="mt-1 text-xs text-slate-400">{indicator.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
