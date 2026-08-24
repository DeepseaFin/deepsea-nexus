export type RelationshipDocumentBusinessCategory =
  | "corporate-documents"
  | "financial-documents"
  | "trade-documents"
  | "compliance-documents"
  | "legal-documents"
  | "other-documents";

export interface RelationshipDocumentExplorerEvidenceViewModel {
  readonly evidenceId: string;
  readonly evidenceType: string;
  readonly status: string;
  readonly source: string;
}

export interface RelationshipDocumentExplorerKnowledgeViewModel {
  readonly knowledgeId: string;
  readonly factName: string;
  readonly confidence: number;
  readonly verified: boolean;
  readonly effectiveDate: string;
}

export interface RelationshipDocumentExplorerDocumentViewModel {
  readonly documentId: string;
  readonly documentType: string;
  readonly processingStatus: string;
  readonly processingDate: string;
  readonly relatedEvidence: readonly RelationshipDocumentExplorerEvidenceViewModel[];
  readonly relatedKnowledge: readonly RelationshipDocumentExplorerKnowledgeViewModel[];
  readonly businessPassportReferences: readonly string[];
}

export interface RelationshipDocumentExplorerCategoryViewModel {
  readonly key: RelationshipDocumentBusinessCategory;
  readonly title:
    | "Corporate Documents"
    | "Financial Documents"
    | "Trade Documents"
    | "Compliance Documents"
    | "Legal Documents"
    | "Other Documents";
  readonly totalDocuments: number;
  readonly documents: readonly RelationshipDocumentExplorerDocumentViewModel[];
}

export interface RelationshipDocumentExplorerViewModel {
  readonly generatedAt: string;
  readonly totalDocuments: number;
  readonly categories: readonly RelationshipDocumentExplorerCategoryViewModel[];
}
