import type { OpportunityDraft } from "@/src/capabilities/commercial/types/CommercialWorkflowState";

type OpportunityFormProps = {
  readonly opportunity: OpportunityDraft;
};

export default function OpportunityForm({ opportunity }: OpportunityFormProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Create Opportunity</h2>
      <p className="mt-1 text-sm text-slate-400">Static commercial opportunity draft for sprint workflow validation.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <label className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400">
          Opportunity ID
          <input value={opportunity.opportunityId} readOnly className="mt-1 w-full bg-transparent text-sm font-medium text-slate-200 outline-none" />
        </label>
        <label className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400">
          Product
          <input value={opportunity.product} readOnly className="mt-1 w-full bg-transparent text-sm font-medium text-slate-200 outline-none" />
        </label>
        <label className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400">
          Target Amount
          <input value={opportunity.targetAmount} readOnly className="mt-1 w-full bg-transparent text-sm font-medium text-slate-200 outline-none" />
        </label>
        <label className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400">
          Tenor
          <input value={opportunity.tenor} readOnly className="mt-1 w-full bg-transparent text-sm font-medium text-slate-200 outline-none" />
        </label>
        <label className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400 sm:col-span-2">
          Relationship Manager
          <input value={opportunity.relationshipManager} readOnly className="mt-1 w-full bg-transparent text-sm font-medium text-slate-200 outline-none" />
        </label>
      </div>
    </section>
  );
}
