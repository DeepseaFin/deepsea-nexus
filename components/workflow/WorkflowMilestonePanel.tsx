import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { WorkflowPresentationModel } from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowMilestonePanelProps {
  readonly presentation: WorkflowPresentationModel;
}

function findMetricValue(presentation: WorkflowPresentationModel, metricKey: string): string {
  const metric = presentation.summary.metrics.find((item) => item.metricKey === metricKey);
  return metric?.value ?? "0";
}

export default function WorkflowMilestonePanel({ presentation }: WorkflowMilestonePanelProps) {
  const achieved = findMetricValue(presentation, "achievedMilestones");
  const overdue = findMetricValue(presentation, "overdueMilestones");

  return (
    <SectionCard title="Milestones" subtitle={presentation.milestoneCountLabel}>
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Achieved</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{achieved}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Overdue</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{overdue}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusChip label={presentation.summary.totalMilestonesLabel} variant="info" />
          <StatusChip label={`Completion ${presentation.summary.completionPercentLabel}`} variant="success" />
        </div>
      </div>
    </SectionCard>
  );
}
