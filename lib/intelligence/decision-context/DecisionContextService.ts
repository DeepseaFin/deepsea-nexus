import type { InsightId } from "@/lib/intelligence/insight/InsightId";
import type { DecisionContext } from "@/lib/intelligence/decision-context/DecisionContext";
import type { DecisionContextId } from "@/lib/intelligence/decision-context/DecisionContextId";
import type { DecisionContextMetadata } from "@/lib/intelligence/decision-context/DecisionContextMetadata";
import type { DecisionContextStatus } from "@/lib/intelligence/decision-context/DecisionContextStatus";
import type { DecisionContextType } from "@/lib/intelligence/decision-context/DecisionContextType";

export interface CreateDecisionContextInput {
  readonly decisionContextId: DecisionContextId;
  readonly title: string;
  readonly description: string;
  readonly contextType: DecisionContextType;
  readonly status: DecisionContextStatus;
  readonly sourceInsightIds: readonly InsightId[];
  readonly relatedEntityIds: readonly string[];
  readonly createdAt: string;
  readonly metadata: DecisionContextMetadata;
}

export interface DecisionContextService {
  create(input: CreateDecisionContextInput): Promise<DecisionContext>;
  get(decisionContextId: DecisionContextId): Promise<DecisionContext | null>;
  listByType(contextType: DecisionContextType): Promise<readonly DecisionContext[]>;
  listByStatus(status: DecisionContextStatus): Promise<readonly DecisionContext[]>;
}