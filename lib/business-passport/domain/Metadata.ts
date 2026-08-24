export interface PassportAuditMetadata {
  readonly createdAt: string;
  readonly createdBy: string;
  readonly updatedAt: string;
  readonly updatedBy: string;
}

export interface PassportLineageMetadata {
  readonly sourceSystems: readonly string[];
  readonly sourceReferences: readonly string[];
  readonly ingestedAt: string;
}

export interface PassportVersionMetadata {
  readonly aggregateVersion: number;
  readonly schemaVersion: string;
  readonly modelVersion: string;
}

export interface PassportMetadata {
  readonly audit: PassportAuditMetadata;
  readonly lineage: PassportLineageMetadata;
  readonly version: PassportVersionMetadata;
}
