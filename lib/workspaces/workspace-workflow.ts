import type {
  WorkspaceSectionDefinition,
  WorkspaceSectionStateLike,
  WorkspaceWorkflowEvaluation,
} from "@/lib/workspaces/workspace.types";
import {
  getWorkspaceEventBus,
  nowWorkspaceEventTimestamp,
  resolveWorkspaceId,
  WORKSPACE_EVENT_TYPES,
  type WorkspaceEventBus,
} from "@/lib/workspaces/workspace-event-bus";

export interface EvaluateWorkspaceWorkflowInput<TSectionId extends string, TSection extends WorkspaceSectionDefinition<TSectionId>> {
  readonly sectionDefinitions: readonly TSection[];
  readonly sectionStates: readonly WorkspaceSectionStateLike<TSectionId>[];
  readonly workspaceId?: string;
  readonly eventBus?: WorkspaceEventBus;
}

const lastWorkflowSignatureByWorkspace = new Map<string, string>();
const lastCompletionSignatureByWorkspace = new Map<string, string>();

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

  const workflow: WorkspaceWorkflowEvaluation<TSectionId> = {
    availableSections,
    blockedSections: Array.from(blockedSet),
    completedSections: Array.from(completedIds),
    nextRecommendedSection: preferred?.id ?? firstIncompleteAvailable?.id ?? firstAvailable?.id ?? null,
  };

  const inferredWorkspaceId = input.sectionDefinitions.map((definition) => definition.id).join("|");
  const workspaceId = resolveWorkspaceId(input.workspaceId, inferredWorkspaceId || "workspace");
  const eventBus = input.eventBus ?? getWorkspaceEventBus();
  const totalCount = input.sectionDefinitions.length;
  const completedCount = workflow.completedSections.length;
  const completionPercentage = totalCount <= 0 ? 0 : Math.max(0, Math.min(100, Math.round((completedCount / totalCount) * 100)));
  const completionStatus = completionPercentage <= 0
    ? "not_started"
    : completionPercentage >= 100
      ? "completed"
      : "in_progress";

  const workflowPayload = {
    availableSectionIds: workflow.availableSections,
    blockedSectionIds: workflow.blockedSections,
    completedSectionIds: workflow.completedSections,
    nextRecommendedSectionId: workflow.nextRecommendedSection,
  };
  const workflowSignature = JSON.stringify(workflowPayload);
  if (lastWorkflowSignatureByWorkspace.get(workspaceId) !== workflowSignature) {
    eventBus.publish({
      type: WORKSPACE_EVENT_TYPES.WorkflowChanged,
      workspaceId,
      occurredAt: nowWorkspaceEventTimestamp(),
      payload: workflowPayload,
    });
    lastWorkflowSignatureByWorkspace.set(workspaceId, workflowSignature);
  }

  const completionPayload = {
    completedCount,
    totalCount,
    completionPercentage,
    completionStatus,
    completedSectionIds: workflow.completedSections,
  };
  const completionSignature = JSON.stringify(completionPayload);
  if (lastCompletionSignatureByWorkspace.get(workspaceId) !== completionSignature) {
    eventBus.publish({
      type: WORKSPACE_EVENT_TYPES.CompletionChanged,
      workspaceId,
      occurredAt: nowWorkspaceEventTimestamp(),
      payload: completionPayload,
    });
    lastCompletionSignatureByWorkspace.set(workspaceId, completionSignature);
  }

  return workflow;
}

export function canNavigateWorkspaceSection<TSectionId extends string>(
  sectionId: TSectionId,
  workflow: WorkspaceWorkflowEvaluation<TSectionId>,
): boolean {
  return workflow.availableSections.includes(sectionId);
}
