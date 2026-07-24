"use client";

import React from "react";
import ApprovalDecisionCard from "@/components/customer/approval/ApprovalDecisionCard";
import ApprovalHeader from "@/components/customer/approval/ApprovalHeader";
import ApprovalHistory from "@/components/customer/approval/ApprovalHistory";
import ApprovalParticipants from "@/components/customer/approval/ApprovalParticipants";
import ApprovalStageTimeline from "@/components/customer/approval/ApprovalStageTimeline";
import ApprovalSummaryCard from "@/components/customer/approval/ApprovalSummaryCard";
import { approvalPanelConfig, defaultApprovalPanelModel } from "@/lib/customer/approval/approval-panel.config";
import type { ApprovalPanelConfig, ApprovalPanelModel } from "@/lib/customer/approval/approval-panel.types";

export interface ApprovalPanelProps {
  readonly config?: ApprovalPanelConfig;
  readonly model?: ApprovalPanelModel;
}

export default function ApprovalPanel({
  config = approvalPanelConfig,
  model = defaultApprovalPanelModel,
}: ApprovalPanelProps) {
  return (
    <div className="space-y-4">
      <ApprovalHeader config={config} summary={model.summary} />
      <ApprovalSummaryCard config={config} summary={model.summary} />
      <ApprovalStageTimeline config={config} stages={model.stages} />
      <ApprovalParticipants config={config} participants={model.participants} />
      <ApprovalHistory config={config} events={model.history} />
      <ApprovalDecisionCard config={config} action={model.nextAction} />
    </div>
  );
}
