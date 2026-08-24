import type { WorkspaceContext } from "@/lib/workspaces/WorkspaceContext";
import type { WorkspaceDefinition } from "@/lib/workspaces/WorkspaceDefinition";
import type { WorkspaceManifest } from "@/lib/workspaces/WorkspaceManifest";
import type { WorkspaceRevision, WorkspaceTimestamp } from "@/lib/workspaces/types";

export interface Workspace {
  readonly definition: WorkspaceDefinition;
  readonly manifest: WorkspaceManifest;
  readonly context: WorkspaceContext;
  readonly active: boolean;
  readonly deprecated: boolean;
  readonly revision: WorkspaceRevision;
  readonly createdAt: WorkspaceTimestamp;
  readonly updatedAt: WorkspaceTimestamp;
}

export interface WorkspaceInput {
  readonly definition: WorkspaceDefinition;
  readonly manifest: WorkspaceManifest;
  readonly context: WorkspaceContext;
  readonly active?: boolean;
  readonly deprecated?: boolean;
  readonly revision?: WorkspaceRevision;
  readonly createdAt?: WorkspaceTimestamp;
  readonly updatedAt?: WorkspaceTimestamp;
}

function copyNavigation(
  navigation: WorkspaceManifest["navigation"],
): WorkspaceManifest["navigation"] {
  return navigation.map((item) => ({ ...item }));
}

function copyCapabilities(
  capabilities: WorkspaceManifest["capabilities"],
): WorkspaceManifest["capabilities"] {
  return capabilities.map((capability) => ({ ...capability }));
}

function copyPanels(
  panels: WorkspaceManifest["panels"],
): WorkspaceManifest["panels"] {
  return panels.map((panel) => ({
    ...panel,
    requiredCapabilityIds: [...panel.requiredCapabilityIds],
    dependsOnPanelIds: [...panel.dependsOnPanelIds],
  }));
}

function copyDependencies(
  dependencies: WorkspaceManifest["dependencies"],
): WorkspaceManifest["dependencies"] {
  return dependencies.map((dependency) => ({ ...dependency }));
}

export function createWorkspace(input: WorkspaceInput): Workspace {
  const createdAt = input.createdAt ?? input.updatedAt ?? input.context.observedAt ?? new Date().toISOString();
  const updatedAt = input.updatedAt ?? createdAt;

  return {
    definition: {
      ...input.definition,
      tags: [...input.definition.tags],
    },
    manifest: {
      ...input.manifest,
      navigation: copyNavigation(input.manifest.navigation),
      capabilities: copyCapabilities(input.manifest.capabilities),
      panels: copyPanels(input.manifest.panels),
      dependencies: copyDependencies(input.manifest.dependencies),
    },
    context: {
      ...input.context,
    },
    active: input.active ?? true,
    deprecated: input.deprecated ?? false,
    revision: input.revision ?? 0,
    createdAt,
    updatedAt,
  };
}
