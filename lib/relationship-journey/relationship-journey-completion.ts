import type { JourneyProgress, JourneyStep as JourneyStepType } from "@/lib/journey";
import { ratioToWorkspacePercentage } from "@/lib/workspaces/workspace-completion";

export function resolveRelationshipJourneyCompletion(
  steps: readonly JourneyStepType[],
  completedSteps: readonly JourneyStepType[],
  remainingSteps: readonly JourneyStepType[],
): JourneyProgress {
  return {
    completionPercentage: ratioToWorkspacePercentage(completedSteps.length, steps.length),
    completedSteps,
    remainingSteps,
    isComplete: remainingSteps.length === 0,
  };
}
