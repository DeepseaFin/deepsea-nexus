import type { ConfidenceBand } from "@/lib/business-passport/types/Confidence";

export type RelationshipEvidenceBusinessDomain =
  | "corporate-identity"
  | "financial-profile"
  | "trade-activity"
  | "compliance"
  | "operations";

export interface RelationshipEvidenceSupportingDocumentViewModel {
  readonly id: string;
  readonly label: string;
}

export interface RelationshipEvidenceKnowledgeViewModel {
  readonly knowledgeId: string;
  readonly factName: string;
  readonly confidence: number;
  readonly verified: boolean;
  readonly lastUpdated: string;
}

export interface RelationshipEvidenceItemViewModel {
  readonly businessFact: string;
  readonly confidence: {
    readonly score: number;
    readonly band: ConfidenceBand;
  };
  readonly supportingDocuments: readonly RelationshipEvidenceSupportingDocumentViewModel[];
  readonly relatedKnowledge: readonly RelationshipEvidenceKnowledgeViewModel[];
  readonly lastUpdated: string;
}

export interface RelationshipEvidenceDomainGroupViewModel {
  readonly key: RelationshipEvidenceBusinessDomain;
  readonly title:
    | "Corporate Identity"
    | "Financial Profile"
    | "Trade Activity"
    | "Compliance"
    | "Operations";
  readonly totalEvidenceItems: number;
  readonly evidenceItems: readonly RelationshipEvidenceItemViewModel[];
}

export interface RelationshipEvidenceExplorerViewModel {
  readonly generatedAt: string;
  readonly totalEvidenceItems: number;
  readonly domains: readonly RelationshipEvidenceDomainGroupViewModel[];
}
