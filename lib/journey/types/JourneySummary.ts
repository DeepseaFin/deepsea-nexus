import type { JourneyStatus } from "@/lib/journey/constants/JourneyStatus";
import type { JourneyStep } from "@/lib/journey/constants/JourneyStep";
import type { BusinessId } from "@/lib/journey/domain/Journey";
import type { JourneyId } from "@/lib/journey/domain/Journey";

export interface JourneySummary {
  readonly journeyId: JourneyId;
  readonly businessId: BusinessId;
  readonly status: JourneyStatus;
  readonly currentStep: JourneyStep;
  readonly completionPercentage: number;
  readonly startedAt: string;
  readonly lastUpdated: string;
}