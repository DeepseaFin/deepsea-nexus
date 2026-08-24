import type { Capability } from "@/lib/platform/capability/Capability";
import type { WorkspaceComposition } from "@/lib/platform/composition/WorkspaceComposition";
import type { NavigationNode } from "@/lib/platform/navigation/NavigationNode";
import type { ProjectionComposition } from "@/lib/platform/projection/ProjectionComposition";
import type { Workspace } from "@/lib/platform/workspace/Workspace";
import { getCapabilityProjection } from "@/src/capabilities/platform/adapters/getCapabilityProjection";
import { getNavigationNodeProjection } from "@/src/capabilities/platform/adapters/getNavigationNodeProjection";
import { getProjectionCompositionProjection } from "@/src/capabilities/platform/adapters/getProjectionCompositionProjection";
import { getWorkspaceCompositionProjection } from "@/src/capabilities/platform/adapters/getWorkspaceCompositionProjection";
import { getWorkspaceProjection } from "@/src/capabilities/platform/adapters/getWorkspaceProjection";
import type { PlatformWorkspaceProjection } from "@/src/capabilities/platform/projections/PlatformWorkspaceProjection";

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  const properties = Object.getOwnPropertyNames(value);

  for (const property of properties) {
    const propertyValue = (value as Record<string, unknown>)[property];

    if (propertyValue !== null && (typeof propertyValue === "object" || typeof propertyValue === "function")) {
      deepFreeze(propertyValue);
    }
  }

  return Object.freeze(value);
}

export function getPlatformWorkspaceProjection(input: {
  readonly capabilities: readonly Capability[];
  readonly workspaces: readonly Workspace[];
  readonly workspaceCompositions: readonly WorkspaceComposition[];
  readonly projectionCompositions: readonly ProjectionComposition[];
  readonly navigation: readonly NavigationNode[];
}): PlatformWorkspaceProjection {
  return deepFreeze({
    capabilities: input.capabilities.map((capability) => getCapabilityProjection(capability)),
    workspaces: input.workspaces.map((workspace) => getWorkspaceProjection(workspace)),
    workspaceCompositions: input.workspaceCompositions.map((composition) => getWorkspaceCompositionProjection(composition)),
    projectionCompositions: input.projectionCompositions.map((composition) => getProjectionCompositionProjection(composition)),
    navigation: input.navigation.map((navigationNode) => getNavigationNodeProjection(navigationNode)),
  });
}
