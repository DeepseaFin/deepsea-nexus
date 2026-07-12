export type KnowledgeValidationSeverity = "error" | "warning";

export interface KnowledgeValidationIssue {
  readonly field: string;
  readonly code: string;
  readonly message: string;
  readonly severity: KnowledgeValidationSeverity;
}

export interface KnowledgeValidationResult {
  readonly isValid: boolean;
  readonly issues: readonly KnowledgeValidationIssue[];
  readonly validatedAt: string;
}
