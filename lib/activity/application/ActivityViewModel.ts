import type { ActivityActorType } from "@/lib/activity/ActivityActor";
import type { ActivitySeverity } from "@/lib/activity/ActivitySeverity";
import type { ActivityTargetType } from "@/lib/activity/ActivityTarget";
import type { ActivityType } from "@/lib/activity/ActivityType";
import type { ActivityValidationIssue } from "@/lib/activity/types";

export interface ActivityActorViewModel {
  readonly actorId: string;
  readonly actorType: ActivityActorType;
  readonly actorTypeLabel: string;
  readonly displayName: string;
  readonly institutionId?: string;
}

export interface ActivityTargetViewModel {
  readonly targetId: string;
  readonly targetType: ActivityTargetType;
  readonly targetTypeLabel: string;
  readonly targetLabel?: string;
  readonly externalRef?: string;
}

export interface ActivityItemViewModel {
  readonly activityId: string;
  readonly type: ActivityType;
  readonly typeLabel: string;
  readonly severity: ActivitySeverity;
  readonly severityLabel: string;
  readonly actor: ActivityActorViewModel;
  readonly target: ActivityTargetViewModel;
  readonly title: string;
  readonly description?: string;
  readonly module: string;
  readonly source: string;
  readonly channel?: string;
  readonly tags: readonly string[];
  readonly occurredAt: string;
  readonly acknowledged: boolean;
  readonly acknowledgedAt?: string;
  readonly acknowledgedBy?: string;
}

export interface ActivityFeedItemViewModel extends ActivityItemViewModel {
  readonly relativeOrder: number;
}

export interface ActivityTimelineEntryViewModel extends ActivityItemViewModel {
  readonly dayKey: string;
  readonly dayLabel: string;
}

export interface ActivityTimelineGroupViewModel {
  readonly dayKey: string;
  readonly dayLabel: string;
  readonly entries: readonly ActivityTimelineEntryViewModel[];
}

export interface ActivitySummaryMetricViewModel {
  readonly metricKey: string;
  readonly label: string;
  readonly value: number;
}

export interface ActivitySummaryViewModel {
  readonly totalActivities: number;
  readonly acknowledgedActivities: number;
  readonly unacknowledgedActivities: number;
  readonly criticalActivities: number;
  readonly highActivities: number;
  readonly severityBreakdown: Readonly<Record<ActivitySeverity, number>>;
  readonly typeBreakdown: Readonly<Record<ActivityType, number>>;
  readonly metrics: readonly ActivitySummaryMetricViewModel[];
  readonly lastOccurredAt?: string;
}

export interface ActivityGroupViewModel {
  readonly groupKey: string;
  readonly groupLabel: string;
  readonly total: number;
  readonly items: readonly ActivityItemViewModel[];
}

export interface ActivityViewModel {
  readonly generatedAt: string;
  readonly total: number;
  readonly activities: readonly ActivityItemViewModel[];
  readonly feed: readonly ActivityFeedItemViewModel[];
  readonly timeline: readonly ActivityTimelineGroupViewModel[];
  readonly summary: ActivitySummaryViewModel;
  readonly groups: readonly ActivityGroupViewModel[];
  readonly validationIssues: readonly ActivityValidationIssue[];
}
