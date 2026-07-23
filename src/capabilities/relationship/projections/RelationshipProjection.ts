export interface RelationshipProjectionSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface RelationshipProjection {
  readonly relationshipId: string;
  readonly institutionId: string;
  readonly relationshipName: string;
  readonly status: string;
  readonly stage: string;
  readonly ownerDisplayName: string;
  readonly createdDate: string;
  readonly updatedDate: string;
  readonly summaryMetadata: RelationshipProjectionSummaryMetadata;
}
