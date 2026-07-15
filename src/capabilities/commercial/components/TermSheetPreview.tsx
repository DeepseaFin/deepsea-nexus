import type { TermSheetSnapshot } from "@/src/capabilities/commercial/types/CommercialWorkflowState";

type TermSheetPreviewProps = {
  readonly termSheet: TermSheetSnapshot;
};

export default function TermSheetPreview({ termSheet }: TermSheetPreviewProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Term Sheet Preview</h2>
      <p className="mt-1 text-sm text-slate-400">Institutional preview of static commercial terms prior to approval routing.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Version</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{termSheet.version}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Governing Law</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{termSheet.governingLaw}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Facility Type</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{termSheet.facilityType}</p>
        </article>
      </div>

      <div className="mt-3 space-y-2">
        {termSheet.conditions.map((condition) => (
          <p key={condition} className="rounded border border-emerald-700/30 bg-emerald-950/20 px-3 py-2 text-sm text-emerald-100">
            {condition}
          </p>
        ))}
      </div>
    </section>
  );
}
