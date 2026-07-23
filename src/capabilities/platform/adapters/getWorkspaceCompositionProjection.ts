import type { WorkspaceComposition } from "@/lib/platform/composition/WorkspaceComposition";
import type {
  WorkspaceCompositionProjection,
  WorkspaceCompositionSummaryMetadataProjection,
} from "@/src/capabilities/platform/projections/WorkspaceCompositionProjection";

function toSummaryMetadata(
  composition: WorkspaceComposition,
): WorkspaceCompositionSummaryMetadataProjection {
  return {
    sourceSystem: composition.metadata.sourceSystem ?? "Unknown source",
    sourceReference: composition.metadata.sourceReference ?? "Unavailable reference",
    tags: composition.metadata.tags ?? [],
    attributeCount: Object.keys(composition.metadata.attributes ?? {}).length,
  };
}

export function getWorkspaceCompositionProjection(
  composition: WorkspaceComposition,
): WorkspaceCompositionProjection {
  return {
    compositionId: composition.compositionId.toString(),
    workspaceId: composition.workspaceId.toString(),
    name: composition.name,
    description: composition.description,
    type: composition.type,
    status: composition.status,
    version: composition.version,
    summaryMetadata: toSummaryMetadata(composition),
  };
}
