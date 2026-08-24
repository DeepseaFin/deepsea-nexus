import { InstitutionClassification } from "@/lib/institutional/core/InstitutionClassification";
import type { InstitutionDocument } from "@/lib/institutional/core/InstitutionDocument";
import type { PolicyStatus } from "@/lib/institutional/policy/constants/PolicyStatus";

export type PolicyId = string;

export interface Policy extends InstitutionDocument {
  readonly policyId: PolicyId;
  readonly status: PolicyStatus;
  readonly classification: InstitutionClassification;
}

export const PolicyClassification: InstitutionClassification = InstitutionClassification.Policy;
