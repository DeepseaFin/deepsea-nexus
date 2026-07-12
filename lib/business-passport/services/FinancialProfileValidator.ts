import type { FinancialProfile, FinancialProfileField } from "@/lib/business-passport/domain/Profiles";
import type { ProfileValidationResult, ValidationIssue } from "@/lib/business-passport/types/ProfileValidation";
import { buildValidationResult, isPresent } from "@/lib/business-passport/services/profileValidationUtils";

const REQUIRED_FINANCIAL_FIELDS: readonly FinancialProfileField[] = [
  "estimatedRevenue",
  "workingCapital",
  "receivables",
  "payables",
  "bankingRelationships",
];

function hasPositiveAmount(value: FinancialProfile[FinancialProfileField]): boolean {
  if (typeof value !== "object" || value === null || !("amount" in value)) {
    return false;
  }

  return typeof value.amount === "number" && value.amount >= 0;
}

export class FinancialProfileValidator {
  validate(profile: FinancialProfile, validatedAt: string): ProfileValidationResult<FinancialProfileField> {
    const issues: ValidationIssue<FinancialProfileField>[] = [];

    for (const field of REQUIRED_FINANCIAL_FIELDS) {
      if (!isPresent(profile[field])) {
        issues.push({
          field,
          code: `financial.${field}.missing`,
          message: `${field} is required for financial profile validation.`,
          severity: "error",
        });
      }
    }

    if (profile.estimatedRevenue && !hasPositiveAmount(profile.estimatedRevenue)) {
      issues.push({
        field: "estimatedRevenue",
        code: "financial.estimatedRevenue.invalid",
        message: "estimatedRevenue must have a non-negative amount.",
        severity: "error",
      });
    }

    if (profile.verifiedRevenue && !hasPositiveAmount(profile.verifiedRevenue)) {
      issues.push({
        field: "verifiedRevenue",
        code: "financial.verifiedRevenue.invalid",
        message: "verifiedRevenue must have a non-negative amount.",
        severity: "error",
      });
    }

    return buildValidationResult(validatedAt, issues);
  }
}

export const financialProfileValidator = new FinancialProfileValidator();
