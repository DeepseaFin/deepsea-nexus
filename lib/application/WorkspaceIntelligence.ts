import type { AiInsightsPresentationViewModel } from "@/lib/presentation/presenters/AiInsightsPresenter";
import type { ApprovalPresentationViewModel } from "@/lib/presentation/presenters/ApprovalPresenter";
import type { BusinessPassportPresentationViewModel } from "@/lib/presentation/presenters/BusinessPassportPresenter";
import type { DocumentsPresentationViewModel } from "@/lib/presentation/presenters/DocumentsPresenter";
import type { FundingPresentationViewModel } from "@/lib/presentation/presenters/FundingPresenter";
import type { InstitutionalTimelinePresentationViewModel } from "@/lib/presentation/presenters/InstitutionalTimelinePresenter";
import type { RelationshipPresentationViewModel } from "@/lib/presentation/presenters/RelationshipPresenter";
import type { WorkflowPresentationViewModel } from "@/lib/presentation/presenters/WorkflowPresenter";
import type { InstitutionalEvent } from "@/lib/application/events/InstitutionalEvent";
import { createInstitutionalEvents } from "@/lib/application/events/InstitutionalEventFactory";
import { InstitutionalEventQueue } from "@/lib/application/events/InstitutionalEventQueue";
import type { InstitutionalEventType } from "@/lib/application/events/InstitutionalEventType";
import type { NextBestActionModel } from "@/lib/customer/workflow/workflow.types";
import {
  orchestrateCustomerLifecycle,
  type CustomerLifecycleOrchestrationModel,
} from "@/lib/application/CustomerLifecycleOrchestrator";
import type { OnboardingProgressModel } from "@/lib/application/OnboardingProgress";
import {
  composeRelationshipManagerWorkbench,
  type RelationshipManagerWorkbenchModel,
} from "@/lib/application/RelationshipManagerWorkbench";
import {
  composeOnboardingWorkflow,
  type OnboardingWorkflowTask,
  type OnboardingWorkflowModel,
} from "@/lib/application/OnboardingWorkflow";

export type FundingReadinessStatus =
  | "Not Ready"
  | "In Progress"
  | "Ready for Review"
  | "Funding Ready";

export interface FundingReadinessAssessmentModel {
  readonly score: number;
  readonly status: FundingReadinessStatus;
  readonly missingRequirements: readonly string[];
  readonly pendingApprovals: readonly {
    readonly id: string;
    readonly title: string;
    readonly currentStage: string;
    readonly decision: string;
    readonly status: string;
  }[];
  readonly outstandingDocuments: DocumentsPresentationViewModel["payload"]["panelModel"]["missingDocuments"];
  readonly criticalBlockers: readonly OnboardingWorkflowTask[];
  readonly recommendedNextAction: NextBestActionModel | null;
}

export interface InstitutionalDecisionSummaryModel {
  readonly fundingRecommendation: string;
  readonly keyStrengths: readonly string[];
  readonly criticalBlockers: readonly OnboardingWorkflowTask[];
  readonly requiredNextActions: readonly NextBestActionModel[];
  readonly confidenceIndicator?: string;
}

export interface WorkspaceIntelligenceSource {
  readonly customer?: {
    readonly id?: string;
    readonly name: string;
  };
  readonly businessPassport?: BusinessPassportPresentationViewModel | null;
  readonly documents?: DocumentsPresentationViewModel | null;
  readonly relationship?: RelationshipPresentationViewModel | null;
  readonly approvals?: ApprovalPresentationViewModel | null;
  readonly funding?: FundingPresentationViewModel | null;
  readonly aiInsights?: AiInsightsPresentationViewModel | null;
  readonly timeline?: InstitutionalTimelinePresentationViewModel | null;
  readonly workflow?: WorkflowPresentationViewModel | null;
}

