import type { ReviewedField } from "@/src/capabilities/institution-wizard/state/InstitutionWizardState";
import type { OracleUploadResult } from "@/src/capabilities/institution-wizard/types/OracleUploadResult";

type OraclePlaceholderExtraction = {
  readonly documentName: string;
  readonly extractedFields: readonly {
    readonly label: string;
    readonly value: string;
    readonly confidence: number;
  }[];
};

function confidenceAverage(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round(total / values.length);
}

export class OracleWizardAdapter {
  static fromPlaceholderExtraction(extraction: OraclePlaceholderExtraction): OracleUploadResult {
    const confidenceScore = confidenceAverage(extraction.extractedFields.map((field) => field.confidence));

    return {
      fileName: extraction.documentName,
      status: "completed",
      extractedFields: extraction.extractedFields,
      confidenceScore,
      oracleReference: `oracle-placeholder-${crypto.randomUUID()}`,
      message: "Placeholder ORACLE extraction completed.",
    };
  }

  static toReviewedFields(result: OracleUploadResult): readonly ReviewedField[] {
    return result.extractedFields.map((field) => ({
      label: field.label,
      value: field.value,
    }));
  }
}