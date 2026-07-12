import type {
  FinancialProfile,
  FinancialProfileField,
  GovernanceProfile,
  GovernanceProfileField,
  IdentityProfile,
  IdentityProfileField,
  InstitutionProfile,
  InstitutionProfileField,
  OperationalProfile,
  OperationalProfileField,
} from "@/lib/business-passport/domain/Profiles";
import { financialProfileCompleteness } from "@/lib/business-passport/services/FinancialProfileCompleteness";
import { financialProfileValidator } from "@/lib/business-passport/services/FinancialProfileValidator";
import { governanceProfileCompleteness } from "@/lib/business-passport/services/GovernanceProfileCompleteness";
import { governanceProfileValidator } from "@/lib/business-passport/services/GovernanceProfileValidator";
import { identityProfileCompleteness } from "@/lib/business-passport/services/IdentityProfileCompleteness";
import { identityProfileValidator } from "@/lib/business-passport/services/IdentityProfileValidator";
import { institutionProfileValidator } from "@/lib/business-passport/services/InstitutionProfileValidator";
import { operationalProfileValidator } from "@/lib/business-passport/services/OperationalProfileValidator";
import type { ProfileSummary } from "@/lib/business-passport/types/ProfileSummary";
import type { ProfileValidationResult } from "@/lib/business-passport/types/ProfileValidation";

export interface BusinessPassportProfileValidationResults {
  readonly identity: ProfileValidationResult<IdentityProfileField>;
  readonly institution: ProfileValidationResult<InstitutionProfileField>;
  readonly financial: ProfileValidationResult<FinancialProfileField>;
  readonly operational: ProfileValidationResult<OperationalProfileField>;
  readonly governance: ProfileValidationResult<GovernanceProfileField>;
}

export interface BusinessPassportProfileSummaries {
  readonly identity: ProfileSummary<IdentityProfileField>;
  readonly financial: ProfileSummary<FinancialProfileField>;
  readonly governance: ProfileSummary<GovernanceProfileField>;
}

export interface BusinessPassportProfileServiceInput {
  readonly identityProfile: IdentityProfile;
  readonly institutionProfile: InstitutionProfile;
  readonly financialProfile: FinancialProfile;
  readonly operationalProfile: OperationalProfile;
  readonly governanceProfile: GovernanceProfile;
}

export interface BusinessPassportProfileService {
  validateProfiles(input: BusinessPassportProfileServiceInput, validatedAt: string): BusinessPassportProfileValidationResults;
  summarizeProfiles(input: BusinessPassportProfileServiceInput, validatedAt: string): BusinessPassportProfileSummaries;
}

export class DefaultBusinessPassportProfileService implements BusinessPassportProfileService {
  validateProfiles(
    input: BusinessPassportProfileServiceInput,
    validatedAt: string,
  ): BusinessPassportProfileValidationResults {
    return {
      identity: identityProfileValidator.validate(input.identityProfile, validatedAt),
      institution: institutionProfileValidator.validate(input.institutionProfile, validatedAt),
      financial: financialProfileValidator.validate(input.financialProfile, validatedAt),
      operational: operationalProfileValidator.validate(input.operationalProfile, validatedAt),
      governance: governanceProfileValidator.validate(input.governanceProfile, validatedAt),
    };
  }

  summarizeProfiles(input: BusinessPassportProfileServiceInput, validatedAt: string): BusinessPassportProfileSummaries {
    const validations = this.validateProfiles(input, validatedAt);

    return {
      identity: {
        validation: validations.identity,
        completeness: identityProfileCompleteness.calculate(input.identityProfile),
      },
      financial: {
        validation: validations.financial,
        completeness: financialProfileCompleteness.calculate(input.financialProfile),
      },
      governance: {
        validation: validations.governance,
        completeness: governanceProfileCompleteness.calculate(input.governanceProfile),
      },
    };
  }
}

export const businessPassportProfileService = new DefaultBusinessPassportProfileService();
