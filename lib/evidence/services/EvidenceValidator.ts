import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { EvidenceCollection } from "@/lib/evidence/domain/EvidenceCollection";
import type { EvidenceValidationIssue, EvidenceValidationResult } from "@/lib/evidence/types/EvidenceValidationResult";

function buildValidationResult(validatedAt: string, issues: readonly EvidenceValidationIssue[]): EvidenceValidationResult {
  return {
    isValid: issues.filter((issue) => issue.severity === "error").length === 0,
    issues,
    validatedAt,
  };
}

function isNonEmpty(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export interface EvidenceValidator {
  validateEvidence(evidence: Evidence, validatedAt: string): EvidenceValidationResult;
  validateCollection(collection: EvidenceCollection, validatedAt: string): EvidenceValidationResult;
}

export const evidenceValidator: EvidenceValidator = {
  validateEvidence(evidence: Evidence, validatedAt: string): EvidenceValidationResult {
    const issues: EvidenceValidationIssue[] = [];

    if (!isNonEmpty(evidence.metadata.documentId)) {
      issues.push({
        field: "metadata.documentId",
        code: "evidence.documentId.missing",
        message: "documentId is required.",
        severity: "error",
      });
    }

    if (!isNonEmpty(evidence.metadata.documentVersion)) {
      issues.push({
        field: "metadata.documentVersion",
        code: "evidence.documentVersion.missing",
        message: "documentVersion is required.",
        severity: "error",
      });
    }

    if (!isNonEmpty(evidence.metadata.uploadedBy)) {
      issues.push({
        field: "metadata.uploadedBy",
        code: "evidence.uploadedBy.missing",
        message: "uploadedBy is required.",
        severity: "error",
      });
    }

    if (!isNonEmpty(evidence.metadata.mimeType)) {
      issues.push({
        field: "metadata.mimeType",
        code: "evidence.mimeType.missing",
        message: "mimeType is required.",
        severity: "error",
      });
    }

    if (!isNonEmpty(evidence.metadata.checksum)) {
      issues.push({
        field: "metadata.checksum",
        code: "evidence.checksum.missing",
        message: "checksum is required.",
        severity: "error",
      });
    }

    if (!isNonEmpty(evidence.metadata.sourceSystem)) {
      issues.push({
        field: "metadata.sourceSystem",
        code: "evidence.sourceSystem.missing",
        message: "sourceSystem is required.",
        severity: "error",
      });
    }

    if (!isNonEmpty(evidence.metadata.retentionPolicy)) {
      issues.push({
        field: "metadata.retentionPolicy",
        code: "evidence.retentionPolicy.missing",
        message: "retentionPolicy is required.",
        severity: "error",
      });
    }

    for (const [index, reference] of evidence.references.entries()) {
      if (reference.page <= 0) {
        issues.push({
          field: `references[${index}].page`,
          code: "evidence.reference.page.invalid",
          message: "reference page must be greater than zero.",
          severity: "error",
        });
      }

      if (!isNonEmpty(reference.section)) {
        issues.push({
          field: `references[${index}].section`,
          code: "evidence.reference.section.missing",
          message: "reference section is required.",
          severity: "error",
        });
      }

      if (!isNonEmpty(reference.fragment)) {
        issues.push({
          field: `references[${index}].fragment`,
          code: "evidence.reference.fragment.missing",
          message: "reference fragment is required.",
          severity: "error",
        });
      }

      if (reference.boundingBox && (reference.boundingBox.width <= 0 || reference.boundingBox.height <= 0)) {
        issues.push({
          field: `references[${index}].boundingBox`,
          code: "evidence.reference.boundingBox.invalid",
          message: "boundingBox dimensions must be greater than zero.",
          severity: "error",
        });
      }
    }

    return buildValidationResult(validatedAt, issues);
  },

  validateCollection(collection: EvidenceCollection, validatedAt: string): EvidenceValidationResult {
    const issues: EvidenceValidationIssue[] = [];

    if (collection.items.length === 0) {
      issues.push({
        field: "items",
        code: "evidence.collection.empty",
        message: "Evidence collection must contain at least one evidence item.",
        severity: "warning",
      });
    }

    collection.items.forEach((item, index) => {
      const result = evidenceValidator.validateEvidence(item, validatedAt);
      result.issues.forEach((issue) => {
        issues.push({
          field: `items[${index}].${issue.field}`,
          code: issue.code,
          message: issue.message,
          severity: issue.severity,
        });
      });
    });

    return buildValidationResult(validatedAt, issues);
  },
};
