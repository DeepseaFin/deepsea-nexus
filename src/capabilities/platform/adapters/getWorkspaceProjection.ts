import type { Workspace } from "@/lib/platform/workspace/Workspace";
import type {
  WorkspaceProjection,
  WorkspaceSummaryMetadataProjection,
} from "@/src/capabilities/platform/projections/WorkspaceProjection";

function toSummaryMetadata(workspace: Workspace): WorkspaceSummaryMetadataProjection {
  return {
    sourceSystem: workspace.metadata.sourceSystem ?? "Unknown source",
    sourceReference: workspace.metadata.sourceReference ?? "Unavailable reference",
    tags: workspace.metadata.tags ?? [],
    attributeCount: Object.keys(workspace.metadata.attributes ?? {}).length,
  };
}

export function getWorkspaceProjection(workspace: Workspace): WorkspaceProjection {
  return {
    workspaceId: workspace.workspaceId.toString(),
    capabilityId: workspace.capabilityId,
    name: workspace.name,
    displayName: workspace.displayName,
    description: workspace.description,
    type: workspace.type,
    status: workspace.status,
    version: workspace.version,
    summaryMetadata: toSummaryMetadata(workspace),
  };
}
