import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { Institution } from "@/lib/institution/domain/Institution";
import type { InstitutionHealth } from "@/lib/institution/health/domain/InstitutionHealth";
import type { InstitutionIntelligence } from "@/lib/institution/intelligence/domain/InstitutionIntelligence";
import type { Journey } from "@/lib/journey/domain/Journey";
import type { WorkflowExecutionState } from "@/lib/workflows/WorkflowExecutionState";
import type { WorkflowStep } from "@/lib/workflows/WorkflowStep";

export interface InstitutionCommercialSummary {
  readonly opportunityId?: string;
  readonly product?: string;
  readonly indicativeAmount?: string;
  readonly indicativeTenor?: string;
  readonly stage?: string;
  readonly readyForApproval: boolean;
}

export interface InstitutionWorkflowStatus {
  readonly workflowId?: string;
  readonly executionId?: string;
  readonly runState?: WorkflowExecutionState["runState"];
  readonly currentStep?: WorkflowStep;
  readonly completedStepCount: number;
  readonly totalStepCount?: number;
  readonly lastUpdatedAt?: string;
}

export interface InstitutionContext {
  readonly contextId: string;
  readonly assembledAt: string;
  readonly institution: Institution;
  readonly passport?: BusinessPassport;
  readonly journey?: Journey;
  readonly health?: InstitutionHealth;
  readonly intelligence?: InstitutionIntelligence;
  readonly commercialSummary: InstitutionCommercialSummary;
  readonly workflowStatus: InstitutionWorkflowStatus;
}
