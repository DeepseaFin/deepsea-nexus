import type { JourneyStatus } from "@/lib/journey/constants/JourneyStatus";
import type { JourneyStep } from "@/lib/journey/constants/JourneyStep";
import type { JourneyRecommendation } from "@/lib/journey/domain/JourneyRecommendation";
import type { JourneyTimelineEvent } from "@/lib/journey/domain/JourneyTimelineEvent";

export type JourneyId = string;
export type BusinessId = string;

export interface Journey {
  readonly journeyId: JourneyId;
  readonly businessId: BusinessId;
  readonly currentStep: JourneyStep;
  readonly status: JourneyStatus;
  readonly startedBy: string;
  readonly startedAt: string;
  readonly lastUpdated: string;
  readonly completionPercentage: number;
  readonly completedSteps: readonly JourneyStep[];
  readonly recommendations: readonly JourneyRecommendation[];
  readonly timeline: readonly JourneyTimelineEvent[];
}