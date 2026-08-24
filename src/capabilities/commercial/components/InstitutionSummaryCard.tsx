import type { BusinessPassportSnapshot } from "@/src/capabilities/commercial/types/CommercialWorkflowState";

type InstitutionSummaryCardProps = {
  readonly businessPassport: BusinessPassportSnapshot;
};

export default function InstitutionSummaryCard({ businessPassport }: InstitutionSummaryCardProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Institution Summary</h2>
      <p className="mt-1 text-sm text-slate-400">Business Passport context reused for commercial origination.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Legal Name</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{businessPassport.legalName}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Jurisdiction</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{businessPassport.jurisdiction}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Business Type</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{businessPassport.businessType}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Registration Number</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{businessPassport.registrationNumber}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Risk Band</p>
          <p className="mt-1 text-sm font-medium text-amber-200">{businessPassport.riskBand}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Readiness Score</p>
          <p className="mt-1 text-sm font-medium text-emerald-200">{businessPassport.readinessScore}%</p>
        </article>
      </div>
    </section>
  );
}
