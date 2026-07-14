import type { BusinessProfilePreview } from "@/src/capabilities/institution-wizard/state/InstitutionWizardState";
import type { InstitutionUnderstanding } from "@/src/capabilities/institution-wizard/types/InstitutionUnderstanding";
import InstitutionSummaryCard from "@/src/capabilities/institution-wizard/components/InstitutionSummaryCard";

type BusinessProfileStepProps = {
  profile: BusinessProfilePreview;
  understanding: InstitutionUnderstanding;
};

export default function BusinessProfileStep({ profile, understanding }: BusinessProfileStepProps) {
  return (
    <div className="space-y-2">
      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <h2 className="text-lg font-semibold text-slate-100">Business Profile Preview</h2>
        <p className="mt-1 text-sm text-slate-400">Preview the institution profile before relationship activation.</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Legal Name</p>
            <p className="mt-1 text-sm font-medium text-slate-200">{profile.legalName}</p>
          </article>
          <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Jurisdiction</p>
            <p className="mt-1 text-sm font-medium text-slate-200">{profile.jurisdiction}</p>
          </article>
          <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Business Type</p>
            <p className="mt-1 text-sm font-medium text-slate-200">{profile.businessType}</p>
          </article>
          <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Registration Number</p>
            <p className="mt-1 text-sm font-medium text-slate-200">{profile.registrationNumber}</p>
          </article>
          <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 sm:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Established On</p>
            <p className="mt-1 text-sm font-medium text-slate-200">{profile.establishedOn}</p>
          </article>
        </div>
      </section>

      <InstitutionSummaryCard understanding={understanding} />
    </div>
  );
}