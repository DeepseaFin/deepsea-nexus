import type { Journey } from "@/lib/journey/domain/Journey";

export interface JourneyValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
}

export interface JourneyValidator {
  validateForCreate(journey: Journey): JourneyValidationResult;
  validateForUpdate(journey: Journey): JourneyValidationResult;
}