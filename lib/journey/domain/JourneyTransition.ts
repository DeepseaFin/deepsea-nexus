import type { JourneyStatus } from "@/lib/journey/constants/JourneyStatus";
import type { JourneyStep } from "@/lib/journey/constants/JourneyStep";

export interface JourneyTransition {
  readonly fromStep: JourneyStep;
  readonly toStep: JourneyStep;
  readonly allowedStatuses: readonly JourneyStatus[];
  readonly isBackward: boolean;
}

export interface JourneyTransitionValidation {
  readonly isValid: boolean;
  readonly reason?: string;
}