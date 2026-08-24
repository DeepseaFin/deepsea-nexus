import type { KnowledgeCollection } from "@/lib/knowledge/domain/KnowledgeCollection";
import type { KnowledgeExtractionConfidenceSummary, KnowledgeExtractionWarning } from "@/lib/knowledge/services/KnowledgeExtractionResult";
import type { KnowledgeValidationResult } from "@/lib/knowledge/types/KnowledgeValidationResult";

export interface KnowledgeTransformationResult {
  readonly knowledgeCollection: KnowledgeCollection;
  readonly validationResult: KnowledgeValidationResult;
  readonly warnings: readonly KnowledgeExtractionWarning[];
  readonly confidenceSummary: KnowledgeExtractionConfidenceSummary;
}