export interface WorkspaceIntelligenceModel {
  readonly outstandingApprovals: readonly ApprovalPresentationViewModel["payload"]["approvalProjection"][];
  readonly missingDocuments: DocumentsPresentationViewModel["payload"]["panelModel"]["missingDocuments"];
  readonly fundingMilestones: FundingPresentationViewModel["payload"]["panelModel"]["timeline"];
  readonly relationshipRisks: readonly {
    readonly relationshipId: string;
    readonly relationshipName: string;
    readonly status: string;
    readonly stage: string;
    readonly recentInteractions: readonly {
      readonly interactionId: string;
      readonly subject: string;
      readonly status: string;
      readonly occurredAt: string;
    }[];
  }[];
  readonly aiRecommendations: AiInsightsPresentationViewModel["payload"]["panelModel"]["recommendations"];
  readonly timelineAlerts: InstitutionalTimelinePresentationViewModel["payload"]["panelModel"]["events"];
  readonly workflowNextAction: WorkflowPresentationViewModel["payload"]["panelModel"]["nextBestAction"] | null;
  readonly institutionalEvents: readonly InstitutionalEvent[];
  readonly prioritizedActions: readonly {
    readonly id: string;
    readonly eventType: InstitutionalEventType;
    readonly action: NextBestActionModel;
  }[];
  readonly lifecycle: CustomerLifecycleOrchestrationModel;
  readonly onboardingProgress: OnboardingProgressModel;
  readonly workbench: RelationshipManagerWorkbenchModel;
  readonly onboardingWorkflow: OnboardingWorkflowModel;
  readonly onboardingDashboard: OnboardingDashboardModel;
  readonly businessPassportSnapshot: BusinessPassportPresentationViewModel["payload"]["projection"] | null;
}

export interface OnboardingDashboardModel {
  readonly currentLifecycleStage: CustomerLifecycleOrchestrationModel["phase"];
  readonly overallOnboardingProgress: string;
  readonly completionPercentage: number;
  readonly fundingReadiness: string;
  readonly criticalBlockers: readonly OnboardingWorkflowTask[];
  readonly requiredDocuments: DocumentsPresentationViewModel["payload"]["panelModel"]["missingDocuments"];
  readonly pendingApprovals: readonly {
    readonly id: string;
    readonly title: string;
    readonly currentStage: string;
    readonly decision: string;
    readonly status: string;
  }[];
  readonly fundingReadinessAssessment: FundingReadinessAssessmentModel;
  readonly decisionSummary: InstitutionalDecisionSummaryModel;
  readonly relationshipHealth:
    | {
        readonly relationshipName: string;
        readonly status: string;
        readonly stage: string;
        readonly recentInteractionCount: number;
      }
    | null;
  readonly nextRecommendedAction: NextBestActionModel | null;
}

function deriveFundingRecommendation(params: {
  readonly fundingReadinessStatus: FundingReadinessStatus;
  readonly fundingReadinessLabel: string;
  readonly blockerCount: number;
}): string {
  if (params.fundingReadinessStatus === "Funding Ready" && params.blockerCount === 0) {
    return "Proceed with funding release and final onboarding completion checks.";
  }

  if (params.fundingReadinessStatus === "Ready for Review") {
    return "Route case for institutional funding review and decision confirmation.";
  }

  if (params.fundingReadinessStatus === "In Progress") {
    return "Continue readiness execution to close remaining funding dependencies.";
  }

  return `Funding is not ready. Focus on clearing blockers under state: ${params.fundingReadinessLabel}.`;
}

function parseReadinessScore(confidence: string | undefined): number | null {
  if (!confidence) {
    return null;
  }

  const numeric = Number.parseInt(confidence.replace(/[^0-9]/g, ""), 10);
  if (Number.isNaN(numeric)) {
    return null;
  }

  return Math.min(100, Math.max(0, numeric));
}

function inferFundingReadinessScore(params: {
  readonly providedScore: number | null;
  readonly outstandingDocumentCount: number;
  readonly pendingApprovalCount: number;
  readonly blockerCount: number;
  readonly lifecycleFundingState: CustomerLifecycleOrchestrationModel["funding"]["state"];
}): number {
  if (params.providedScore !== null) {
    return params.providedScore;
  }

  let score = 100;

  score -= params.outstandingDocumentCount * 15;
  score -= params.pendingApprovalCount * 20;
  score -= params.blockerCount * 20;

  if (params.lifecycleFundingState === "readiness-pending") {
    score -= 10;
  }

  return Math.min(100, Math.max(0, score));
}

