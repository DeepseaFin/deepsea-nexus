import type { IndicativePricingSnapshot } from "@/src/capabilities/commercial/types/CommercialWorkflowState";

type PricingSummaryProps = {
  readonly pricing: IndicativePricingSnapshot;
};

export default function PricingSummary({ pricing }: PricingSummaryProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Indicative Pricing</h2>
      <p className="mt-1 text-sm text-slate-400">Static indicative pricing summary. No calculations are performed.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Pricing Reference</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{pricing.pricingReference}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Indicative Margin</p>
          <p className="mt-1 text-sm font-medium text-cyan-200">{pricing.indicativeMargin}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Indicative Discount Rate</p>
          <p className="mt-1 text-sm font-medium text-cyan-200">{pricing.indicativeDiscountRate}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Fees</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{pricing.fees}</p>
        </article>
      </div>

      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
        {pricing.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </section>
  );
}
