import type { CommercialWorkflowStep } from "@/src/capabilities/commercial/types/CommercialWorkflowState";

type CommercialHeaderProps = {
  readonly workflowId: string;
  readonly institutionName: string;
  readonly currentStep: CommercialWorkflowStep;
};

export default function CommercialHeader({ workflowId, institutionName, currentStep }: CommercialHeaderProps) {
  return (
    <header className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">ATLAS / COMMERCIAL</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-100 sm:text-2xl">Commercial Origination Workspace</h1>
          <p className="mt-1 text-sm text-slate-400">{institutionName}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Workspace</p>
            <p className="mt-1 font-semibold text-slate-200">{workflowId}</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Current Stage</p>
            <p className="mt-1 font-semibold text-cyan-200">{currentStep.title}</p>
          </div>
          <div className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1 col-span-2 sm:col-span-1">
            <p className="uppercase tracking-[0.14em] text-slate-500">Status</p>
            <p className="mt-1 font-semibold text-emerald-200">In Workspace</p>
          </div>
        </div>
      </div>
    </header>
  );
}
