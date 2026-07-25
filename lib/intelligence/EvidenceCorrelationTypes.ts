import type { ConfidenceBand } from "@/lib/business-passport/types/Confidence";

export interface EvidenceCorrelationInput {
  readonly passportId: string;
  readonly customerId?: string;
  readonly documentIds?: readonly string[];
  readonly factNames?: readonly string[];
}

export interface EvidenceConflictValue {
  readonly value: string;
  readonly supportingDocuments: readonly string[];
  readonly occurrences: number;
}

export interface EvidenceCorrelationFactReport {
  readonly fact: string;
  readonly supportingDocuments: readonly string[];
  readonly numberOfSources: number;
  readonly conflicts: readonly EvidenceConflictValue[];
  readonly confidenceLevel: ConfidenceBand;
  readonly confidenceScore: number;
}

export interface EvidenceCorrelationRelationshipContext {
  readonly relationshipConfidenceScore: number;
  readonly relationshipConfidenceBand: ConfidenceBand;
  readonly missingDocuments: readonly string[];
}

export interface EvidenceCorrelationReport {
  readonly generatedAt: string;
  readonly passportId: string;
  readonly facts: readonly EvidenceCorrelationFactReport[];
  readonly totalFacts: number;
  readonly conflictingFacts: number;
  readonly relationshipContext?: EvidenceCorrelationRelationshipContext;
}
