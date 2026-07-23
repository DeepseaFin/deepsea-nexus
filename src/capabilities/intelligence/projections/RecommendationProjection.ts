export interface RecommendationProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface RecommendationProjection {
  readonly recommendationId: string;
  readonly title: string;
  readonly description: string;
  readonly recommendationType: string;
  readonly status: string;
  readonly sourceDecisionContextIds: readonly string[];
  readonly sourceDecisionOptionIds: readonly string[];
  readonly rationale: string;
  readonly assumptions: readonly string[];
  readonly createdAt: string;
  readonly summaryMetadata: RecommendationProjectionSummaryMetadata;
}