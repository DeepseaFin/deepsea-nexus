export interface ActivityPresentationFormatOptions {
  readonly locale?: string;
  readonly timeZone?: string;
}

export interface ActivityPresentationActorModel {
  readonly actorId: string;
  readonly actorTypeLabel: string;
  readonly displayName: string;
  readonly institutionId?: string;
}

export interface ActivityPresentationTargetModel {
  readonly targetId: string;
  readonly targetTypeLabel: string;
  readonly targetLabel: string;
  readonly externalRef?: string;
}

export interface ActivityFeedPresentationModel {
  readonly activityId: string;
  readonly typeLabel: string;
  readonly severityLabel: string;
  readonly severityTone: "neutral" | "info" | "success" | "warning" | "danger";
  readonly actor: ActivityPresentationActorModel;
  readonly target: ActivityPresentationTargetModel;
  readonly title: string;
  readonly description?: string;
  readonly moduleLabel: string;
  readonly sourceLabel: string;
  readonly channelLabel?: string;
  readonly tags: readonly string[];
  readonly occurredAtIso: string;
  readonly occurredAtDisplay: string;
  readonly acknowledgedLabel: string;
  readonly relativeOrder: number;
}

export interface ActivitySummaryMetricPresentationModel {
  readonly metricKey: string;
  readonly label: string;
  readonly value: number;
  readonly valueLabel: string;
  readonly tone: "neutral" | "info" | "success" | "warning" | "danger";
}

export interface ActivitySummaryPresentationModel {
  readonly totalActivitiesLabel: string;
  readonly acknowledgedActivitiesLabel: string;
  readonly unacknowledgedActivitiesLabel: string;
  readonly criticalActivitiesLabel: string;
  readonly highActivitiesLabel: string;
  readonly lastOccurredAtIso?: string;
  readonly lastOccurredAtDisplay?: string;
  readonly metrics: readonly ActivitySummaryMetricPresentationModel[];
}

export interface ActivityTimelineEntryPresentationModel {
  readonly activityId: string;
  readonly title: string;
  readonly description?: string;
  readonly typeLabel: string;
  readonly severityLabel: string;
  readonly severityTone: "neutral" | "info" | "success" | "warning" | "danger";
  readonly actorLabel: string;
  readonly targetLabel: string;
  readonly occurredAtIso: string;
  readonly occurredAtDisplay: string;
  readonly moduleLabel: string;
  readonly sourceLabel: string;
}

export interface ActivityTimelineGroupPresentationModel {
  readonly dayKey: string;
  readonly dayLabel: string;
  readonly countLabel: string;
  readonly entries: readonly ActivityTimelineEntryPresentationModel[];
}

export interface ActivityFilterOptionPresentationModel {
  readonly value: string;
  readonly label: string;
  readonly count: number;
}

export interface ActivityFilterCollectionPresentationModel {
  readonly types: readonly ActivityFilterOptionPresentationModel[];
  readonly severities: readonly ActivityFilterOptionPresentationModel[];
  readonly modules: readonly ActivityFilterOptionPresentationModel[];
  readonly sources: readonly ActivityFilterOptionPresentationModel[];
  readonly acknowledgement: readonly ActivityFilterOptionPresentationModel[];
}

export interface ActivityGroupPresentationModel {
  readonly groupKey: string;
  readonly groupLabel: string;
  readonly countLabel: string;
  readonly items: readonly ActivityFeedPresentationModel[];
}

export interface ActivityFilterPresentationModel {
  readonly options: ActivityFilterCollectionPresentationModel;
  readonly groups: readonly ActivityGroupPresentationModel[];
}

export interface ActivityPresentationModel {
  readonly generatedAtIso: string;
  readonly generatedAtDisplay: string;
  readonly totalLabel: string;
  readonly feed: readonly ActivityFeedPresentationModel[];
  readonly summary: ActivitySummaryPresentationModel;
  readonly timeline: readonly ActivityTimelineGroupPresentationModel[];
  readonly filters: ActivityFilterPresentationModel;
  readonly validationWarnings: readonly string[];
}
