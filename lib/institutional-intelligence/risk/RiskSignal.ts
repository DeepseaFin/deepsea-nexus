import type { InstitutionHealthDimensionType } from "@/lib/institutional-intelligence/health/InstitutionHealthDimension";
import type { RiskSeverity } from "@/lib/institutional-intelligence/risk/RiskSeverity";
import type { RiskSignalType } from "@/lib/institutional-intelligence/risk/RiskSignalType";

export interface RiskSignal {
  readonly id: string;
  readonly type: RiskSignalType;
  readonly title: string;
  readonly description: string;
  readonly severity: RiskSeverity;
  readonly supportingHealthDimensions: readonly InstitutionHealthDimensionType[];
  readonly confidence: number;
}
