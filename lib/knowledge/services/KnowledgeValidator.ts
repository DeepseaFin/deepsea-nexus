import type { KnowledgeCollection } from "@/lib/knowledge/domain/KnowledgeCollection";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { KnowledgeValidationIssue, KnowledgeValidationResult } from "@/lib/knowledge/types/KnowledgeValidationResult";

function isNonEmpty(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function buildValidationResult(validatedAt: string, issues: readonly KnowledgeValidationIssue[]): KnowledgeValidationResult {
  return {
    isValid: issues.filter((issue) => issue.severity === "error").length === 0,
    issues,
    validatedAt,
  };
}

export interface KnowledgeValidator {
  validateFact(fact: KnowledgeFact, validatedAt: string): KnowledgeValidationResult;
  validateCollection(collection: KnowledgeCollection, validatedAt: string): KnowledgeValidationResult;
}

export const knowledgeValidator: KnowledgeValidator = {
  validateFact(fact: KnowledgeFact, validatedAt: string): KnowledgeValidationResult {
    const issues: KnowledgeValidationIssue[] = [];

    if (!isNonEmpty(fact.factName)) {
      issues.push({
        field: "factName",
        code: "knowledge.factName.missing",
        message: "factName is required.",
        severity: "error",
      });
    }

    if (fact.confidence < 0 || fact.confidence > 100) {
      issues.push({
        field: "confidence",
        code: "knowledge.confidence.invalid",
        message: "confidence must be between 0 and 100.",
        severity: "error",
      });
    }

    if (!isNonEmpty(fact.verificationSource)) {
      issues.push({
        field: "verificationSource",
        code: "knowledge.verificationSource.missing",
        message: "verificationSource is required.",
        severity: "error",
      });
    }

    if (!isNonEmpty(fact.metadata.createdBy)) {
      issues.push({
        field: "metadata.createdBy",
        code: "knowledge.metadata.createdBy.missing",
        message: "createdBy is required.",
        severity: "error",
      });
    }

    if (!isNonEmpty(fact.metadata.governanceVersion)) {
      issues.push({
        field: "metadata.governanceVersion",
        code: "knowledge.metadata.governanceVersion.missing",
        message: "governanceVersion is required.",
        severity: "error",
      });
    }

    if (!isNonEmpty(fact.metadata.policyVersion)) {
      issues.push({
        field: "metadata.policyVersion",
        code: "knowledge.metadata.policyVersion.missing",
        message: "policyVersion is required.",
        severity: "error",
      });
    }

    if (fact.evidenceReferences.length === 0) {
      issues.push({
        field: "evidenceReferences",
        code: "knowledge.evidenceReferences.empty",
        message: "At least one evidence reference is required.",
        severity: "warning",
      });
    }

    return buildValidationResult(validatedAt, issues);
  },

  validateCollection(collection: KnowledgeCollection, validatedAt: string): KnowledgeValidationResult {
    const issues: KnowledgeValidationIssue[] = [];

    if (collection.facts.length === 0) {
      issues.push({
        field: "facts",
        code: "knowledge.collection.empty",
        message: "Knowledge collection must contain at least one fact.",
        severity: "warning",
      });
    }

    collection.facts.forEach((fact, index) => {
      const result = knowledgeValidator.validateFact(fact, validatedAt);
      result.issues.forEach((issue) => {
        issues.push({
          field: `facts[${index}].${issue.field}`,
          code: issue.code,
          message: issue.message,
          severity: issue.severity,
        });
      });
    });

    return buildValidationResult(validatedAt, issues);
  },
};
