import type { JourneyStep } from "@/lib/journey/constants/JourneyStep";
import type { JourneyProgress } from "@/lib/journey/domain/JourneyProgress";

export interface JourneyProgressCalculator {
  calculate(completedSteps: readonly JourneyStep[]): JourneyProgress;
}