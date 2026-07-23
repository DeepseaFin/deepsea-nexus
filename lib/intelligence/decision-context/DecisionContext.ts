import type { InsightId } from "@/lib/intelligence/insight/InsightId";
import type { DecisionContextId } from "@/lib/intelligence/decision-context/DecisionContextId";
import type { DecisionContextMetadata } from "@/lib/intelligence/decision-context/DecisionContextMetadata";
import type { DecisionContextStatus } from "@/lib/intelligence/decision-context/DecisionContextStatus";
import type { DecisionContextType } from "@/lib/intelligence/decision-context/DecisionContextType";

export interface DecisionContext {
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