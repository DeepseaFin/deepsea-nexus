import type { KnowledgeExtractionResult } from "@/lib/knowledge/services/KnowledgeExtractionResult";
import type { KnowledgeExtractionRule } from "@/lib/knowledge/services/KnowledgeExtractionRule";
import type { KnowledgeValidationIssue, KnowledgeValidationResult } from "@/lib/knowledge/types/KnowledgeValidationResult";

function buildValidationResult(validatedAt: string, issues: readonly KnowledgeValidationIssue[]): KnowledgeValidationResult {
  return {
    isValid: issues.filter((issue) => issue.severity === "error").length === 0,
    issues,
    validatedAt,
  };
}

export interface KnowledgeExtractionValidator {
  validate(
    rules: readonly KnowledgeExtractionRule[],
    result: KnowledgeExtractionResult,
    validatedAt: string,
  ): KnowledgeValidationResult;
}

export const knowledgeExtractionValidator: KnowledgeExtractionValidator = {
  validate(
    rules: readonly KnowledgeExtractionRule[],
    result: KnowledgeExtractionResult,
    validatedAt: string,
  ): KnowledgeValidationResult {
    const issues: KnowledgeValidationIssue[] = [];

    for (const rule of rules) {
      const hasFact = result.facts.some((fact) => fact.factName === rule.targetKnowledgeFact);

      if (rule.required && !hasFact) {
        issues.push({
          field: rule.sourceField,
          code: `knowledge.extraction.${rule.ruleId}.missing`,
          message: `Required extraction for ${rule.targetKnowledgeFact} is missing.`,
          severity: "error",
        });
      }
    }

    if (result.errors.length > 0) {
      result.errors.forEach((error) => {
        issues.push({
          field: error.field,
          code: `knowledge.extraction.error.${error.field}`,
          message: error.message,
          severity: "error",
        });
      });
    }

    if (result.warnings.length > 0) {
      result.warnings.forEach((warning) => {
        issues.push({
          field: warning.field,
          code: `knowledge.extraction.warning.${warning.field}`,
          message: warning.message,
          severity: "warning",
        });
      });
    }

    return buildValidationResult(validatedAt, issues);
  },
};
