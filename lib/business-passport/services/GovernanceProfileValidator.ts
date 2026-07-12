import type { GovernanceProfile, GovernanceProfileField } from "@/lib/business-passport/domain/Profiles";
import type { ProfileValidationResult, ValidationIssue } from "@/lib/business-passport/types/ProfileValidation";
import { buildValidationResult, isPresent } from "@/lib/business-passport/services/profileValidationUtils";

const REQUIRED_GOVERNANCE_FIELDS: readonly GovernanceProfileField[] = [
  "owner",
  "custodian",
  "reviewer",
  "approvalStatus",
  "reviewFrequency",
  "lastReview",
  "policyVersion",
];

export class GovernanceProfileValidator {
  validate(profile: GovernanceProfile, validatedAt: string): ProfileValidationResult<GovernanceProfileField> {
    const issues: ValidationIssue<GovernanceProfileField>[] = [];

    for (const field of REQUIRED_GOVERNANCE_FIELDS) {
      if (!isPresent(profile[field])) {
        issues.push({
          field,
          code: `governance.${field}.missing`,
          message: `${field} is required for governance profile validation.`,
          severity: "error",
        });
      }
    }

    return buildValidationResult(validatedAt, issues);
  }
}

export const governanceProfileValidator = new GovernanceProfileValidator();
