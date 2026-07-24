"use client";

import React from "react";
import FacilityOverview from "@/components/customer/funding/FacilityOverview";
import FundingActions from "@/components/customer/funding/FundingActions";
import FundingHeader from "@/components/customer/funding/FundingHeader";
import FundingReadinessCard from "@/components/customer/funding/FundingReadinessCard";
import FundingSummaryCard from "@/components/customer/funding/FundingSummaryCard";
import FundingTimeline from "@/components/customer/funding/FundingTimeline";
import { defaultFundingPanelModel, fundingPanelConfig } from "@/lib/customer/funding/funding-panel.config";
import type { FundingPanelConfig, FundingPanelModel } from "@/lib/customer/funding/funding-panel.types";
import type { FundingPresentationViewModel } from "@/lib/presentation/presenters/FundingPresenter";

export interface FundingPanelProps {
  readonly config?: FundingPanelConfig;
  readonly viewModel?: FundingPresentationViewModel;
  readonly model?: FundingPanelModel;
}

function buildFundingPanelModel(
  viewModel: FundingPresentationViewModel | undefined,
  fallbackModel: FundingPanelModel,
): FundingPanelModel {
  return viewModel?.payload.panelModel ?? fallbackModel;
}

export default function FundingPanel({ config = fundingPanelConfig, viewModel, model = defaultFundingPanelModel }: FundingPanelProps) {
  const presentationModel = buildFundingPanelModel(viewModel, model);

  return (
    <div className="space-y-4">
      <FundingHeader config={config} />
      <FundingSummaryCard config={config} summary={presentationModel.summary} />
      <FundingReadinessCard config={config} readiness={presentationModel.readiness} />
      <FacilityOverview config={config} facilities={presentationModel.facilities} />
      <FundingTimeline config={config} events={presentationModel.timeline} />
      <FundingActions config={config} actions={presentationModel.actions} />
    </div>
  );
}
