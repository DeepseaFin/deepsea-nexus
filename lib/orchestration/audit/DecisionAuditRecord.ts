import type { DecisionAuditActor } from "@/lib/orchestration/audit/DecisionAuditActor";
import type { DecisionAuditEventType } from "@/lib/orchestration/audit/DecisionAuditEventType";
import type { DecisionAuditMetadata } from "@/lib/orchestration/audit/DecisionAuditMetadata";

export interface DecisionAuditRecord {
  readonly auditId: string;
  readonly decisionPackageId: string;
  readonly journeyId: string;
  readonly createdAt: string;
  readonly pipelineVersion: string;
  readonly workflowVersion: string;
  readonly engineVersions: Readonly<Record<string, string>>;
  readonly actor: DecisionAuditActor;
  readonly eventType: DecisionAuditEventType;
  readonly overallConfidence: number;
  readonly recommendationIds: readonly string[];
  readonly explainabilityReference: DecisionAuditMetadata["explainabilityReference"];
  readonly metadata: DecisionAuditMetadata["metadata"];
}
