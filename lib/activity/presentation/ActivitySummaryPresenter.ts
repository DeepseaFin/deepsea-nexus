import type { ActivityViewModel } from "@/lib/activity/application/ActivityViewModel";
import type {
  ActivityPresentationFormatOptions,
  ActivitySummaryMetricPresentationModel,
  ActivitySummaryPresentationModel,
} from "@/lib/activity/presentation/ActivityPresentationModel";

export interface ActivitySummaryPresenter {
  present(viewModel: ActivityViewModel, options?: ActivityPresentationFormatOptions): ActivitySummaryPresentationModel;
}

function formatTimestamp(value: string | undefined, options?: ActivityPresentationFormatOptions): string | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Intl.DateTimeFormat(options?.locale ?? "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: options?.timeZone,
  }).format(new Date(parsed));
}

function toneForMetric(metricKey: string, value: number): "neutral" | "info" | "success" | "warning" | "danger" {
  if (metricKey === "criticalActivities" && value > 0) {
    return "danger";
  }

  if (metricKey === "highActivities" && value > 0) {
    return "warning";
  }

  if (metricKey === "acknowledgedActivities" && value > 0) {
    return "success";
  }

  if (metricKey === "unacknowledgedActivities" && value > 0) {
    return "info";
  }

  return "neutral";
}

function metric(
  metricKey: string,
  label: string,
  value: number,
): ActivitySummaryMetricPresentationModel {
  return {
    metricKey,
    label,
    value,
    valueLabel: `${value}`,
    tone: toneForMetric(metricKey, value),
  };
}

export function createActivitySummaryPresenter(): ActivitySummaryPresenter {
  return {
    present(viewModel: ActivityViewModel, options?: ActivityPresentationFormatOptions): ActivitySummaryPresentationModel {
      const summary = viewModel.summary;

      return {
        totalActivitiesLabel: `${summary.totalActivities} total activities`,
        acknowledgedActivitiesLabel: `${summary.acknowledgedActivities} acknowledged`,
        unacknowledgedActivitiesLabel: `${summary.unacknowledgedActivities} unacknowledged`,
        criticalActivitiesLabel: `${summary.criticalActivities} critical`,
        highActivitiesLabel: `${summary.highActivities} high severity`,
        lastOccurredAtIso: summary.lastOccurredAt,
        lastOccurredAtDisplay: formatTimestamp(summary.lastOccurredAt, options),
        metrics: summary.metrics.map((item) => metric(item.metricKey, item.label, item.value)),
      };
    },
  };
}
