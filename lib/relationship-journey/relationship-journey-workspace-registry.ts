import type { JourneyStep as JourneyStepType } from "@/lib/journey";
import { createWorkspaceRegistry, type WorkspaceRegistry } from "@/lib/workspaces/workspace-registry";
import type { WorkspaceSectionDefinition } from "@/lib/workspaces/workspace.types";

export interface RelationshipJourneyWorkspaceSectionDefinition extends WorkspaceSectionDefinition<JourneyStepType> {
  readonly journeyStep: JourneyStepType;
}

function titleFromStep(step: JourneyStepType): string {
  return step
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function createRelationshipJourneyWorkspaceRegistry(
  steps: readonly JourneyStepType[],
): WorkspaceRegistry<JourneyStepType, RelationshipJourneyWorkspaceSectionDefinition> {
  const definitions: readonly RelationshipJourneyWorkspaceSectionDefinition[] = steps.map((step, index) => ({
    id: step,
    journeyStep: step,
    title: titleFromStep(step),
    description: `${titleFromStep(step)} stage in the relationship journey.`,
    order: index + 1,
    workflowOrder: index + 1,
    enabled: true,
    navigationVisible: true,
    prerequisites: index === 0 ? [] : [steps[index - 1]],
    recommended: index === 0,
  }));

  return createWorkspaceRegistry<JourneyStepType, RelationshipJourneyWorkspaceSectionDefinition>(
    definitions,
  );
}

export function formatRelationshipJourneyStep(step: JourneyStepType): string {
  return titleFromStep(step);
}
