import type { ConfidenceScore } from "@/lib/business-passport/types/Confidence";

export enum EvidenceReferenceType {
  Document = "document",
  Statement = "statement",
  RegistryRecord = "registry_record",
  RelationshipNote = "relationship_note",
  Verification = "verification",
}

export interface EvidenceReference {
  readonly evidenceId: string;
  readonly referenceType: EvidenceReferenceType;
  readonly source: string;
  readonly capturedAt: string;
  readonly confidence: ConfidenceScore;
  readonly locator?: string;
  readonly checksum?: string;
}
