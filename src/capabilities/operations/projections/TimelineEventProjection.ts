export interface TimelineEventProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface TimelineEventProjection {
  readonly timelineEventId: string;
  readonly operationId: string;
  readonly eventType: string;
  readonly title: string;
  readonly description: string;
  readonly actor: string;
  readonly occurredAt: string;
  readonly summaryMetadata: TimelineEventProjectionSummaryMetadata;
}