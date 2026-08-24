export interface InstitutionalContactSummaryMetadataProjection {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface InstitutionalContactProjection {
  readonly contactId: string;
  readonly relationshipId: string;
  readonly fullName: string;
  readonly designation: string;
  readonly email: string;
  readonly phone: string;
  readonly role: string;
  readonly status: string;
  readonly summaryMetadata: InstitutionalContactSummaryMetadataProjection;
}
