import SectionCard from "@/components/ui/SectionCard";
import StatCard from "@/components/ui/StatCard";
import StatusChip from "@/components/ui/StatusChip";
import type { ActivityPresentationModel } from "@/lib/activity/presentation/ActivityPresentationModel";

export interface ActivitySummaryPanelProps {
  readonly presentation: ActivityPresentationModel;
}

function toStatusVariant(
  tone: ActivityPresentationModel["summary"]["metrics"][number]["tone"],
): "default" | "info" | "success" | "warning" | "danger" {
  if (tone === "neutral") {
    return "default";
  }

  return tone;
}

export default function ActivitySummaryPanel({ presentation }: ActivitySummaryPanelProps) {
  return (
    <SectionCard title="Summary" subtitle={presentation.summary.totalActivitiesLabel}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total" value={presentation.summary.totalActivitiesLabel} delta={presentation.totalLabel} />
        <StatCard
          label="Acknowledged"
          value={presentation.summary.acknowledgedActivitiesLabel}
          delta={presentation.summary.unacknowledgedActivitiesLabel}
        />
        <StatCard
          label="Risk Focus"
          value={presentation.summary.criticalActivitiesLabel}
          delta={presentation.summary.highActivitiesLabel}
        />
      </div>

      {presentation.summary.lastOccurredAtDisplay ? (
        <p className="mt-3 text-xs text-slate-400">Latest activity: {presentation.summary.lastOccurredAtDisplay}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {presentation.summary.metrics.map((metric) => (
          <StatusChip
            key={metric.metricKey}
            label={`${metric.label}: ${metric.valueLabel}`}
            variant={toStatusVariant(metric.tone)}
          />
        ))}
      </div>
    </SectionCard>
  );
}
