import type { ConfidenceBand } from "@/lib/business-passport/types/Confidence";

export type RelationshipKnowledgeBusinessDomain =
  | "corporate"
  | "financial"
  | "trade"
  | "compliance"
  | "operations";

export interface RelationshipKnowledgeSupportingEvidenceViewModel {
  readonly evidenceId: string;
  readonly evidenceType: string;
  readonly status: string;
  readonly source: string;
}

export interface RelationshipKnowledgeDocumentViewModel {
  readonly id: string;
  readonly label: string;
}

export interface RelationshipKnowledgeItemViewModel {
  readonly knowledgeId: string;
  readonly businessConclusion: string;
  readonly supportingEvidence: readonly RelationshipKnowledgeSupportingEvidenceViewModel[];
  readonly confidence: {
    readonly score: number;
    readonly band: ConfidenceBand;
  };
  readonly relatedDocuments: readonly RelationshipKnowledgeDocumentViewModel[];
  readonly businessPassportReferences: readonly string[];
  readonly lastUpdated: string;
}

export interface RelationshipKnowledgeDomainGroupViewModel {
  readonly key: RelationshipKnowledgeBusinessDomain;
  readonly title: "Corporate" | "Financial" | "Trade" | "Compliance" | "Operations";
  readonly totalKnowledgeItems: number;
  readonly knowledgeItems: readonly RelationshipKnowledgeItemViewModel[];
}

export interface RelationshipKnowledgeExplorerViewModel {
  readonly generatedAt: string;
  readonly totalKnowledgeItems: number;
  readonly domains: readonly RelationshipKnowledgeDomainGroupViewModel[];
}
