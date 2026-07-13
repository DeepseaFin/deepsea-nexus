import type { JourneyStatus } from "@/lib/journey/constants/JourneyStatus";
import type { JourneyStep } from "@/lib/journey/constants/JourneyStep";

export interface JourneyResumePoint {
  readonly step: JourneyStep;
  readonly status: JourneyStatus;
  readonly pausedAt: string;
  readonly pausedBy: string;
  readonly reason?: string;
}