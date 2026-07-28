import StatCard from "@/components/ui/StatCard";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { WorkflowPresentationModel } from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowSummaryPanelProps {
  readonly presentation: WorkflowPresentationModel;
}

function toStatusVariant(
  tone: WorkflowPresentationModel["summary"]["metrics"][number]["tone"],
): "default" | "info" | "success" | "warning" | "danger" {
  if (tone === "neutral") {
    return "default";
  }

  return tone;
}

export default function WorkflowSummaryPanel({ presentation }: WorkflowSummaryPanelProps) {
  return (
    <SectionCard
      title="Summary"
      subtitle={`${presentation.summary.completionPercentLabel} complete • ${presentation.summary.openTaskPercentLabel} open tasks`}
      actions={<StatusChip label={presentation.summary.terminalLabel} variant={presentation.summary.terminalLabel === "Terminal" ? "warning" : "info"} />}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Completion"
          value={presentation.summary.completionPercentLabel}
          delta={presentation.summary.totalTasksLabel}
        />
        <StatCard
          label="Open Tasks"
          value={presentation.summary.openTaskPercentLabel}
          delta={presentation.summary.totalTasksLabel}
        />
        <StatCard
          label="Milestones"
          value={presentation.milestoneCountLabel}
          delta={presentation.summary.totalMilestonesLabel}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {presentation.summary.metrics.map((metric) => (
          <StatusChip
            key={metric.metricKey}
            label={`${metric.label}: ${metric.value}`}
            variant={toStatusVariant(metric.tone)}
          />
        ))}
      </div>
    </SectionCard>
  );
}
