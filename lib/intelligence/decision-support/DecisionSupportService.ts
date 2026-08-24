import type { RecommendationId } from "@/lib/intelligence/recommendation/RecommendationId";
import type { DecisionSupport } from "@/lib/intelligence/decision-support/DecisionSupport";
import type { DecisionSupportId } from "@/lib/intelligence/decision-support/DecisionSupportId";
import type { DecisionSupportMetadata } from "@/lib/intelligence/decision-support/DecisionSupportMetadata";
import type { DecisionSupportStatus } from "@/lib/intelligence/decision-support/DecisionSupportStatus";
import type { DecisionSupportType } from "@/lib/intelligence/decision-support/DecisionSupportType";

export interface CreateDecisionSupportInput {
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

export interface DecisionSupportService {
  create(input: CreateDecisionSupportInput): Promise<DecisionSupport>;
  get(decisionSupportId: DecisionSupportId): Promise<DecisionSupport | null>;
  listByType(supportType: DecisionSupportType): Promise<readonly DecisionSupport[]>;
  listByStatus(status: DecisionSupportStatus): Promise<readonly DecisionSupport[]>;
}