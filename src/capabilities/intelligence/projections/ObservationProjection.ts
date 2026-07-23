export interface ObservationProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface ObservationProjection {
  readonly observationId: string;
  readonly title: string;
  readonly description: string;
  readonly type: string;
  readonly status: string;
  readonly source: string;
  readonly observedAt: string;
  readonly relatedEntityIds: readonly string[];
  readonly summaryMetadata: ObservationProjectionSummaryMetadata;
}