import type { Relationship } from "@/lib/relationship/Relationship";
import type {
  RelationshipProjection,
  RelationshipProjectionSummaryMetadata,
} from "@/src/capabilities/relationship/projections/RelationshipProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(relationship: Relationship): RelationshipProjectionSummaryMetadata {
  return {
    sourceSystem: relationship.metadata.sourceSystem ?? "Unknown source",
    sourceReference: relationship.metadata.sourceReference ?? "Unavailable reference",
    tags: relationship.metadata.tags ?? [],
    attributeCount: Object.keys(relationship.metadata.attributes ?? {}).length,
  };
}

export function getRelationshipProjection(relationship: Relationship): RelationshipProjection {
  return {
    relationshipId: relationship.relationshipId.toString(),
    institutionId: relationship.institutionId,
    relationshipName: relationship.relationshipName,
    status: relationship.status,
    stage: relationship.stage,
    ownerDisplayName: relationship.owner.displayName,
    createdDate: formatTimestamp(relationship.createdAt),
    updatedDate: formatTimestamp(relationship.updatedAt),
    summaryMetadata: toSummaryMetadata(relationship),
  };
}
