export type BusinessReadinessStatus = "ready" | "review_required" | "not_ready";

export interface BusinessReadiness {
  readonly readinessScore: number;
  readonly status: BusinessReadinessStatus;
  readonly missingEvidence: readonly string[];
  readonly confidence: number;
  readonly manualReviewItems: readonly string[];
}