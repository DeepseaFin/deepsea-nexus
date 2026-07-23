export interface DecisionOptionProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface DecisionOptionProjection {
  readonly decisionOptionId: string;
  readonly title: string;
  readonly description: string;
  readonly optionType: string;
  readonly status: string;
  readonly sourceDecisionContextIds: readonly string[];
  readonly assumptions: readonly string[];
  readonly createdAt: string;
  readonly summaryMetadata: DecisionOptionProjectionSummaryMetadata;
}