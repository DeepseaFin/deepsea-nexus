import type { RelationshipInteraction } from "@/lib/relationship/interaction/RelationshipInteraction";
import type {
  RelationshipInteractionProjection,
  RelationshipInteractionSummaryMetadataProjection,
} from "@/src/capabilities/relationship/projections/RelationshipInteractionProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(interaction: RelationshipInteraction): RelationshipInteractionSummaryMetadataProjection {
  return {
    sourceSystem: interaction.metadata.sourceSystem ?? "Unknown source",
    sourceReference: interaction.metadata.sourceReference ?? "Unavailable reference",
    tags: interaction.metadata.tags ?? [],
    attributeCount: Object.keys(interaction.metadata.attributes ?? {}).length,
  };
}

export function getRelationshipInteractionProjection(
  interaction: RelationshipInteraction,
): RelationshipInteractionProjection {
  return {
    interactionId: interaction.interactionId.toString(),
    relationshipId: interaction.relationshipId.toString(),
    interactionType: interaction.interactionType,
    subject: interaction.subject,
    occurredAt: formatTimestamp(interaction.occurredAt),
    participants: interaction.participants,
    status: interaction.status,
    summaryMetadata: toSummaryMetadata(interaction),
  };
}
