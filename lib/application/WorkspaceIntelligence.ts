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
  readonly businessPassportSnapshot: BusinessPassportPresentationViewModel["payload"]["projection"] | null;
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
    workflowNextAction:
      onboardingWorkflow.highestPriorityTask ??
      lifecycle.nextAction ??
      workflowPanelModel?.nextBestAction ??
      null,
    institutionalEvents: eventQueue.toArray(),
    prioritizedActions,
    lifecycle,
    onboardingProgress: lifecycle.onboardingProgress,
    workbench,
    onboardingWorkflow,
    businessPassportSnapshot: source.businessPassport?.payload.projection ?? null,
  };
}
