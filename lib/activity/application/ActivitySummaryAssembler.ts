import { ActivitySeverity } from "@/lib/activity/ActivitySeverity";
import { ActivityType } from "@/lib/activity/ActivityType";
import type { Activity } from "@/lib/activity/Activity";
import type { ActivitySummaryMetricViewModel, ActivitySummaryViewModel } from "@/lib/activity/application/ActivityViewModel";

export interface ActivitySummaryAssembler {
  assemble(activities: readonly Activity[]): ActivitySummaryViewModel;
}

function maxOccurredAt(activities: readonly Activity[]): string | undefined {
  let current: string | undefined;
  let currentValue = Number.NEGATIVE_INFINITY;

  for (const activity of activities) {
    const parsed = Date.parse(activity.occurredAt);
    if (Number.isNaN(parsed)) {
      continue;
    }

    if (parsed > currentValue) {
      currentValue = parsed;
      current = activity.occurredAt;
    }
  }

  return current;
}

function metric(metricKey: string, label: string, value: number): ActivitySummaryMetricViewModel {
  return {
    metricKey,
    label,
    value,
  };
}

export function createActivitySummaryAssembler(): ActivitySummaryAssembler {
  return {
    assemble(activities: readonly Activity[]): ActivitySummaryViewModel {
      const severityBreakdown: Readonly<Record<ActivitySeverity, number>> = {
        [ActivitySeverity.Low]: activities.filter((activity) => activity.severity === ActivitySeverity.Low).length,
        [ActivitySeverity.Medium]: activities.filter((activity) => activity.severity === ActivitySeverity.Medium).length,
        [ActivitySeverity.High]: activities.filter((activity) => activity.severity === ActivitySeverity.High).length,
        [ActivitySeverity.Critical]: activities.filter((activity) => activity.severity === ActivitySeverity.Critical).length,
      };

      const typeBreakdown: Readonly<Record<ActivityType, number>> = {
        [ActivityType.Lifecycle]: activities.filter((activity) => activity.type === ActivityType.Lifecycle).length,
        [ActivityType.Governance]: activities.filter((activity) => activity.type === ActivityType.Governance).length,
        [ActivityType.Compliance]: activities.filter((activity) => activity.type === ActivityType.Compliance).length,
        [ActivityType.Risk]: activities.filter((activity) => activity.type === ActivityType.Risk).length,
        [ActivityType.Relationship]: activities.filter((activity) => activity.type === ActivityType.Relationship).length,
        [ActivityType.Document]: activities.filter((activity) => activity.type === ActivityType.Document).length,
        [ActivityType.Workflow]: activities.filter((activity) => activity.type === ActivityType.Workflow).length,
        [ActivityType.Intelligence]: activities.filter((activity) => activity.type === ActivityType.Intelligence).length,
        [ActivityType.System]: activities.filter((activity) => activity.type === ActivityType.System).length,
      };

      const totalActivities = activities.length;
      const acknowledgedActivities = activities.filter((activity) => activity.acknowledged).length;
      const unacknowledgedActivities = totalActivities - acknowledgedActivities;
      const criticalActivities = severityBreakdown[ActivitySeverity.Critical];
      const highActivities = severityBreakdown[ActivitySeverity.High];

      return {
        totalActivities,
        acknowledgedActivities,
        unacknowledgedActivities,
        criticalActivities,
        highActivities,
        severityBreakdown,
        typeBreakdown,
        metrics: [
          metric("totalActivities", "Total Activities", totalActivities),
          metric("acknowledgedActivities", "Acknowledged Activities", acknowledgedActivities),
          metric("unacknowledgedActivities", "Unacknowledged Activities", unacknowledgedActivities),
          metric("criticalActivities", "Critical Activities", criticalActivities),
          metric("highActivities", "High Activities", highActivities),
        ],
        lastOccurredAt: maxOccurredAt(activities),
      };
    },
  };
}
