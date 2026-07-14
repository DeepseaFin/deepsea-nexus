import type { ReviewedField } from "@/src/capabilities/institution-wizard/state/InstitutionWizardState";

type ReviewStepProps = {
  reviewedFields: readonly ReviewedField[];
};

export default function ReviewStep({ reviewedFields }: ReviewStepProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Review Information</h2>
      <p className="mt-1 text-sm text-slate-400">Verify institutional details before profile preview.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {reviewedFields.map((field) => (
          <article key={field.label} className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{field.label}</p>
            <p className="mt-1 text-sm font-medium text-slate-200">{field.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}