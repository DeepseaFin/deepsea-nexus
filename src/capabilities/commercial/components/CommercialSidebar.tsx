import type { CommercialWorkflowStep, CommercialWorkflowStepId } from "@/src/capabilities/commercial/types/CommercialWorkflowState";

type CommercialSidebarProps = {
  readonly steps: readonly CommercialWorkflowStep[];
  readonly currentStepId: CommercialWorkflowStepId;
  readonly onSelect: (stepId: CommercialWorkflowStepId) => void;
};

export default function CommercialSidebar({ steps, currentStepId, onSelect }: CommercialSidebarProps) {
  return (
    <aside className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Workflow Stages</h2>
      <div className="space-y-2.5">
        {steps.map((step, index) => {
          const isActive = step.id === currentStepId;
          const isCompleted = step.status === "completed";
          const isPending = step.status === "pending";

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelect(step.id)}
              disabled={isPending}
              className={[
                "w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition",
                isActive
                  ? "border-cyan-700/60 bg-cyan-950/35 text-cyan-100 shadow-[0_0_0_1px_rgba(6,182,212,0.16)]"
                  : isCompleted
                    ? "border-emerald-700/40 bg-emerald-950/25 text-emerald-200"
                    : "border-slate-700 bg-slate-950/70 text-slate-400",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] uppercase tracking-[0.12em] opacity-80">Step {index + 1}</p>
                <span className="rounded-full border border-current/30 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]">
                  {step.status.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-1.5">{step.title}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
