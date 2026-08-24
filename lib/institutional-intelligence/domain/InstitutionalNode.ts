import type { IdentityProfile } from "@/lib/business-passport/domain/Profiles";
import type { EvidenceMetadata } from "@/lib/evidence/domain/EvidenceMetadata";
import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";

export enum InstitutionalNodeType {
  Institution = "institution",
  Identity = "identity",
  Director = "director",
  Shareholder = "shareholder",
  Licence = "licence",
  Activity = "activity",
  Document = "document",
  Evidence = "evidence",
  EvidenceReference = "evidence_reference",
  KnowledgeFact = "knowledge_fact",
}

export interface InstitutionalNodeAttributesByType {
  readonly [InstitutionalNodeType.Institution]: {
    readonly passportId: string;
    readonly status: string;
    readonly lifecycle: string;
    readonly createdAt: string;
    readonly updatedAt: string;
  };
  readonly [InstitutionalNodeType.Identity]: Pick<
    IdentityProfile,
    | "legalName"
    | "tradingName"
    | "registrationNumber"
    | "jurisdiction"
    | "country"
    | "incorporationDate"
    | "entityType"
    | "industry"
    | "website"
  >;
  readonly [InstitutionalNodeType.Director]: {
    readonly fullName: string;
    readonly source: "knowledge";
    readonly sourceFactName: string;
  };
  readonly [InstitutionalNodeType.Shareholder]: {
    readonly name: string;
    readonly source: "knowledge";
    readonly sourceFactName: string;
  };
  readonly [InstitutionalNodeType.Licence]: {
    readonly licenceValue: string;
    readonly source: "knowledge";
    readonly sourceFactName: string;
  };
  readonly [InstitutionalNodeType.Activity]: {
    readonly activityValue: string;
    readonly source: "knowledge";
    readonly sourceFactName: string;
  };
  readonly [InstitutionalNodeType.Document]: Pick<
    EvidenceMetadata,
    | "documentId"
    | "documentVersion"
    | "mimeType"
    | "uploadedAt"
    | "uploadedBy"
    | "checksum"
    | "sourceSystem"
  >;
  readonly [InstitutionalNodeType.Evidence]: {
    readonly evidenceId: string;
    readonly source: string;
    readonly status: string;
    readonly evidenceType: string;
  };
  readonly [InstitutionalNodeType.EvidenceReference]: EvidenceReference;
  readonly [InstitutionalNodeType.KnowledgeFact]: Pick<
    KnowledgeFact,
    | "factName"
    | "value"
    | "confidence"
    | "verified"
    | "verificationSource"
    | "effectiveDate"
    | "lastVerified"
    | "source"
    | "status"
    | "knowledgeType"
  > & {
    readonly knowledgeId: string;
  };
}

export type InstitutionalNode = {
  readonly [K in InstitutionalNodeType]: {
    readonly id: string;
    readonly type: K;
    readonly label: string;
    readonly attributes: InstitutionalNodeAttributesByType[K];
  };
}[InstitutionalNodeType];
