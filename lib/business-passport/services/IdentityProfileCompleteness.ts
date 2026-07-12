import type { IdentityProfile, IdentityProfileField } from "@/lib/business-passport/domain/Profiles";
import type { ProfileCompletenessResult } from "@/lib/business-passport/types/ProfileCompleteness";
import { isPresent } from "@/lib/business-passport/services/profileValidationUtils";

const IDENTITY_COMPLETENESS_FIELDS: readonly IdentityProfileField[] = [
  "legalName",
  "tradingName",
  "registrationNumber",
  "jurisdiction",
  "country",
  "incorporationDate",
  "entityType",
  "industry",
  "website",
];

export class IdentityProfileCompleteness {
  calculate(profile: IdentityProfile): ProfileCompletenessResult<IdentityProfileField> {
    const completedFields = IDENTITY_COMPLETENESS_FIELDS.filter((field) => isPresent(profile[field]));
    const missingFields = IDENTITY_COMPLETENESS_FIELDS.filter((field) => !isPresent(profile[field]));

    return {
      percentage: Math.round((completedFields.length / IDENTITY_COMPLETENESS_FIELDS.length) * 100),
      completedFields,
      missingFields,
      recommendations: missingFields.map((field) => `Provide ${field} to strengthen identity completeness.`),
    };
  }
}

export const identityProfileCompleteness = new IdentityProfileCompleteness();
