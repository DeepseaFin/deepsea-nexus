import type { DecisionOption } from "@/lib/intelligence/decision-option/DecisionOption";
import type { DecisionOptionId } from "@/lib/intelligence/decision-option/DecisionOptionId";
import type { DecisionOptionStatus } from "@/lib/intelligence/decision-option/DecisionOptionStatus";
import type { DecisionOptionType } from "@/lib/intelligence/decision-option/DecisionOptionType";

export interface DecisionOptionRepository {
  findById(decisionOptionId: DecisionOptionId): Promise<DecisionOption | null>;
  save(decisionOption: DecisionOption): Promise<void>;
  listByType(optionType: DecisionOptionType): Promise<readonly DecisionOption[]>;
  listByStatus(status: DecisionOptionStatus): Promise<readonly DecisionOption[]>;
}