export interface DecisionContextProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface DecisionContextProjection {
  readonly decisionContextId: string;
  readonly title: string;
  readonly description: string;
  readonly contextType: string;
  readonly status: string;
  readonly sourceInsightIds: readonly string[];
  readonly relatedEntityIds: readonly string[];
  readonly createdAt: string;
  readonly summaryMetadata: DecisionContextProjectionSummaryMetadata;
}