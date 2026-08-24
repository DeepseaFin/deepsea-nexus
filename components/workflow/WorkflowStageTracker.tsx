import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { WorkflowPresentationModel } from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowStageTrackerProps {
  readonly presentation: WorkflowPresentationModel;
}

function toStatusVariant(
  tone: WorkflowPresentationModel["stage"]["currentStageTone"],
): "default" | "info" | "success" | "warning" | "danger" {
  if (tone === "neutral") {
    return "default";
  }

  return tone;
}

export default function WorkflowStageTracker({ presentation }: WorkflowStageTrackerProps) {
  return (
    <SectionCard title="Lifecycle" subtitle="Current progression and available transitions">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          {presentation.stage.previousStageLabel ? (
            <>
              <StatusChip label={presentation.stage.previousStageLabel} />
              <span className="text-xs text-slate-500">to</span>
            </>
          ) : null}
          <StatusChip
            label={presentation.stage.currentStageLabel}
            variant={toStatusVariant(presentation.stage.currentStageTone)}
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Next Transitions</h4>
          {presentation.stage.nextTransitions.length === 0 ? (
            <p className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-400">
              No transition options are available in the current stage.
            </p>
          ) : (
            <ul className="space-y-2">
              {presentation.stage.nextTransitions.map((transition) => (
                <li key={transition.transitionId} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  <p className="text-sm font-medium text-slate-100">{transition.toStageLabel}</p>
                  <p className="mt-1 text-xs text-slate-400">{transition.requirementSummary}</p>
                  <p className="mt-1 text-xs text-slate-500">{transition.conditionCountLabel}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
