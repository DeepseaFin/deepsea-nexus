export type EvidenceValidationSeverity = "error" | "warning";

export interface EvidenceValidationIssue {
  readonly field: string;
  readonly code: string;
  readonly message: string;
  readonly severity: EvidenceValidationSeverity;
}

export interface EvidenceValidationResult {
  readonly isValid: boolean;
  readonly issues: readonly EvidenceValidationIssue[];
  readonly validatedAt: string;
}
