import type {
  ApprovalHistoryEvent,
  ApprovalParticipantItem,
  ApprovalPanelModel,
  ApprovalPanelSerializedModel,
  ApprovalSerializedHistoryEvent,
  ApprovalSerializedParticipantItem,
} from "@/lib/customer/approval/approval-panel.types";
import type { ApprovalId } from "@/src/capabilities/approval/ApprovalId";
import type { ApprovalStage } from "@/src/capabilities/approval/ApprovalStage";

function toApprovalIdString(value: ApprovalId | string): string {
  return typeof value === "string" ? value : value.toString();
}

function toApprovalStageString(value: ApprovalStage | string): string {
  return typeof value === "string" ? value : value.toString();
}

function toSerializedParticipant(
  item: ApprovalParticipantItem,
): ApprovalSerializedParticipantItem {
  return {
    ...item,
    participant: {
      approvalId: toApprovalIdString(item.participant.approvalId),
      actor: item.participant.actor,
      metadata: item.participant.metadata,
    },
  };
}

function toSerializedHistoryEvent(
  item: ApprovalHistoryEvent,
): ApprovalSerializedHistoryEvent {
  return {
    ...item,
    entry: {
      ...item.entry,
      stage: toApprovalStageString(item.entry.stage),
    },
  };
}

export function toApprovalPanelSerializedModel(
  model: ApprovalPanelModel,
): ApprovalPanelSerializedModel {
  return {
    summary: model.summary,
    stages: model.stages,
    participants: model.participants.map(toSerializedParticipant),
    history: model.history.map(toSerializedHistoryEvent),
    nextAction: model.nextAction,
  };
}