import type { NavigationNode } from "@/lib/platform/navigation/NavigationNode";
import type {
  NavigationNodeProjection,
  NavigationNodeSummaryMetadataProjection,
} from "@/src/capabilities/platform/projections/NavigationNodeProjection";

function toSummaryMetadata(
  navigationNode: NavigationNode,
): NavigationNodeSummaryMetadataProjection {
  return {
    sourceSystem: navigationNode.metadata.sourceSystem ?? "Unknown source",
    sourceReference: navigationNode.metadata.sourceReference ?? "Unavailable reference",
    tags: navigationNode.metadata.tags ?? [],
    attributeCount: Object.keys(navigationNode.metadata.attributes ?? {}).length,
  };
}

export function getNavigationNodeProjection(
  navigationNode: NavigationNode,
): NavigationNodeProjection {
  return {
    navigationNodeId: navigationNode.navigationNodeId.toString(),
    capabilityId: navigationNode.capabilityId,
    workspaceId: navigationNode.workspaceId,
    name: navigationNode.name,
    displayName: navigationNode.displayName,
    description: navigationNode.description,
    type: navigationNode.type,
    status: navigationNode.status,
    summaryMetadata: toSummaryMetadata(navigationNode),
  };
}
