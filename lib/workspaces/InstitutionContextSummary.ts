import type { InstitutionContext } from "@/lib/workspaces/InstitutionContext";

export interface InstitutionContextSummary {
  readonly contextId: string;
  readonly institutionId: string;
  readonly institutionName: string;
  readonly jurisdiction: string;
  readonly passportStatus?: string;
  readonly journeyStatus?: string;
  readonly healthStatus?: string;
  readonly intelligenceRating?: string;
  readonly commercialStage?: string;
  readonly readyForApproval: boolean;
  readonly workflowProgress: string;
  readonly assembledAt: string;
}

export interface InstitutionContextSummaryBuilder {
  build(context: InstitutionContext): InstitutionContextSummary;
}

export function createInstitutionContextSummaryBuilder(): InstitutionContextSummaryBuilder {
  return {
    build(context: InstitutionContext): InstitutionContextSummary {
      const totalSteps = context.workflowStatus.totalStepCount;
      const completedSteps = context.workflowStatus.completedStepCount;
      const workflowProgress = typeof totalSteps === "number" && totalSteps > 0
        ? `${completedSteps}/${totalSteps}`
        : `${completedSteps}`;

      return {
        contextId: context.contextId,
        institutionId: context.institution.identity.institutionId,
        institutionName: context.institution.identity.legalName,
        jurisdiction: context.institution.identity.jurisdiction,
        passportStatus: context.passport?.status,
        journeyStatus: context.journey?.status,
        healthStatus: context.health?.overallStatus,
        intelligenceRating: context.intelligence?.overallRating,
        commercialStage: context.commercialSummary.stage,
        readyForApproval: context.commercialSummary.readyForApproval,
        workflowProgress,
        assembledAt: context.assembledAt,
      };
    },
  };
}
