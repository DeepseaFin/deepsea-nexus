import type { ValidationIssue } from "@/lib/business-passport/types/ProfileValidation";

export function isPresent(value: string | number | readonly unknown[] | object | undefined): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "object") {
    return value !== null;
  }

  return false;
}

export function buildValidationResult<TField extends string>(
  validatedAt: string,
  issues: readonly ValidationIssue<TField>[],
) {
  return {
    isValid: issues.filter((issue) => issue.severity === "error").length === 0,
    issues,
    validatedAt,
  } as const;
}
