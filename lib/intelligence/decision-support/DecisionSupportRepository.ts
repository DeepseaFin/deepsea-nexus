import type { DecisionSupport } from "@/lib/intelligence/decision-support/DecisionSupport";
import type { DecisionSupportId } from "@/lib/intelligence/decision-support/DecisionSupportId";
import type { DecisionSupportStatus } from "@/lib/intelligence/decision-support/DecisionSupportStatus";
import type { DecisionSupportType } from "@/lib/intelligence/decision-support/DecisionSupportType";

export interface DecisionSupportRepository {
  findById(decisionSupportId: DecisionSupportId): Promise<DecisionSupport | null>;
  save(decisionSupport: DecisionSupport): Promise<void>;
  listByType(supportType: DecisionSupportType): Promise<readonly DecisionSupport[]>;
  listByStatus(status: DecisionSupportStatus): Promise<readonly DecisionSupport[]>;
}