import type { ReceivableDraft } from "@/src/capabilities/commercial/types/CommercialWorkflowState";

type ReceivableDetailsFormProps = {
  readonly receivable: ReceivableDraft;
};

export default function ReceivableDetailsForm({ receivable }: ReceivableDetailsFormProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Receivable Details</h2>
      <p className="mt-1 text-sm text-slate-400">Static receivable profile details for origination handoff readiness.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <label className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400">
          Receivable Type
          <input value={receivable.receivableType} readOnly className="mt-1 w-full bg-transparent text-sm font-medium text-slate-200 outline-none" />
        </label>
        <label className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400">
          Invoice Count
          <input value={receivable.invoiceCount} readOnly className="mt-1 w-full bg-transparent text-sm font-medium text-slate-200 outline-none" />
        </label>
        <label className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400">
          Average Invoice Size
          <input value={receivable.averageInvoiceSize} readOnly className="mt-1 w-full bg-transparent text-sm font-medium text-slate-200 outline-none" />
        </label>
        <label className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400">
          Obligor Segment
          <input value={receivable.obligorSegment} readOnly className="mt-1 w-full bg-transparent text-sm font-medium text-slate-200 outline-none" />
        </label>
        <label className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400 sm:col-span-2">
          Expected Dilution
          <input value={receivable.expectedDilution} readOnly className="mt-1 w-full bg-transparent text-sm font-medium text-slate-200 outline-none" />
        </label>
      </div>
    </section>
  );
}
