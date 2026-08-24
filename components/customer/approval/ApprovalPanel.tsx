"use client";

import React from "react";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import ApprovalDecisionCard from "@/components/customer/approval/ApprovalDecisionCard";
import ApprovalHeader from "@/components/customer/approval/ApprovalHeader";
import ApprovalHistory from "@/components/customer/approval/ApprovalHistory";
import ApprovalParticipants from "@/components/customer/approval/ApprovalParticipants";
import ApprovalStageTimeline from "@/components/customer/approval/ApprovalStageTimeline";
import ApprovalSummaryCard from "@/components/customer/approval/ApprovalSummaryCard";
import { approvalPanelConfig } from "@/lib/customer/approval/approval-panel.config";
import type {
  ApprovalPanelConfig,
  ApprovalPanelSerializedModel,
} from "@/lib/customer/approval/approval-panel.types";
import type { ApprovalPresentationViewModel } from "@/lib/presentation/presenters/ApprovalPresenter";
import SectionCard from "@/components/ui/SectionCard";

export interface ApprovalPanelProps {
  readonly config?: ApprovalPanelConfig;
  readonly viewModel?: ApprovalPresentationViewModel;
  readonly model?: ApprovalPanelSerializedModel;
  readonly isLoading?: boolean;
  readonly error?: string;
}

function buildApprovalPanelModel(
  viewModel: ApprovalPresentationViewModel | undefined,
  fallbackModel: ApprovalPanelSerializedModel | undefined,
): ApprovalPanelSerializedModel | null {
  if (!fallbackModel && !viewModel) {
    return null;
  }

  const model = fallbackModel;

  if (!viewModel) {
    return model ?? null;
  }

  if (!model) {
    return null;
  }

  const approvalProjection = viewModel.payload.approvalProjection;

  return {
    ...model,
    summary: {
      ...model.summary,
      approval: {
        ...model.summary.approval,
        approvalId: approvalProjection.approvalId,
        title: approvalProjection.title,
        status: approvalProjection.status,
        currentStage: approvalProjection.currentStage,
        currentDecision: approvalProjection.currentDecision,
        createdAt: approvalProjection.metadata.generatedAt,
      },
    },
  };
}

export default function ApprovalPanel({
  config = approvalPanelConfig,
  viewModel,
  model,
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
  if (!presentationModel) {
    return (
      <SectionCard title={config.title} subtitle={config.subtitle}>
        <PanelEmptyState message="Approval data is not available in the current workspace context." />
      </SectionCard>
    );
  }

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
