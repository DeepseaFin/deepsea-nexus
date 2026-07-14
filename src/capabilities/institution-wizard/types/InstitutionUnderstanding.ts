import type { InstitutionConfidence } from "@/src/capabilities/institution-wizard/types/InstitutionConfidence";
import type { InstitutionRisk } from "@/src/capabilities/institution-wizard/types/InstitutionRisk";

export interface InstitutionUnderstanding {
  readonly institutionName: string;
  readonly jurisdiction: string;
  readonly legalForm: string;
  readonly businessActivity: string;
  readonly confidence: InstitutionConfidence;
  readonly supportingDocuments: readonly string[];
  readonly missingEvidence: readonly string[];
  readonly potentialRisks: readonly InstitutionRisk[];
}