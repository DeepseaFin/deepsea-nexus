import type { CommercialWorkflowStep, CommercialWorkflowStepId } from "@/src/capabilities/commercial/types/CommercialWorkflowState";

type CommercialSidebarProps = {
  readonly steps: readonly CommercialWorkflowStep[];
  readonly currentStepId: CommercialWorkflowStepId;
  readonly onSelect: (stepId: CommercialWorkflowStepId) => void;
};

export default function CommercialSidebar({ steps, currentStepId, onSelect }: CommercialSidebarProps) {
  return (
    <aside className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Workflow Stages</h2>
      <div className="space-y-2">
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
                "w-full rounded border px-3 py-2 text-left text-sm font-medium transition",
                isActive
                  ? "border-cyan-700/50 bg-cyan-950/30 text-cyan-100"
                  : isCompleted
                    ? "border-emerald-700/40 bg-emerald-950/20 text-emerald-200"
                    : "border-slate-700 bg-slate-950/70 text-slate-500",
              ].join(" ")}
            >
              <p className="text-[11px] uppercase tracking-[0.12em] opacity-80">Step {index + 1}</p>
              <p className="mt-1">{step.title}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
