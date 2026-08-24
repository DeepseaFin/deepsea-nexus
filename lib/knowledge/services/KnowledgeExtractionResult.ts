import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";

export interface KnowledgeExtractionWarning {
  readonly field: string;
  readonly message: string;
}

export interface KnowledgeExtractionError {
  readonly field: string;
  readonly message: string;
}

export interface KnowledgeExtractionConfidenceSummary {
  readonly averageConfidence: number;
  readonly extractedCount: number;
  readonly missingRequiredCount: number;
}

export interface KnowledgeExtractionResult {
  readonly facts: readonly KnowledgeFact[];
  readonly warnings: readonly KnowledgeExtractionWarning[];
  readonly errors: readonly KnowledgeExtractionError[];
  readonly confidenceSummary: KnowledgeExtractionConfidenceSummary;
}
