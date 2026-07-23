export interface DecisionSupportProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface DecisionSupportProjection {
  readonly decisionSupportId: string;
  readonly title: string;
  readonly description: string;
  readonly supportType: string;
  readonly status: string;
  readonly recommendationIds: readonly string[];
  readonly summary: string;
  readonly assumptions: readonly string[];
  readonly considerations: readonly string[];
  readonly createdAt: string;
  readonly summaryMetadata: DecisionSupportProjectionSummaryMetadata;
}