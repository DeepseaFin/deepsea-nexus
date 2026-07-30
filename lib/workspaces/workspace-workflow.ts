import type {
  WorkspaceSectionDefinition,
  WorkspaceSectionStateLike,
  WorkspaceWorkflowEvaluation,
} from "@/lib/workspaces/workspace.types";

export interface EvaluateWorkspaceWorkflowInput<TSectionId extends string, TSection extends WorkspaceSectionDefinition<TSectionId>> {
  readonly sectionDefinitions: readonly TSection[];
  readonly sectionStates: readonly WorkspaceSectionStateLike<TSectionId>[];
}

export function evaluateWorkspaceWorkflow<TSectionId extends string, TSection extends WorkspaceSectionDefinition<TSectionId>>(
  input: EvaluateWorkspaceWorkflowInput<TSectionId, TSection>,
): WorkspaceWorkflowEvaluation<TSectionId> {
  const completedIds = new Set(
    input.sectionStates
      .filter((section) => section.completionStatus === "completed")
      .map((section) => section.id),
  );

  const disabledIds = new Set(
    input.sectionStates
      .filter((section) => Boolean(section.disabled))
      .map((section) => section.id),
  );

  const blockedByPrerequisites = input.sectionDefinitions
    .filter((definition) => {
      const prerequisites = definition.prerequisites ?? [];
      return prerequisites.some((prerequisite) => !completedIds.has(prerequisite));
    })
    .map((definition) => definition.id);

  const blockedSet = new Set<TSectionId>([...blockedByPrerequisites, ...disabledIds]);

  const availableSections = input.sectionDefinitions
    .filter((definition) => !blockedSet.has(definition.id))
    .map((definition) => definition.id);

  const availableSet = new Set(availableSections);

  const preferred = input.sectionDefinitions.find(
    (definition) => definition.recommended && availableSet.has(definition.id) && !completedIds.has(definition.id),
  );

  const firstIncompleteAvailable = input.sectionDefinitions.find(
    (definition) => availableSet.has(definition.id) && !completedIds.has(definition.id),
  );

  const firstAvailable = input.sectionDefinitions.find((definition) => availableSet.has(definition.id));

  return {
    availableSections,
    blockedSections: Array.from(blockedSet),
    completedSections: Array.from(completedIds),
    nextRecommendedSection: preferred?.id ?? firstIncompleteAvailable?.id ?? firstAvailable?.id ?? null,
  };
}

export function canNavigateWorkspaceSection<TSectionId extends string>(
  sectionId: TSectionId,
  workflow: WorkspaceWorkflowEvaluation<TSectionId>,
): boolean {
  return workflow.availableSections.includes(sectionId);
}
