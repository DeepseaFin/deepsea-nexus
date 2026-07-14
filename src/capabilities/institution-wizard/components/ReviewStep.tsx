import type { ReviewedField } from "@/src/capabilities/institution-wizard/state/InstitutionWizardState";
import type { InstitutionUnderstanding } from "@/src/capabilities/institution-wizard/types/InstitutionUnderstanding";
import InstitutionSummaryCard from "@/src/capabilities/institution-wizard/components/InstitutionSummaryCard";

type ReviewStepProps = {
  reviewedFields: readonly ReviewedField[];
  confidenceByLabel: Readonly<Record<string, number>>;
  understanding: InstitutionUnderstanding;
};

function confidenceTone(confidence: number): string {
  if (confidence >= 90) return "border-emerald-700/40 bg-emerald-950/20 text-emerald-200";
  if (confidence >= 80) return "border-cyan-700/40 bg-cyan-950/20 text-cyan-200";
  return "border-amber-700/40 bg-amber-950/20 text-amber-200";
}

export default function ReviewStep({ reviewedFields, confidenceByLabel, understanding }: ReviewStepProps) {
  return (
    <div className="space-y-2">
      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <h2 className="text-lg font-semibold text-slate-100">Review Information</h2>
        <p className="mt-1 text-sm text-slate-400">Verify ORACLE-extracted institutional details before profile preview.</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {reviewedFields.map((field) => (
            <article key={field.label} className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{field.label}</p>
                {typeof confidenceByLabel[field.label] === "number" && (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] ${confidenceTone(confidenceByLabel[field.label])}`}
                  >
                    {confidenceByLabel[field.label]}%
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-medium text-slate-200">{field.value}</p>
            </article>
          ))}
        </div>
      </section>

      <InstitutionSummaryCard understanding={understanding} />
    </div>
  );
}