export interface RelationshipInsightsInput {
  readonly passportId: string;
  readonly customerId?: string;
  readonly documentIds?: readonly string[];
  readonly requiredDocuments?: readonly {
    readonly code: string;
    readonly label: string;
    readonly matchers: readonly string[];
  }[];
}

export interface RelationshipInsightsExecutiveSummary {
  readonly headline: string;
  readonly confidenceSnapshot: string;
  readonly evidenceSnapshot: string;
  readonly riskSnapshot: string;
}

export interface RelationshipInsightItem {
  readonly code: string;
  readonly message: string;
}

export interface RelationshipInsightsReport {
  readonly generatedAt: string;
  readonly executiveSummary: RelationshipInsightsExecutiveSummary;
  readonly keyStrengths: readonly RelationshipInsightItem[];
  readonly openInformationGaps: readonly RelationshipInsightItem[];
  readonly potentialInconsistencies: readonly RelationshipInsightItem[];
  readonly requiredDocuments: readonly string[];
  readonly recommendedNextSteps: readonly string[];
}
