import type { InstitutionProfile, InstitutionProfileField } from "@/lib/business-passport/domain/Profiles";
import type { ProfileValidationResult, ValidationIssue } from "@/lib/business-passport/types/ProfileValidation";
import { buildValidationResult, isPresent } from "@/lib/business-passport/services/profileValidationUtils";

const REQUIRED_INSTITUTION_FIELDS: readonly InstitutionProfileField[] = [
  "ownershipStructure",
  "businessModel",
  "strategicClassification",
  "yearsInBusiness",
  "operatingRegions",
];

export class InstitutionProfileValidator {
  validate(profile: InstitutionProfile, validatedAt: string): ProfileValidationResult<InstitutionProfileField> {
    const issues: ValidationIssue<InstitutionProfileField>[] = [];

    for (const field of REQUIRED_INSTITUTION_FIELDS) {
      if (!isPresent(profile[field])) {
        issues.push({
          field,
          code: `institution.${field}.missing`,
          message: `${field} is required for institutional profile validation.`,
          severity: "error",
        });
      }
    }

    if (profile.yearsInBusiness !== undefined && profile.yearsInBusiness < 0) {
      issues.push({
        field: "yearsInBusiness",
        code: "institution.yearsInBusiness.invalid",
        message: "yearsInBusiness must be a non-negative number.",
        severity: "error",
      });
    }

    return buildValidationResult(validatedAt, issues);
  }
}

export const institutionProfileValidator = new InstitutionProfileValidator();
