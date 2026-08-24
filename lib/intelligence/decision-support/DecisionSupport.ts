import type { RecommendationId } from "@/lib/intelligence/recommendation/RecommendationId";
import type { DecisionSupportId } from "@/lib/intelligence/decision-support/DecisionSupportId";
import type { DecisionSupportMetadata } from "@/lib/intelligence/decision-support/DecisionSupportMetadata";
import type { DecisionSupportStatus } from "@/lib/intelligence/decision-support/DecisionSupportStatus";
import type { DecisionSupportType } from "@/lib/intelligence/decision-support/DecisionSupportType";

export interface DecisionSupport {
  readonly decisionSupportId: DecisionSupportId;
  readonly title: string;
  readonly description: string;
  readonly supportType: DecisionSupportType;
  readonly status: DecisionSupportStatus;
  readonly recommendationIds: readonly RecommendationId[];
  readonly summary: string;
  readonly assumptions: readonly string[];
  readonly considerations: readonly string[];
  readonly createdAt: string;
  readonly metadata: DecisionSupportMetadata;
}