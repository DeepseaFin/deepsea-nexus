import {
  getEnabledSections,
  type BusinessPassportSectionId,
} from "@/lib/customer/passport/business-passport-section-registry";
import type { BusinessPassportWorkspaceSectionState } from "@/lib/customer/passport/business-passport-workspace-orchestrator.types";

export interface BusinessPassportWorkflowEvaluation {
  readonly availableSections: readonly BusinessPassportSectionId[];
  readonly blockedSections: readonly BusinessPassportSectionId[];
  readonly completedSections: readonly BusinessPassportSectionId[];
  readonly nextRecommendedSection: BusinessPassportSectionId | null;
}

export interface EvaluateBusinessPassportWorkflowInput {
  readonly sections: readonly BusinessPassportWorkspaceSectionState[];
}

function completedSet(sections: readonly BusinessPassportWorkspaceSectionState[]): ReadonlySet<BusinessPassportSectionId> {
  return new Set(
    sections
      .filter((section) => section.completionStatus === "completed")
      .map((section) => section.id),
  );
}

function blockedSectionIds(completedIds: ReadonlySet<BusinessPassportSectionId>): readonly BusinessPassportSectionId[] {
  return getEnabledSections()
    .filter((definition) => {
      const prerequisites = definition.prerequisites ?? [];
      return prerequisites.some((prerequisite) => !completedIds.has(prerequisite));
    })
    .map((definition) => definition.id);
}

function disabledSectionIds(sections: readonly BusinessPassportWorkspaceSectionState[]): readonly BusinessPassportSectionId[] {
  return sections
    .filter((section) => section.disabled)
    .map((section) => section.id);
}

function availableSectionIds(blockedIds: ReadonlySet<BusinessPassportSectionId>): readonly BusinessPassportSectionId[] {
  return getEnabledSections()
    .filter((definition) => !blockedIds.has(definition.id))
    .map((definition) => definition.id);
}

function resolveNextRecommendedSection(
  availableIds: ReadonlySet<BusinessPassportSectionId>,
  completedIds: ReadonlySet<BusinessPassportSectionId>,
): BusinessPassportSectionId | null {
  const preferred = getEnabledSections().find(
    (definition) => definition.recommended && availableIds.has(definition.id) && !completedIds.has(definition.id),
  );

  if (preferred) {
    return preferred.id;
  }

  const firstIncompleteAvailable = getEnabledSections().find(
    (definition) => availableIds.has(definition.id) && !completedIds.has(definition.id),
  );

  if (firstIncompleteAvailable) {
    return firstIncompleteAvailable.id;
  }

  const firstAvailable = getEnabledSections().find((definition) => availableIds.has(definition.id));
  return firstAvailable?.id ?? null;
}

export function evaluateBusinessPassportWorkflow(
  input: EvaluateBusinessPassportWorkflowInput,
): BusinessPassportWorkflowEvaluation {
  const completedIds = completedSet(input.sections);
  const blockedByPrerequisites = blockedSectionIds(completedIds);
  const blockedByDisabledState = disabledSectionIds(input.sections);
  const blockedSections = Array.from(new Set([...blockedByPrerequisites, ...blockedByDisabledState]));
  const blockedSet = new Set(blockedSections);
  const availableSections = availableSectionIds(blockedSet);
  const availableSet = new Set(availableSections);

  return {
    availableSections,
    blockedSections,
    completedSections: Array.from(completedIds),
    nextRecommendedSection: resolveNextRecommendedSection(availableSet, completedIds),
  };
}

export function canNavigateToSection(
  sectionId: BusinessPassportSectionId,
  workflow: BusinessPassportWorkflowEvaluation,
): boolean {
  return workflow.availableSections.includes(sectionId);
}
