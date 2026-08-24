import type { JourneyStatus } from "@/lib/journey/constants/JourneyStatus";
import type { JourneyStep } from "@/lib/journey/constants/JourneyStep";
import type { BusinessId } from "@/lib/journey/domain/Journey";
import type { JourneyId } from "@/lib/journey/domain/Journey";
import type { JourneyResumePoint } from "@/lib/journey/types/JourneyResumePoint";

export interface JourneyState {
  readonly journeyId: JourneyId;
  readonly businessId: BusinessId;
  readonly status: JourneyStatus;
  readonly currentStep: JourneyStep;
  readonly completedSteps: readonly JourneyStep[];
  readonly startedAt: string;
  readonly lastUpdated: string;
  readonly pausedAt?: string;
  readonly resumedAt?: string;
  readonly resumePoint?: JourneyResumePoint;
}