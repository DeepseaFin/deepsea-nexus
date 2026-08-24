import type { DecisionAuditRecord } from "@/lib/orchestration/audit/DecisionAuditRecord";
import type { InstitutionalDecisionPackage } from "@/lib/orchestration/decision-package/InstitutionalDecisionPackage";
import type { ExplainabilityResult } from "@/lib/orchestration/explainability/ExplainabilityResult";
import type { JourneyResult } from "@/lib/orchestration/JourneyResult";

export enum InstitutionalPipelineStatus {
  Completed = "completed",
}

export interface InstitutionalPipelineMetadata {
  readonly pipelineId: string;
  readonly pipelineVersion: string;
  readonly executedAt: string;
  readonly duration: number;
  readonly status: InstitutionalPipelineStatus;
}

export interface InstitutionalPipelineResult {
  readonly journeyResult: JourneyResult;
  readonly explainabilityResult: ExplainabilityResult;
  readonly decisionPackage: InstitutionalDecisionPackage;
  readonly decisionAuditRecord: DecisionAuditRecord;
  readonly pipelineMetadata: InstitutionalPipelineMetadata;
}