function deriveFundingReadinessStatus(params: {
  readonly score: number;
  readonly lifecycleFundingState: CustomerLifecycleOrchestrationModel["funding"]["state"];
  readonly outstandingDocumentCount: number;
  readonly pendingApprovalCount: number;
  readonly blockerCount: number;
}): FundingReadinessStatus {
  const hasNoBlockingDependencies =
    params.outstandingDocumentCount === 0 && params.pendingApprovalCount === 0 && params.blockerCount === 0;

  if (params.lifecycleFundingState === "readiness-ready" && hasNoBlockingDependencies) {
    return "Funding Ready";
  }

  if (params.score >= 75 && params.blockerCount === 0 && params.outstandingDocumentCount <= 1) {
    return "Ready for Review";
  }

  if (params.score >= 40) {
    return "In Progress";
  }

  return "Not Ready";
}

function toPrioritizedAction(event: InstitutionalEvent): {
  readonly id: string;
  readonly eventType: InstitutionalEventType;
  readonly action: NextBestActionModel;
} {
  return {
    id: event.id,
    eventType: event.type,
    action: {
      title: event.title,
      description: event.description,
      owner: event.owner ?? "Operations",
      priority: event.priority,
      actionLabel: event.actionLabel ?? "Open Workspace",
    },
  };
}

