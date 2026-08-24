import type { OperationalProfile, OperationalProfileField } from "@/lib/business-passport/domain/Profiles";
import type { ProfileValidationResult, ValidationIssue } from "@/lib/business-passport/types/ProfileValidation";
import { buildValidationResult, isPresent } from "@/lib/business-passport/services/profileValidationUtils";

const REQUIRED_OPERATIONAL_FIELDS: readonly OperationalProfileField[] = [
  "employeeCount",
  "invoiceVolume",
  "averageDSO",
  "operatingCountries",
];

export class OperationalProfileValidator {
  validate(profile: OperationalProfile, validatedAt: string): ProfileValidationResult<OperationalProfileField> {
    const issues: ValidationIssue<OperationalProfileField>[] = [];

    for (const field of REQUIRED_OPERATIONAL_FIELDS) {
      if (!isPresent(profile[field])) {
        issues.push({
          field,
          code: `operational.${field}.missing`,
          message: `${field} is required for operational profile validation.`,
          severity: "error",
        });
      }
    }

    if (profile.averageDSO !== undefined && profile.averageDSO < 0) {
      issues.push({
        field: "averageDSO",
        code: "operational.averageDSO.invalid",
        message: "averageDSO must be a non-negative number.",
        severity: "error",
      });
    }

    return buildValidationResult(validatedAt, issues);
  }
}

export const operationalProfileValidator = new OperationalProfileValidator();
