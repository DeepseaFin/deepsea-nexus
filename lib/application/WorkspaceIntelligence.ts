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
import type { StatusChipProps } from "@/components/ui/StatusChip";

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

export interface InstitutionalHealthSignal {
  readonly value: string;
  readonly variant: StatusChipProps["variant"];
}

export interface InstitutionalHealthOverviewModel {
  readonly overallCustomerHealth: InstitutionalHealthSignal;
  readonly onboardingHealth: InstitutionalHealthSignal;
  readonly documentationCompleteness: InstitutionalHealthSignal;
  readonly approvalReadiness: InstitutionalHealthSignal;
  readonly fundingReadiness: InstitutionalHealthSignal;
  readonly relationshipHealth: InstitutionalHealthSignal;
  readonly operationalStatus: InstitutionalHealthSignal;
}

export interface EvidenceOverviewModel {
  readonly timeline: readonly {
    readonly id: string;
    readonly evidenceReceivedDate: string;
    readonly source: string;
    readonly verificationStatus: string;
    readonly supportingBusinessCapability: string | null;
    readonly expiryDate: string | null;
    readonly mostRecentActivity: string;
  }[];
  readonly totalEvidenceItems: number;
  readonly verifiedEvidence: number;
  readonly pendingVerification: number;
  readonly missingEvidence: number;
  readonly recentlyUploadedEvidence: readonly {
    readonly id: string;
    readonly label: string;
    readonly uploadedAt: string;
  }[];
  readonly evidenceQualityOrCompleteness: string | null;
  readonly qualityAssessment: EvidenceQualityAssessmentModel;
  readonly missingEvidenceAssessment: MissingEvidenceAssessmentModel;
}

export interface EvidenceQualityAssessmentModel {
  readonly evidenceCompleteness: {
    readonly value: string;
    readonly variant: StatusChipProps["variant"];
  };
  readonly verificationCoverage: {
    readonly value: string;
    readonly variant: StatusChipProps["variant"];
  };
  readonly evidenceFreshness: string | null;
  readonly overallEvidenceConfidence: string | null;
}

