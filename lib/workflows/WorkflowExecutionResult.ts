import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { EvidenceCollection } from "@/lib/evidence/domain/EvidenceCollection";
import type { OracleDocumentEvidenceInput } from "@/lib/evidence/services/EvidenceMapper";
import type { Institution } from "@/lib/institution/domain/Institution";
import type { InstitutionHealth } from "@/lib/institution/health/domain/InstitutionHealth";
import type { InstitutionIntelligence } from "@/lib/institution/intelligence/domain/InstitutionIntelligence";
import type { Journey } from "@/lib/journey/domain/Journey";
import type { KnowledgeCollection } from "@/lib/knowledge/domain/KnowledgeCollection";
import type { WorkflowExecutionState } from "@/lib/workflows/WorkflowExecutionState";
import type { WorkflowRecommendation } from "@/lib/workflows/WorkflowRecommendation";
import type { WorkflowStepResult } from "@/lib/workflows/WorkflowStepResult";
import type { WorkflowSummary } from "@/lib/workflows/WorkflowSummary";
import type { WorkflowTimeline } from "@/lib/workflows/WorkflowTimeline";

export interface OracleStageResult {
  readonly input: OracleDocumentEvidenceInput;
  readonly processedAt: string;
}

export interface WorkflowStageResults {
  readonly institution?: Institution;
  readonly oracle?: OracleStageResult;
  readonly evidence?: EvidenceCollection;
  readonly knowledge?: KnowledgeCollection;
  readonly businessPassport?: BusinessPassport;
  readonly journey?: Journey;
  readonly institutionHealth?: InstitutionHealth;
  readonly institutionIntelligence?: InstitutionIntelligence;
}

export interface WorkflowExecutionResult {
  readonly workflowId: string;
  readonly executionId: string;
  readonly state: WorkflowExecutionState;
  readonly timeline: WorkflowTimeline;
  readonly stepResults: readonly WorkflowStepResult[];
  readonly stageResults: WorkflowStageResults;
  readonly recommendations: readonly WorkflowRecommendation[];
  readonly summary: WorkflowSummary;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
}
