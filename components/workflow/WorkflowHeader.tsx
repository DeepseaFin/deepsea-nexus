import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { WorkflowPresentationModel } from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowHeaderProps {
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

export default function WorkflowHeader({ presentation }: WorkflowHeaderProps) {
  return (
    <SectionCard
      title={presentation.title}
      subtitle={presentation.subtitle}
      actions={<StatusChip label={presentation.stage.currentStageLabel} variant={toStatusVariant(presentation.stage.currentStageTone)} />}
    >
      <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Workflow ID</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">{presentation.workflowId}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Revision</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">{presentation.revisionLabel}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Updated</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">{presentation.stage.updatedAtDisplay}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Generated</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">{presentation.generatedAtDisplay}</dd>
        </div>
      </dl>
    </SectionCard>
  );
}
