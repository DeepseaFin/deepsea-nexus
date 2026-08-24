import {
  decisionAuditBuilder,
  type DecisionAuditBuilder,
} from "@/lib/orchestration/audit/DecisionAuditBuilder";
import type { DecisionAuditRecord } from "@/lib/orchestration/audit/DecisionAuditRecord";
import type { InstitutionalDecisionPackage } from "@/lib/orchestration/decision-package/InstitutionalDecisionPackage";

export interface DecisionAuditValidationIssue {
  readonly code: string;
  readonly message: string;
}

export interface DecisionAuditValidationResult {
  readonly valid: boolean;
  readonly issues: readonly DecisionAuditValidationIssue[];
}

export interface DecisionAuditService {
  getBuilder(): DecisionAuditBuilder;
  build(decisionPackage: InstitutionalDecisionPackage): DecisionAuditRecord;
  validate(record: DecisionAuditRecord): DecisionAuditValidationResult;
}

export interface DecisionAuditServiceDependencies {
  readonly builder?: DecisionAuditBuilder;
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  const properties = Object.getOwnPropertyNames(value);

  for (const property of properties) {
    const propertyValue = (value as Record<string, unknown>)[property];

    if (propertyValue !== null && (typeof propertyValue === "object" || typeof propertyValue === "function")) {
      deepFreeze(propertyValue);
    }
  }

  return Object.freeze(value);
}

export class DefaultDecisionAuditService implements DecisionAuditService {
  private readonly builder: DecisionAuditBuilder;

  constructor(dependencies: DecisionAuditServiceDependencies = {}) {
    this.builder = dependencies.builder ?? decisionAuditBuilder;
  }

  getBuilder(): DecisionAuditBuilder {
    return this.builder;
  }

  build(decisionPackage: InstitutionalDecisionPackage): DecisionAuditRecord {
    return this.builder.build(decisionPackage);
  }

  validate(record: DecisionAuditRecord): DecisionAuditValidationResult {
    const issues: DecisionAuditValidationIssue[] = [];

    if (record.auditId.trim().length === 0) {
      issues.push({
        code: "MISSING_AUDIT_ID",
        message: "auditId must be defined.",
      });
    }

    if (record.decisionPackageId.trim().length === 0) {
      issues.push({
        code: "MISSING_DECISION_PACKAGE_ID",
        message: "decisionPackageId must be defined.",
      });
    }

    if (record.journeyId.trim().length === 0) {
      issues.push({
        code: "MISSING_JOURNEY_ID",
        message: "journeyId must be defined.",
      });
    }

    if (record.pipelineVersion.trim().length === 0) {
      issues.push({
        code: "MISSING_PIPELINE_VERSION",
        message: "pipelineVersion must be defined.",
      });
    }

    if (record.workflowVersion.trim().length === 0) {
      issues.push({
        code: "MISSING_WORKFLOW_VERSION",
        message: "workflowVersion must be defined.",
      });
    }

    if (record.recommendationIds.length === 0) {
      issues.push({
        code: "MISSING_RECOMMENDATION_IDS",
        message: "recommendationIds must include at least one recommendation id.",
      });
    }

    if (record.explainabilityReference.trim().length === 0) {
      issues.push({
        code: "MISSING_EXPLAINABILITY_REFERENCE",
        message: "explainabilityReference must be defined.",
      });
    }

    return deepFreeze({
      valid: issues.length === 0,
      issues,
    });
  }
}

export const decisionAuditService: DecisionAuditService = new DefaultDecisionAuditService();
