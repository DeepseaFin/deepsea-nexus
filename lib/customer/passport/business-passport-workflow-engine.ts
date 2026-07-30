import {
  getEnabledSections,
  type BusinessPassportSectionId,
} from "@/lib/customer/passport/business-passport-section-registry";
import type { BusinessPassportWorkspaceSectionState } from "@/lib/customer/passport/business-passport-workspace-orchestrator.types";
import {
  canNavigateWorkspaceSection,
  evaluateWorkspaceWorkflow,
} from "@/lib/workspaces/workspace-workflow";

export interface BusinessPassportWorkflowEvaluation {
  readonly availableSections: readonly BusinessPassportSectionId[];
  readonly blockedSections: readonly BusinessPassportSectionId[];
  readonly completedSections: readonly BusinessPassportSectionId[];
  readonly nextRecommendedSection: BusinessPassportSectionId | null;
}

export interface EvaluateBusinessPassportWorkflowInput {
  readonly sections: readonly BusinessPassportWorkspaceSectionState[];
}

export function evaluateBusinessPassportWorkflow(
  input: EvaluateBusinessPassportWorkflowInput,
): BusinessPassportWorkflowEvaluation {
  const workflow = evaluateWorkspaceWorkflow({
    sectionDefinitions: getEnabledSections(),
    sectionStates: input.sections,
  });

  return {
    availableSections: workflow.availableSections,
    blockedSections: workflow.blockedSections,
    completedSections: workflow.completedSections,
    nextRecommendedSection: workflow.nextRecommendedSection,
  };
}

export function canNavigateToSection(
  sectionId: BusinessPassportSectionId,
  workflow: BusinessPassportWorkflowEvaluation,
): boolean {
  return canNavigateWorkspaceSection(sectionId, workflow);
}
