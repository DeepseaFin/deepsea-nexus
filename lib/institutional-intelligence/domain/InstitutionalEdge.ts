export enum InstitutionalEdgeType {
  HasIdentity = "has_identity",
  HasDirector = "has_director",
  HasShareholder = "has_shareholder",
  HasLicence = "has_licence",
  HasActivity = "has_activity",
  HasDocument = "has_document",
  HasEvidence = "has_evidence",
  HasEvidenceReference = "has_evidence_reference",
  HasKnowledgeFact = "has_knowledge_fact",
  SupportsKnowledgeFact = "supports_knowledge_fact",
}

export interface InstitutionalEdgeAttributesByType {
  readonly [InstitutionalEdgeType.HasIdentity]: {
    readonly source: "passport";
  };
  readonly [InstitutionalEdgeType.HasDirector]: {
    readonly source: "knowledge";
    readonly sourceFactName: string;
  };
  readonly [InstitutionalEdgeType.HasShareholder]: {
    readonly source: "knowledge";
    readonly sourceFactName: string;
  };
  readonly [InstitutionalEdgeType.HasLicence]: {
    readonly source: "knowledge";
    readonly sourceFactName: string;
  };
  readonly [InstitutionalEdgeType.HasActivity]: {
    readonly source: "knowledge";
    readonly sourceFactName: string;
  };
  readonly [InstitutionalEdgeType.HasDocument]: {
    readonly source: "evidence";
    readonly evidenceId: string;
  };
  readonly [InstitutionalEdgeType.HasEvidence]: {
    readonly source: "evidence";
  };
  readonly [InstitutionalEdgeType.HasEvidenceReference]: {
    readonly source: "evidence" | "knowledge";
  };
  readonly [InstitutionalEdgeType.HasKnowledgeFact]: {
    readonly source: "knowledge";
  };
  readonly [InstitutionalEdgeType.SupportsKnowledgeFact]: {
    readonly source: "knowledge";
  };
}

export type InstitutionalEdge = {
  readonly [K in InstitutionalEdgeType]: {
    readonly id: string;
    readonly type: K;
    readonly fromNodeId: string;
    readonly toNodeId: string;
    readonly attributes: InstitutionalEdgeAttributesByType[K];
  };
}[InstitutionalEdgeType];
