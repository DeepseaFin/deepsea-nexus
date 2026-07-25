import type { InstitutionalEvent } from "@/lib/application/events/InstitutionalEvent";
import { InstitutionalEventQueue } from "@/lib/application/events/InstitutionalEventQueue";
import type { NextBestActionModel } from "@/lib/customer/workflow/workflow.types";
import type { AiInsightsPresentationViewModel } from "@/lib/presentation/presenters/AiInsightsPresenter";
import type { ApprovalPresentationViewModel } from "@/lib/presentation/presenters/ApprovalPresenter";
import type { BusinessPassportPresentationViewModel } from "@/lib/presentation/presenters/BusinessPassportPresenter";
import type { DocumentsPresentationViewModel } from "@/lib/presentation/presenters/DocumentsPresenter";
import type { FundingPresentationViewModel } from "@/lib/presentation/presenters/FundingPresenter";
import type { RelationshipPresentationViewModel } from "@/lib/presentation/presenters/RelationshipPresenter";
import type { WorkflowPresentationViewModel } from "@/lib/presentation/presenters/WorkflowPresenter";
import { ApprovalDecision } from "@/src/capabilities/approval/ApprovalDecision";

export interface CustomerLifecycleOrchestrationSource {
  readonly businessPassport?: BusinessPassportPresentationViewModel | null;
  readonly documents?: DocumentsPresentationViewModel | null;
  readonly relationship?: RelationshipPresentationViewModel | null;
  readonly approvals?: ApprovalPresentationViewModel | null;
  readonly funding?: FundingPresentationViewModel | null;
  readonly aiInsights?: AiInsightsPresentationViewModel | null;
  readonly workflow?: WorkflowPresentationViewModel | null;
  readonly institutionalEvents: readonly InstitutionalEvent[];
}

export interface CustomerLifecycleOrchestrationModel {
  readonly phase:
    | "business-passport"
    | "documents"
    | "approvals"
    | "funding"
    | "relationship"
    | "active";
  readonly businessPassport: {
    readonly state: "incomplete" | "ready" | "unknown";
    readonly status?: string;
    readonly lifecycle?: string;
  };
  readonly documents: {
    readonly state: "missing-mandatory" | "ready" | "unknown";
    readonly missingCount: number;
  };
  readonly approvals: {
    readonly state: "pending" | "completed" | "rejected" | "unknown";
    readonly currentStage?: string;
  };
  readonly funding: {
    readonly state: "readiness-pending" | "readiness-ready" | "unknown";
    readonly readiness?: string;
  };
  readonly relationship: {
    readonly state: "follow-up-due" | "stable" | "unknown";
  };
  readonly workflow: {
    readonly state: string;
  };
  readonly prioritizedEvents: readonly InstitutionalEvent[];
  readonly nextAction: NextBestActionModel | null;
}

function deriveNextAction(event: InstitutionalEvent | null): NextBestActionModel | null {
  if (!event) {
    return null;
  }

  return {
    title: event.title,
    description: event.description,
    owner: event.owner ?? "Operations",
    priority: event.priority,
    actionLabel: event.actionLabel ?? "Open Workspace",
  };
}

function deriveBusinessPassportState(
  viewModel: BusinessPassportPresentationViewModel | null | undefined,
): CustomerLifecycleOrchestrationModel["businessPassport"] {
  const projection = viewModel?.payload.projection;

  if (!projection) {
    return {
      state: "unknown",
    };
  }

  const statusText = `${projection.status} ${projection.lifecycle}`.toLowerCase();
  const incomplete =
    statusText.includes("incomplete") ||
    statusText.includes("draft") ||
    statusText.includes("pending");

  return {
    state: incomplete ? "incomplete" : "ready",
    status: projection.status,
    lifecycle: projection.lifecycle,
  };
}

