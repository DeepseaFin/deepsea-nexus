"use client";

import React from "react";
import { PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import ApprovalDecisionCard from "@/components/customer/approval/ApprovalDecisionCard";
import ApprovalHeader from "@/components/customer/approval/ApprovalHeader";
import ApprovalHistory from "@/components/customer/approval/ApprovalHistory";
import ApprovalParticipants from "@/components/customer/approval/ApprovalParticipants";
import ApprovalStageTimeline from "@/components/customer/approval/ApprovalStageTimeline";
import ApprovalSummaryCard from "@/components/customer/approval/ApprovalSummaryCard";
import { approvalPanelConfig, defaultApprovalPanelModel } from "@/lib/customer/approval/approval-panel.config";
import type { ApprovalPanelConfig, ApprovalPanelModel } from "@/lib/customer/approval/approval-panel.types";
import type { ApprovalPresentationViewModel } from "@/lib/presentation/presenters/ApprovalPresenter";

export interface ApprovalPanelProps {
  readonly config?: ApprovalPanelConfig;
  readonly viewModel?: ApprovalPresentationViewModel;
  readonly model?: ApprovalPanelModel;
  readonly isLoading?: boolean;
  readonly error?: string;
}

function buildApprovalPanelModel(
  viewModel: ApprovalPresentationViewModel | undefined,
  fallbackModel: ApprovalPanelModel,
): ApprovalPanelModel {
  if (!viewModel) {
    return fallbackModel;
  }

  const approvalProjection = viewModel.payload.approvalProjection;
  const participants = fallbackModel.participants.map((item, index) => {
    const projectedParticipant = approvalProjection.participants[index];

    if (!projectedParticipant) {
      return item;
    }

    return {
      ...item,
      participant: projectedParticipant,
    };
  });

  return {
    ...fallbackModel,
    summary: {
      ...fallbackModel.summary,
      approval: {
        ...fallbackModel.summary.approval,
        approvalId: approvalProjection.approvalId,
        title: approvalProjection.title,
        status: approvalProjection.status,
        currentStage: approvalProjection.currentStage,
        currentDecision: approvalProjection.currentDecision,
        createdAt: approvalProjection.metadata.generatedAt,
      },
    },
    participants,
  };
}

export default function ApprovalPanel({
  config = approvalPanelConfig,
  viewModel,
  model = defaultApprovalPanelModel,
  isLoading = false,
  error,
}: ApprovalPanelProps) {
  if (isLoading) {
    return <PanelLoadingState title={config.title} subtitle={config.subtitle} />;
  }

  if (error) {
    return <PanelErrorState title={config.title} subtitle={config.subtitle} message={error} />;
  }

  const presentationModel = buildApprovalPanelModel(viewModel, model);

  return (
    <div className="space-y-4">
      <ApprovalHeader config={config} summary={presentationModel.summary} />
      <ApprovalSummaryCard config={config} summary={presentationModel.summary} />
      <ApprovalStageTimeline config={config} stages={presentationModel.stages} />
      <ApprovalParticipants config={config} participants={presentationModel.participants} />
      <ApprovalHistory config={config} events={presentationModel.history} />
      <ApprovalDecisionCard config={config} action={presentationModel.nextAction} />
    </div>
  );
}
