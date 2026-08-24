export type DecisionAuditMetadataValue = string | number | boolean;

export interface DecisionAuditMetadata {
  readonly explainabilityReference: string;
  readonly metadata: Readonly<Record<string, DecisionAuditMetadataValue>>;
}
