export interface InstitutionMetadata {
  readonly securityClassification: string;
  readonly audience: readonly string[];
  readonly purpose: string;
  readonly scope: string;
  readonly dependencies: readonly string[];
  readonly relatedDocuments: readonly string[];
  readonly keywords: readonly string[];
  readonly reviewCycleDays: number;
}
