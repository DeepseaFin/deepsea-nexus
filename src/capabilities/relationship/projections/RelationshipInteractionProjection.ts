export interface RelationshipInteractionSummaryMetadataProjection {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface RelationshipInteractionProjection {
  readonly interactionId: string;
  readonly relationshipId: string;
  readonly interactionType: string;
  readonly subject: string;
  readonly occurredAt: string;
  readonly participants: readonly string[];
  readonly status: string;
  readonly summaryMetadata: RelationshipInteractionSummaryMetadataProjection;
}
