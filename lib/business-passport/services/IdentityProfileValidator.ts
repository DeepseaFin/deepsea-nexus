import type { IdentityProfile, IdentityProfileField } from "@/lib/business-passport/domain/Profiles";
import type { ProfileValidationResult, ValidationIssue } from "@/lib/business-passport/types/ProfileValidation";
import { buildValidationResult, isPresent } from "@/lib/business-passport/services/profileValidationUtils";

const REQUIRED_IDENTITY_FIELDS: readonly IdentityProfileField[] = [
  "legalName",
  "registrationNumber",
  "jurisdiction",
  "country",
  "incorporationDate",
  "entityType",
];

export class IdentityProfileValidator {
  validate(profile: IdentityProfile, validatedAt: string): ProfileValidationResult<IdentityProfileField> {
    const issues: ValidationIssue<IdentityProfileField>[] = [];

    for (const field of REQUIRED_IDENTITY_FIELDS) {
      if (!isPresent(profile[field])) {
        issues.push({
          field,
          code: `identity.${field}.missing`,
          message: `${field} is required for institutional identity validation.`,
          severity: "error",
        });
      }
    }

    if (profile.website && !profile.website.includes(".")) {
      issues.push({
        field: "website",
        code: "identity.website.format",
        message: "website should use a valid domain format.",
        severity: "warning",
      });
    }

    return buildValidationResult(validatedAt, issues);
  }
}

export const identityProfileValidator = new IdentityProfileValidator();
