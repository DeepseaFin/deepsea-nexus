import type { DecisionContext } from "@/lib/intelligence/decision-context/DecisionContext";
import type { DecisionContextId } from "@/lib/intelligence/decision-context/DecisionContextId";
import type { DecisionContextStatus } from "@/lib/intelligence/decision-context/DecisionContextStatus";
import type { DecisionContextType } from "@/lib/intelligence/decision-context/DecisionContextType";

export interface DecisionContextRepository {
  findById(decisionContextId: DecisionContextId): Promise<DecisionContext | null>;
  save(decisionContext: DecisionContext): Promise<void>;
  listByType(contextType: DecisionContextType): Promise<readonly DecisionContext[]>;
  listByStatus(status: DecisionContextStatus): Promise<readonly DecisionContext[]>;
}