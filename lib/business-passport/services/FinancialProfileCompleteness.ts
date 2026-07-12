import type { FinancialProfile, FinancialProfileField } from "@/lib/business-passport/domain/Profiles";
import type { ProfileCompletenessResult } from "@/lib/business-passport/types/ProfileCompleteness";
import { isPresent } from "@/lib/business-passport/services/profileValidationUtils";

const FINANCIAL_COMPLETENESS_FIELDS: readonly FinancialProfileField[] = [
  "estimatedRevenue",
  "verifiedRevenue",
  "workingCapital",
  "receivables",
  "payables",
  "fundingHistory",
  "bankingRelationships",
];

export class FinancialProfileCompleteness {
  calculate(profile: FinancialProfile): ProfileCompletenessResult<FinancialProfileField> {
    const completedFields = FINANCIAL_COMPLETENESS_FIELDS.filter((field) => isPresent(profile[field]));
    const missingFields = FINANCIAL_COMPLETENESS_FIELDS.filter((field) => !isPresent(profile[field]));

    return {
      percentage: Math.round((completedFields.length / FINANCIAL_COMPLETENESS_FIELDS.length) * 100),
      completedFields,
      missingFields,
      recommendations: missingFields.map((field) => `Provide ${field} to strengthen financial completeness.`),
    };
  }
}

export const financialProfileCompleteness = new FinancialProfileCompleteness();
