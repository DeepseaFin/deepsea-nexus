import type { ProfileCompletenessResult } from "@/lib/business-passport/types/ProfileCompleteness";
import type { ProfileValidationResult } from "@/lib/business-passport/types/ProfileValidation";

export interface ProfileSummary<TField extends string> {
  readonly validation: ProfileValidationResult<TField>;
  readonly completeness: ProfileCompletenessResult<TField>;
}