function deriveApprovalState(
  viewModel: ApprovalPresentationViewModel | null | undefined,
): CustomerLifecycleOrchestrationModel["approvals"] {
  const approval = viewModel?.payload.approvalProjection;

  if (!approval) {
    return {
      state: "unknown",
    };
  }

  if (approval.currentDecision === ApprovalDecision.Reject) {
    return {
      state: "rejected",
      currentStage: approval.currentStage,
    };
  }

  if (approval.currentDecision === ApprovalDecision.Approve) {
    return {
      state: "completed",
      currentStage: approval.currentStage,
    };
  }

  return {
    state: "pending",
    currentStage: approval.currentStage,
  };
}

function deriveFundingState(
  viewModel: FundingPresentationViewModel | null | undefined,
): CustomerLifecycleOrchestrationModel["funding"] {
  const readinessState = viewModel?.payload.panelModel.readiness.state;

  if (!readinessState) {
    return {
      state: "unknown",
    };
  }

  if (readinessState === "Ready" || readinessState === "Funded") {
    return {
      state: "readiness-ready",
      readiness: readinessState,
    };
  }

  return {
    state: "readiness-pending",
    readiness: readinessState,
  };
}

function deriveRelationshipState(
  events: readonly InstitutionalEvent[],
  viewModel: RelationshipPresentationViewModel | null | undefined,
): CustomerLifecycleOrchestrationModel["relationship"] {
  if (!viewModel) {
    return {
      state: "unknown",
    };
  }

  const hasFollowUpDue = events.some((event) => event.type === "relationship-follow-up-due");

  return {
    state: hasFollowUpDue ? "follow-up-due" : "stable",
  };
}

function deriveLifecyclePhase(
  businessPassportState: CustomerLifecycleOrchestrationModel["businessPassport"]["state"],
  documentState: CustomerLifecycleOrchestrationModel["documents"]["state"],
  approvalState: CustomerLifecycleOrchestrationModel["approvals"]["state"],
  fundingState: CustomerLifecycleOrchestrationModel["funding"]["state"],
  relationshipState: CustomerLifecycleOrchestrationModel["relationship"]["state"],
): CustomerLifecycleOrchestrationModel["phase"] {
  if (businessPassportState === "incomplete") {
    return "business-passport";
  }

  if (documentState === "missing-mandatory") {
    return "documents";
  }

  if (approvalState === "pending" || approvalState === "rejected") {
    return "approvals";
  }

  if (fundingState === "readiness-pending") {
    return "funding";
  }

  if (relationshipState === "follow-up-due") {
    return "relationship";
  }

  return "active";
}

export function orchestrateCustomerLifecycle(
  source: CustomerLifecycleOrchestrationSource,
): CustomerLifecycleOrchestrationModel {
  const queue = new InstitutionalEventQueue(source.institutionalEvents);
  const prioritizedEvents = queue.prioritized();

  const businessPassport = deriveBusinessPassportState(source.businessPassport);
  const documents = {
    state: source.documents
      ? source.documents.payload.panelModel.missingDocuments.length > 0
        ? "missing-mandatory"
        : "ready"
      : "unknown",
    missingCount: source.documents?.payload.panelModel.missingDocuments.length ?? 0,
  } satisfies CustomerLifecycleOrchestrationModel["documents"];
  const approvals = deriveApprovalState(source.approvals);
  const funding = deriveFundingState(source.funding);
  const relationship = deriveRelationshipState(prioritizedEvents, source.relationship);

  const workflowState = source.workflow?.payload.panelModel.workflowStatus.queueStatus ?? "unknown";
  const nextAction = deriveNextAction(prioritizedEvents[0] ?? null) ?? source.workflow?.payload.panelModel.nextBestAction ?? null;

  return {
    phase: deriveLifecyclePhase(
      businessPassport.state,
      documents.state,
      approvals.state,
      funding.state,
      relationship.state,
    ),
    businessPassport,
    documents,
    approvals,
    funding,
    relationship,
    workflow: {
      state: workflowState,
    },
    prioritizedEvents,
    nextAction,
  };
}
