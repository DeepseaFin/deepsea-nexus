import type { CreateBusinessPassportInput } from "@/lib/business-passport/services/BusinessPassportService";
import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import type { OracleDocumentEvidenceInput } from "@/lib/evidence/services/EvidenceMapper";

export interface JourneyEvidenceInput {
  readonly oracleDocument: OracleDocumentEvidenceInput;
  readonly evidenceReferences?: readonly EvidenceReference[];
}

export interface JourneyContext {
  readonly journeyId: string;
  readonly passportInput: CreateBusinessPassportInput;
  readonly evidenceInputs: readonly JourneyEvidenceInput[];
}
