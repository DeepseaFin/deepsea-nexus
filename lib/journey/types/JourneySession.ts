import type { JourneyStep } from "@/lib/journey/constants/JourneyStep";
import type { BusinessId } from "@/lib/journey/domain/Journey";
import type { JourneyId } from "@/lib/journey/domain/Journey";

export interface JourneySession {
  readonly sessionId: string;
  readonly journeyId: JourneyId;
  readonly businessId: BusinessId;
  readonly activeStep: JourneyStep;
  readonly startedAt: string;
  readonly endedAt?: string;
  readonly actor: string;
}