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

export interface FundingPanelProps {
  readonly config?: FundingPanelConfig;
  readonly model?: FundingPanelModel;
}

export default function FundingPanel({ config = fundingPanelConfig, model = defaultFundingPanelModel }: FundingPanelProps) {
  return (
    <div className="space-y-4">
      <FundingHeader config={config} />
      <FundingSummaryCard config={config} summary={model.summary} />
      <FundingReadinessCard config={config} readiness={model.readiness} />
      <FacilityOverview config={config} facilities={model.facilities} />
      <FundingTimeline config={config} events={model.timeline} />
      <FundingActions config={config} actions={model.actions} />
    </div>
  );
}
