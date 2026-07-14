export interface OracleExtractedField {
  readonly label: string;
  readonly value: string;
  readonly confidence: number;
}

export interface OracleUploadResult {
  readonly fileName: string;
  readonly status: "processing" | "completed" | "failed";
  readonly extractedFields: readonly OracleExtractedField[];
  readonly confidenceScore: number;
  readonly oracleReference: string;
  readonly message: string;
}