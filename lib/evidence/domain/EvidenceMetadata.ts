export interface EvidenceMetadata {
  readonly documentId: string;
  readonly documentVersion: string;
  readonly uploadedBy: string;
  readonly uploadedAt: string;
  readonly mimeType: string;
  readonly checksum: string;
  readonly sourceSystem: string;
  readonly retentionPolicy: string;
}
