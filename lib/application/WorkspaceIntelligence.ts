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
  const onboardingDashboard: OnboardingDashboardModel = {
    currentLifecycleStage: lifecycle.phase,
    overallOnboardingProgress: lifecycle.onboardingProgress.currentStage.label,
    completionPercentage: onboardingWorkflow.completionPercentage,
    fundingReadiness: onboardingWorkflow.fundingReadiness,
    criticalBlockers: onboardingWorkflow.blockers,
    requiredDocuments,
    pendingApprovals,
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
