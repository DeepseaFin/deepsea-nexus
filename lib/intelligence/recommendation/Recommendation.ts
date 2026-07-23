import type { DecisionContextId } from "@/lib/intelligence/decision-context/DecisionContextId";
import type { DecisionOptionId } from "@/lib/intelligence/decision-option/DecisionOptionId";
import type { RecommendationId } from "@/lib/intelligence/recommendation/RecommendationId";
import type { RecommendationMetadata } from "@/lib/intelligence/recommendation/RecommendationMetadata";
import type { RecommendationStatus } from "@/lib/intelligence/recommendation/RecommendationStatus";
import type { RecommendationType } from "@/lib/intelligence/recommendation/RecommendationType";

export interface Recommendation {
  readonly recommendationId: RecommendationId;
  readonly title: string;
  readonly description: string;
  readonly recommendationType: RecommendationType;
  readonly status: RecommendationStatus;
  readonly sourceDecisionContextIds: readonly DecisionContextId[];
  readonly sourceDecisionOptionIds: readonly DecisionOptionId[];
  readonly rationale: string;
  readonly assumptions: readonly string[];
  readonly createdAt: string;
  readonly metadata: RecommendationMetadata;
}