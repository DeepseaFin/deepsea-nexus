import type { JourneyStep } from "@/lib/journey/constants/JourneyStep";
import type { Journey } from "@/lib/journey/domain/Journey";
import type { BusinessId } from "@/lib/journey/domain/Journey";
import type { JourneyId } from "@/lib/journey/domain/Journey";
import type { JourneyRecommendation } from "@/lib/journey/domain/JourneyRecommendation";
import type { JourneyTimelineEvent } from "@/lib/journey/domain/JourneyTimelineEvent";

export interface StartJourneyInput {
  readonly journeyId: JourneyId;
  readonly businessId: BusinessId;
  readonly startedBy: string;
  readonly startedAt: string;
}

export interface JourneyService {
  startJourney(input: StartJourneyInput): Promise<Journey>;
  getJourney(journeyId: JourneyId): Promise<Journey | null>;
  moveToStep(journeyId: JourneyId, step: JourneyStep, updatedBy: string, updatedAt: string): Promise<Journey>;
  addRecommendation(journeyId: JourneyId, recommendation: JourneyRecommendation, updatedBy: string): Promise<Journey>;
  addTimelineEvent(journeyId: JourneyId, timelineEvent: JourneyTimelineEvent): Promise<Journey>;
}