import type { DecisionContextId } from "@/lib/intelligence/decision-context/DecisionContextId";
import type { DecisionOptionId } from "@/lib/intelligence/decision-option/DecisionOptionId";
import type { DecisionOptionMetadata } from "@/lib/intelligence/decision-option/DecisionOptionMetadata";
import type { DecisionOptionStatus } from "@/lib/intelligence/decision-option/DecisionOptionStatus";
import type { DecisionOptionType } from "@/lib/intelligence/decision-option/DecisionOptionType";

export interface DecisionOption {
  readonly decisionOptionId: DecisionOptionId;
  readonly title: string;
  readonly description: string;
  readonly optionType: DecisionOptionType;
  readonly status: DecisionOptionStatus;
  readonly sourceDecisionContextIds: readonly DecisionContextId[];
  readonly assumptions: readonly string[];
  readonly createdAt: string;
  readonly metadata: DecisionOptionMetadata;
}