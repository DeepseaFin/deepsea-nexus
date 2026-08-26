import type { JourneyStep as JourneyStepType } from "@/lib/journey";
import {
  canNavigateWorkspaceSection,
  evaluateWorkspaceWorkflow,
} from "@/lib/workspaces/workspace-workflow";
import type { WorkspaceWorkflowEvaluation } from "@/lib/workspaces/workspace.types";
import type { RelationshipJourneyWorkspaceSectionDefinition } from "@/lib/relationship-journey/relationship-journey-workspace-registry";

export interface EvaluateRelationshipJourneyWorkflowInput {
  readonly sectionDefinitions: readonly RelationshipJourneyWorkspaceSectionDefinition[];
  readonly steps: readonly JourneyStepType[];
  readonly currentStep: JourneyStepType;
  readonly completedSteps: readonly JourneyStepType[];
}

export type RelationshipJourneyWorkflowEvaluation = WorkspaceWorkflowEvaluation<JourneyStepType>;

export function evaluateRelationshipJourneyWorkflow(
  input: EvaluateRelationshipJourneyWorkflowInput,
): RelationshipJourneyWorkflowEvaluation {
  const completedSet = new Set(input.completedSteps);

  const sectionStates = input.steps.map((step) => ({
    id: step,
    completionStatus: completedSet.has(step) || step === input.currentStep
      ? "completed"
      : "not_started",
    disabled: false,
  }));

  return evaluateWorkspaceWorkflow({
    sectionDefinitions: input.sectionDefinitions,
    sectionStates,
  });
}

export function canNavigateRelationshipJourneyStep(
  step: JourneyStepType,
  workflow: RelationshipJourneyWorkflowEvaluation,
): boolean {
  return canNavigateWorkspaceSection(step, workflow);
}
