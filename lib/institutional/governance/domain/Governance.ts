import { InstitutionClassification } from "@/lib/institutional/core/InstitutionClassification";
import type { InstitutionDocument } from "@/lib/institutional/core/InstitutionDocument";
import type { GovernanceStatus } from "@/lib/institutional/governance/constants/GovernanceStatus";

export type GovernanceId = string;

export interface Governance extends InstitutionDocument {
  readonly governanceId: GovernanceId;
  readonly status: GovernanceStatus;
  readonly classification: InstitutionClassification;
}

export const GovernanceClassification: InstitutionClassification = InstitutionClassification.Governance;
