export type RelationshipReadinessStatus = "ready" | "needs_attention" | "not_ready";

export interface RelationshipReadinessInput {
  readonly passportId: string;
  readonly customerId?: string;
  readonly documentIds?: readonly string[];
  readonly requiredDocuments?: readonly {
    readonly code: string;
    readonly label: string;
    readonly matchers: readonly string[];
  }[];
  readonly minimumOverallConfidence?: number;
  readonly minimumEvidenceValidityRatio?: number;
}

export interface ReadinessRequirementResult {
  readonly requirement: string;
  readonly isCompleted: boolean;
  readonly details: string;
}

export interface RelationshipReadinessReport {
  readonly generatedAt: string;
  readonly overallReadinessStatus: RelationshipReadinessStatus;
  readonly completedRequirements: readonly ReadinessRequirementResult[];
  readonly outstandingRequirements: readonly ReadinessRequirementResult[];
  readonly missingDocuments: readonly string[];
  readonly blockingIssues: readonly string[];
  readonly recommendedNextSteps: readonly string[];
}