export function composeWorkspaceIntelligence(
  source: WorkspaceIntelligenceSource,
): WorkspaceIntelligenceModel {
  const customer = source.customer ?? {
    id: source.businessPassport?.payload.projection.passportId.toString(),
    name: source.businessPassport?.payload.projection.passportId.toString() ?? "Customer",
  };
  const approvalProjection = source.approvals?.payload.approvalProjection;
  const documentsPanelModel = source.documents?.payload.panelModel;
  const relationshipProjection = source.relationship?.payload.workspaceProjection;
  const fundingPanelModel = source.funding?.payload.panelModel;
  const aiPanelModel = source.aiInsights?.payload.panelModel;
  const timelinePanelModel = source.timeline?.payload.panelModel;
  const workflowPanelModel = source.workflow?.payload.panelModel;

  const institutionalEvents = createInstitutionalEvents({
    approvalProjection,
    missingDocuments: documentsPanelModel?.missingDocuments ?? [],
    fundingMilestones: fundingPanelModel?.timeline ?? [],
    relationshipWorkspaceProjection: relationshipProjection,
    aiRecommendations: aiPanelModel?.recommendations ?? [],
    timelineMilestones: timelinePanelModel?.events ?? [],
    workflowNextAction: workflowPanelModel?.nextBestAction ?? null,
  });
  const eventQueue = new InstitutionalEventQueue(institutionalEvents);
  const lifecycle = orchestrateCustomerLifecycle({
    businessPassport: source.businessPassport,
    documents: source.documents,
    relationship: source.relationship,
    approvals: source.approvals,
    funding: source.funding,
    aiInsights: source.aiInsights,
    workflow: source.workflow,
    institutionalEvents: eventQueue.toArray(),
  });
  const workbench = composeRelationshipManagerWorkbench({
    customer,
    lifecycle,
    institutionalEvents: eventQueue.toArray(),
    aiRecommendations: aiPanelModel?.recommendations ?? [],
  });
  const onboardingWorkflow = composeOnboardingWorkflow({
    lifecycle,
    onboardingProgress: lifecycle.onboardingProgress,
    workbench,
  });
  const requiredDocuments = documentsPanelModel?.missingDocuments ?? [];
  const pendingApprovals =
    lifecycle.approvals.state === "pending" && approvalProjection
      ? [
          {
            id: approvalProjection.approvalId,
            title: approvalProjection.title,
            currentStage: approvalProjection.currentStage,
            decision: approvalProjection.currentDecision,
            status: approvalProjection.status,
          },
        ]
      : [];
  const relationshipHealth = relationshipProjection
    ? {
        relationshipName: relationshipProjection.relationship.relationshipName,
        status: relationshipProjection.relationship.status,
        stage: relationshipProjection.relationship.stage,
        recentInteractionCount: relationshipProjection.interactions.length,
      }
    : null;
  const nextRecommendedAction =
    onboardingWorkflow.highestPriorityTask ??
    lifecycle.nextAction ??
    workflowPanelModel?.nextBestAction ??
    null;
  const providedReadinessScore = parseReadinessScore(fundingPanelModel?.readiness.confidence);
  const fundingReadinessScore = inferFundingReadinessScore({
    providedScore: providedReadinessScore,
    outstandingDocumentCount: requiredDocuments.length,
    pendingApprovalCount: pendingApprovals.length,
    blockerCount: onboardingWorkflow.blockers.length,
    lifecycleFundingState: lifecycle.funding.state,
  });
  const fundingReadinessStatus = deriveFundingReadinessStatus({
    score: fundingReadinessScore,
    lifecycleFundingState: lifecycle.funding.state,
    outstandingDocumentCount: requiredDocuments.length,
    pendingApprovalCount: pendingApprovals.length,
    blockerCount: onboardingWorkflow.blockers.length,
  });
  const missingRequirements: readonly string[] = [
    ...requiredDocuments.map((document) => document.documentName),
    ...pendingApprovals.map((approval) => `Approval pending: ${approval.title}`),
    ...onboardingWorkflow.blockers.map((blocker) => blocker.title),
  ];
  const fundingReadinessAssessment: FundingReadinessAssessmentModel = {
    score: fundingReadinessScore,
    status: fundingReadinessStatus,
    missingRequirements,
    pendingApprovals,
    outstandingDocuments: requiredDocuments,
    criticalBlockers: onboardingWorkflow.blockers,
    recommendedNextAction: nextRecommendedAction,
  };
  const keyStrengths = [
    ...(lifecycle.documents.state === "ready" ? ["Mandatory document set is complete"] : []),
    ...(lifecycle.approvals.state === "completed" ? ["Approval decision has been completed"] : []),
    ...(lifecycle.funding.state === "readiness-ready" ? ["Funding readiness has reached release threshold"] : []),
    ...(relationshipHealth ? [`Relationship health is ${relationshipHealth.status}`] : []),
    ...((aiPanelModel?.recommendations ?? [])
      .filter((recommendation) => recommendation.riskLevel === "Low")
      .slice(0, 2)
      .map((recommendation) => recommendation.title)),
  ];
  const requiredNextActions: readonly NextBestActionModel[] = [
    ...(nextRecommendedAction ? [nextRecommendedAction] : []),
    ...workbench.topItems.slice(0, 2).map((item) => item.action),
  ];
  const confidenceIndicator = aiPanelModel?.recommendations[0]?.confidence;
  const decisionSummary: InstitutionalDecisionSummaryModel = {
    fundingRecommendation: deriveFundingRecommendation({
      fundingReadinessStatus,
      fundingReadinessLabel: onboardingWorkflow.fundingReadiness,
      blockerCount: onboardingWorkflow.blockers.length,
    }),
    keyStrengths,
    criticalBlockers: onboardingWorkflow.blockers,
    requiredNextActions,
    ...(confidenceIndicator ? { confidenceIndicator } : {}),
  };
  const onboardingDashboard: OnboardingDashboardModel = {
    currentLifecycleStage: lifecycle.phase,
    overallOnboardingProgress: lifecycle.onboardingProgress.currentStage.label,
    completionPercentage: onboardingWorkflow.completionPercentage,
    fundingReadiness: onboardingWorkflow.fundingReadiness,
    criticalBlockers: onboardingWorkflow.blockers,
    requiredDocuments,
    pendingApprovals,
    fundingReadinessAssessment,
    decisionSummary,
    relationshipHealth,
    nextRecommendedAction,
  };
  const prioritizedActions = lifecycle.prioritizedEvents.map(toPrioritizedAction);

  return {
    outstandingApprovals: approvalProjection ? [approvalProjection] : [],
    missingDocuments: documentsPanelModel?.missingDocuments ?? [],
    fundingMilestones: fundingPanelModel?.timeline ?? [],
    relationshipRisks: relationshipProjection
      ? [
          {
            relationshipId: relationshipProjection.relationship.relationshipId,
            relationshipName: relationshipProjection.relationship.relationshipName,
            status: relationshipProjection.relationship.status,
            stage: relationshipProjection.relationship.stage,
            recentInteractions: relationshipProjection.interactions.map((interaction) => ({
              interactionId: interaction.interactionId,
              subject: interaction.subject,
              status: interaction.status,
              occurredAt: interaction.occurredAt,
            })),
          },
        ]
      : [],
    aiRecommendations: aiPanelModel?.recommendations ?? [],
    timelineAlerts: timelinePanelModel?.events ?? [],
    workflowNextAction: nextRecommendedAction,
    institutionalEvents: eventQueue.toArray(),
    prioritizedActions,
    lifecycle,
    onboardingProgress: lifecycle.onboardingProgress,
    workbench,
    onboardingWorkflow,
    onboardingDashboard,
    businessPassportSnapshot: source.businessPassport?.payload.projection ?? null,
  };
}
