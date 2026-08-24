import type { GovernanceProfile, GovernanceProfileField } from "@/lib/business-passport/domain/Profiles";
import type { ProfileCompletenessResult } from "@/lib/business-passport/types/ProfileCompleteness";
import { isPresent } from "@/lib/business-passport/services/profileValidationUtils";

const GOVERNANCE_COMPLETENESS_FIELDS: readonly GovernanceProfileField[] = [
  "owner",
  "custodian",
  "reviewer",
  "approvalStatus",
  "reviewFrequency",
  "lastReview",
  "policyVersion",
];

export class GovernanceProfileCompleteness {
  calculate(profile: GovernanceProfile): ProfileCompletenessResult<GovernanceProfileField> {
    const completedFields = GOVERNANCE_COMPLETENESS_FIELDS.filter((field) => isPresent(profile[field]));
    const missingFields = GOVERNANCE_COMPLETENESS_FIELDS.filter((field) => !isPresent(profile[field]));

    return {
      percentage: Math.round((completedFields.length / GOVERNANCE_COMPLETENESS_FIELDS.length) * 100),
      completedFields,
      missingFields,
      recommendations: missingFields.map((field) => `Provide ${field} to strengthen governance completeness.`),
    };
  }
}

export const governanceProfileCompleteness = new GovernanceProfileCompleteness();
