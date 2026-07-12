export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue<TField extends string> {
  readonly field: TField;
  readonly code: string;
  readonly message: string;
  readonly severity: ValidationSeverity;
}

export interface ProfileValidationResult<TField extends string> {
  readonly isValid: boolean;
  readonly issues: readonly ValidationIssue<TField>[];
  readonly validatedAt: string;
}

export interface ValidationContext {
  readonly validatedAt: string;
}
