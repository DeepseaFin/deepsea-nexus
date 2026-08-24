import type { JourneyStep } from "@/lib/journey/constants/JourneyStep";

export interface JourneyProgress {
  readonly completionPercentage: number;
  readonly completedSteps: readonly JourneyStep[];
  readonly remainingSteps: readonly JourneyStep[];
  readonly isComplete: boolean;
}