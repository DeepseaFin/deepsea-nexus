export interface InsightProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface InsightProjection {
  readonly insightId: string;
  readonly title: string;
  readonly description: string;
  readonly type: string;
  readonly status: string;
  readonly confidence: number;
  readonly sourceObservationIds: readonly string[];
  readonly generatedAt: string;
  readonly summaryMetadata: InsightProjectionSummaryMetadata;
}