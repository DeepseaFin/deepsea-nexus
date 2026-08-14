import type { ApprovalDecision } from "@/src/capabilities/approval/ApprovalDecision";
import type { ApprovalHistoryEntry } from "@/src/capabilities/approval/ApprovalHistoryEntry";
import type { ApprovalParticipant } from "@/src/capabilities/approval/ApprovalParticipant";
import type { ApprovalProjection } from "@/src/capabilities/approval/projections/ApprovalProjection";

export const APPROVAL_STAGE_STATES = [
  "Pending",
  "In Review",
  "Approved",
  "Rejected",
  "Returned",
  "Completed",
] as const;

export type ApprovalStageState = (typeof APPROVAL_STAGE_STATES)[number];

export interface ApprovalDecisionSummary {
  readonly approval: Pick<
    ApprovalProjection,
    "approvalId" | "title" | "status" | "currentStage" | "currentDecision" | "createdAt"
  >;
  readonly requestedBy: string;
  readonly submittedDate: string;
  readonly dueDate: string;
  readonly priority: string;
}

export interface ApprovalStageItem {
  readonly id: string;
  readonly title: string;
  readonly state: ApprovalStageState;
  readonly owner?: string;
  readonly dueDate?: string;
}

export interface ApprovalParticipantItem {
  readonly participant: ApprovalParticipant;
  readonly status: string;
  readonly decision: ApprovalDecision | "pending";
}

export interface ApprovalSerializedParticipantItem {
  readonly participant: {
    readonly approvalId: string;
    readonly actor: ApprovalParticipant["actor"];
    readonly metadata: ApprovalParticipant["metadata"];
  };
  readonly status: string;
  readonly decision: ApprovalDecision | "pending";
}

export interface ApprovalHistoryEvent {
  readonly entry: ApprovalHistoryEntry;
  readonly actorName: string;
  readonly title: string;
  readonly description: string;
}

export interface ApprovalSerializedHistoryEvent {
  readonly entry: {
    readonly timestamp: string;
    readonly actorId: string;
    readonly stage: string;
    readonly decision: ApprovalHistoryEntry["decision"];
    readonly comment?: string;
  };
  readonly actorName: string;
  readonly title: string;
  readonly description: string;
}

export interface ApprovalNextAction {
  readonly id: string;
  readonly title: string;
  readonly owner: string;
  readonly dueDate: string;
  readonly status: string;
  readonly priority: "low" | "medium" | "high";
}

export interface ApprovalPanelConfig {
  readonly title: string;
  readonly subtitle: string;
  readonly workspaceLabel: string;
  readonly summaryTitle: string;
  readonly summarySubtitle: string;
  readonly stagesTitle: string;
  readonly stagesSubtitle: string;
  readonly participantsTitle: string;
  readonly participantsSubtitle: string;
  readonly historyTitle: string;
  readonly historySubtitle: string;
  readonly nextActionTitle: string;
  readonly nextActionSubtitle: string;
}

export interface ApprovalPanelModel {
  readonly summary: ApprovalDecisionSummary;
  readonly stages: readonly ApprovalStageItem[];
  readonly participants: readonly ApprovalParticipantItem[];
  readonly history: readonly ApprovalHistoryEvent[];
  readonly nextAction: ApprovalNextAction;
}

export interface ApprovalPanelSerializedModel {
  readonly summary: ApprovalDecisionSummary;
  readonly stages: readonly ApprovalStageItem[];
  readonly participants: readonly ApprovalSerializedParticipantItem[];
  readonly history: readonly ApprovalSerializedHistoryEvent[];
  readonly nextAction: ApprovalNextAction;
}