export interface MissingEvidenceAssessmentModel {
  readonly missingMandatoryEvidence: readonly {
    readonly id: string;
    readonly name: string;
    readonly reason: string;
    readonly dueLabel: string | null;
  }[];
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
  readonly evidenceOverview: EvidenceOverviewModel;
  readonly institutionalHealthOverview: InstitutionalHealthOverviewModel;
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

function deriveInstitutionalHealthOverview(params: {
  readonly lifecycle: CustomerLifecycleOrchestrationModel;
  readonly onboardingProgress: OnboardingProgressModel;
  readonly fundingReadiness: FundingReadinessAssessmentModel;
  readonly requiredDocumentsCount: number;
  readonly pendingApprovalsCount: number;
  readonly blockerCount: number;
  readonly relationshipHealthStatus: string | null;
  readonly workflowState: string;
}): InstitutionalHealthOverviewModel {
  const documentationCompleteness: InstitutionalHealthSignal =
    params.requiredDocumentsCount === 0
      ? { value: "Complete", variant: "success" }
      : { value: `${params.requiredDocumentsCount} Missing`, variant: "warning" };

  const approvalReadiness: InstitutionalHealthSignal =
    params.pendingApprovalsCount === 0
      ? { value: "Ready", variant: "success" }
      : { value: `${params.pendingApprovalsCount} Pending`, variant: "warning" };

  const onboardingHealth: InstitutionalHealthSignal =
    params.blockerCount === 0
      ? params.onboardingProgress.overallCompletionPercent >= 75
        ? { value: "Healthy", variant: "success" }
        : { value: "In Progress", variant: "info" }
      : { value: "Blocked", variant: "danger" };

  const fundingHealthVariant: StatusChipProps["variant"] =
    params.fundingReadiness.status === "Funding Ready"
      ? "success"
      : params.fundingReadiness.status === "Ready for Review"
        ? "info"
        : params.fundingReadiness.status === "In Progress"
          ? "warning"
          : "danger";

  const fundingReadiness: InstitutionalHealthSignal = {
    value: params.fundingReadiness.status,
    variant: fundingHealthVariant,
  };

  const relationshipHealth: InstitutionalHealthSignal = params.relationshipHealthStatus
    ? {
        value: params.relationshipHealthStatus,
        variant:
          params.relationshipHealthStatus.toLowerCase().includes("active") ||
          params.relationshipHealthStatus.toLowerCase().includes("stable")
            ? "success"
            : "warning",
      }
    : { value: "Unknown", variant: "default" };

  const operationalStatus: InstitutionalHealthSignal =
    params.blockerCount > 0
      ? { value: "Attention Required", variant: "danger" }
      : params.workflowState.toLowerCase().includes("blocked")
        ? { value: "Queue Blocked", variant: "danger" }
        : params.workflowState.toLowerCase().includes("active")
          ? { value: "Operational", variant: "success" }
          : { value: "Monitoring", variant: "info" };

  const overallCustomerHealth: InstitutionalHealthSignal =
    params.blockerCount > 0 || params.fundingReadiness.score < 40
      ? { value: "At Risk", variant: "danger" }
      : params.onboardingProgress.overallCompletionPercent >= 80 && params.requiredDocumentsCount === 0
        ? { value: "Strong", variant: "success" }
        : { value: "Watchlist", variant: "warning" };

  return {
    overallCustomerHealth,
    onboardingHealth,
    documentationCompleteness,
    approvalReadiness,
    fundingReadiness,
    relationshipHealth,
    operationalStatus,
  };
}

function metricValueAsNumber(
  summary: DocumentsPresentationViewModel["payload"]["panelModel"]["summary"],
  label: "Total Documents" | "Verified" | "Pending" | "Missing",
): number | null {
  const metric = summary.find((item) => item.label === label);
  if (!metric) {
    return null;
  }

  const parsed = Number.parseInt(metric.value.replace(/[^0-9]/g, ""), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function deriveEvidenceOverviewModel(
  documentsPanelModel: DocumentsPresentationViewModel["payload"]["panelModel"] | undefined,
  aiPanelModel: AiInsightsPresentationViewModel["payload"]["panelModel"] | undefined,
): EvidenceOverviewModel {
  const evidenceSummary = documentsPanelModel?.evidenceSummary ?? [];
  const totalFromSummary = metricValueAsNumber(documentsPanelModel?.summary ?? [], "Total Documents");
  const verifiedFromSummary = metricValueAsNumber(documentsPanelModel?.summary ?? [], "Verified");
  const pendingFromSummary = metricValueAsNumber(documentsPanelModel?.summary ?? [], "Pending");
  const missingFromSummary = metricValueAsNumber(documentsPanelModel?.summary ?? [], "Missing");

  const verifiedFromEvidence = evidenceSummary.filter((item) => item.status === "valid").length;
  const pendingFromEvidence = evidenceSummary.filter((item) => item.status === "pending_validation").length;

  const totalEvidenceItems =
    totalFromSummary ??
    evidenceSummary.length ??
    0;
  const verifiedEvidence = verifiedFromSummary ?? verifiedFromEvidence;
  const pendingVerification = pendingFromSummary ?? pendingFromEvidence;
  const missingEvidence =
    missingFromSummary ??
    Math.max(0, totalEvidenceItems - verifiedEvidence - pendingVerification);

  const recentlyUploadedEvidence = [...evidenceSummary]
    .sort((left, right) =>
      new Date(right.metadata.uploadedAt).getTime() - new Date(left.metadata.uploadedAt).getTime(),
    )
    .slice(0, 3)
    .map((item) => ({
      id: item.evidenceId.toString(),
      label: item.metadata.documentId,
      uploadedAt: item.metadata.uploadedAt,
    }));

  const mostRecentTimelineEvent = [...(documentsPanelModel?.timeline ?? [])].sort(
    (left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime(),
  )[0];

  const timeline = [...evidenceSummary]
    .sort((left, right) =>
      new Date(right.metadata.uploadedAt).getTime() - new Date(left.metadata.uploadedAt).getTime(),
    )
    .map((item) => {
      const statusLabel = item.status.replace(/_/g, " ");
      const source = item.metadata.sourceSystem;
      const supportingBusinessCapability = source.includes("oracle")
        ? "Document Intelligence"
        : source.includes("approval")
          ? "Approvals"
          : source.includes("funding")
            ? "Funding"
            : null;

      return {
        id: item.evidenceId.toString(),
        evidenceReceivedDate: item.metadata.uploadedAt,
        source,
        verificationStatus: statusLabel,
        supportingBusinessCapability,
        expiryDate: null,
        mostRecentActivity: mostRecentTimelineEvent
          ? `${mostRecentTimelineEvent.title} (${mostRecentTimelineEvent.timestamp})`
          : `Status: ${statusLabel}`,
      };
    });

  const completenessPercent =
    totalEvidenceItems > 0 ? Math.round((verifiedEvidence / totalEvidenceItems) * 100) : 0;

  const verificationCoveragePercent =
    totalEvidenceItems > 0 ? Math.round((verifiedEvidence / totalEvidenceItems) * 100) : 0;

  const latestUpload = evidenceSummary
    .map((item) => new Date(item.metadata.uploadedAt).getTime())
    .filter((value) => !Number.isNaN(value))
    .sort((left, right) => right - left)[0];

  const freshnessDays =
    latestUpload !== undefined
      ? Math.floor((Date.now() - latestUpload) / (1000 * 60 * 60 * 24))
      : null;

  const qualityAssessment: EvidenceQualityAssessmentModel = {
    evidenceCompleteness: {
      value: `${completenessPercent}%`,
      variant:
        completenessPercent >= 80
          ? "success"
          : completenessPercent >= 50
            ? "warning"
            : "danger",
    },
    verificationCoverage: {
      value: `${verificationCoveragePercent}%`,
      variant:
        verificationCoveragePercent >= 80
          ? "success"
          : verificationCoveragePercent >= 50
            ? "warning"
            : "danger",
    },
    evidenceFreshness:
      freshnessDays !== null
        ? freshnessDays === 0
          ? "Updated today"
          : `${freshnessDays} day${freshnessDays === 1 ? "" : "s"} ago`
        : null,
    overallEvidenceConfidence: aiPanelModel?.recommendations[0]?.confidence ?? null,
  };

  const missingEvidenceAssessment: MissingEvidenceAssessmentModel = {
    missingMandatoryEvidence: (documentsPanelModel?.missingDocuments ?? []).map((document) => ({
      id: document.id,
      name: document.documentName,
      reason: document.reason,
      dueLabel: document.dueLabel ?? null,
    })),
  };

  return {
    timeline,
    totalEvidenceItems,
    verifiedEvidence,
    pendingVerification,
    missingEvidence,
    recentlyUploadedEvidence,
    evidenceQualityOrCompleteness:
      totalEvidenceItems > 0 ? `${completenessPercent}% verified completeness` : null,
    qualityAssessment,
    missingEvidenceAssessment,
  };
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
  const evidenceOverview = deriveEvidenceOverviewModel(documentsPanelModel, aiPanelModel);
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
  const institutionalHealthOverview = deriveInstitutionalHealthOverview({
    lifecycle,
    onboardingProgress: lifecycle.onboardingProgress,
    fundingReadiness: fundingReadinessAssessment,
    requiredDocumentsCount: requiredDocuments.length,
    pendingApprovalsCount: pendingApprovals.length,
    blockerCount: onboardingWorkflow.blockers.length,
    relationshipHealthStatus: relationshipHealth?.status ?? null,
    workflowState: lifecycle.workflow.state,
  });
  const onboardingDashboard: OnboardingDashboardModel = {
    currentLifecycleStage: lifecycle.phase,
    overallOnboardingProgress: lifecycle.onboardingProgress.currentStage.label,
    completionPercentage: onboardingWorkflow.completionPercentage,
    fundingReadiness: onboardingWorkflow.fundingReadiness,
    criticalBlockers: onboardingWorkflow.blockers,
    requiredDocuments,
    pendingApprovals,
    evidenceOverview,
    institutionalHealthOverview,
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
