import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { Institution } from "@/lib/institution/domain/Institution";
import type { InstitutionHealth } from "@/lib/institution/health/domain/InstitutionHealth";
import type { InstitutionIntelligence } from "@/lib/institution/intelligence/domain/InstitutionIntelligence";
import type { Journey } from "@/lib/journey/domain/Journey";
import type { WorkflowExecutionState } from "@/lib/workflows/WorkflowExecutionState";
import type {
  InstitutionCommercialSummary,
  InstitutionContext,
  InstitutionWorkflowStatus,
} from "@/lib/workspaces/InstitutionContext";

export interface BuildInstitutionContextInput {
  readonly institution: Institution;
  readonly passport?: BusinessPassport;
  readonly journey?: Journey;
  readonly health?: InstitutionHealth;
  readonly intelligence?: InstitutionIntelligence;
  readonly commercialSummary?: Partial<InstitutionCommercialSummary>;
  readonly workflowExecutionState?: WorkflowExecutionState;
  readonly totalWorkflowSteps?: number;
  readonly assembledAt?: string;
}

export interface InstitutionContextBuilder {
  build(input: BuildInstitutionContextInput): InstitutionContext;
}

function resolveWorkflowStatus(
  executionState: WorkflowExecutionState | undefined,
  totalWorkflowSteps: number | undefined,
): InstitutionWorkflowStatus {
  const completedStepCount = executionState?.completedSteps.length ?? 0;

  return {
    workflowId: executionState?.workflowId,
    executionId: executionState?.executionId,
    runState: executionState?.runState,
    currentStep: executionState?.currentStep,
    completedStepCount,
    totalStepCount: totalWorkflowSteps,
    lastUpdatedAt: executionState?.lastEventAt ?? executionState?.completedAt ?? undefined,
  };
}

export function createInstitutionContextBuilder(): InstitutionContextBuilder {
  return {
    build(input: BuildInstitutionContextInput): InstitutionContext {
      const assembledAt = input.assembledAt ?? new Date().toISOString();
      const contextId = `ctx-${input.institution.identity.institutionId}`;

      return {
        contextId,
        assembledAt,
        institution: input.institution,
        passport: input.passport,
        journey: input.journey,
        health: input.health,
        intelligence: input.intelligence,
        commercialSummary: {
          readyForApproval: input.commercialSummary?.readyForApproval ?? false,
          opportunityId: input.commercialSummary?.opportunityId,
          product: input.commercialSummary?.product,
          indicativeAmount: input.commercialSummary?.indicativeAmount,
          indicativeTenor: input.commercialSummary?.indicativeTenor,
          stage: input.commercialSummary?.stage,
        },
        workflowStatus: resolveWorkflowStatus(
          input.workflowExecutionState,
          input.totalWorkflowSteps,
        ),
      };
    },
  };
}
