import type { PassportReadiness } from "@/src/capabilities/institution-wizard/types/PassportReadiness";

export interface BusinessPassportSummary {
  readonly institution: string;
  readonly identity: string;
  readonly confidence: number;
  readonly businessReadiness: PassportReadiness;
  readonly supportingDocuments: readonly string[];
  readonly missingEvidence: readonly string[];
  readonly risk: readonly string[];
  readonly nextAction: string;
}