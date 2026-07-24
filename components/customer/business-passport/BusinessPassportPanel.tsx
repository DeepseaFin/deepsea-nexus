"use client";

import React from "react";
import BusinessPassportHeader from "@/components/customer/business-passport/BusinessPassportHeader";
import BusinessPassportInsights from "@/components/customer/business-passport/BusinessPassportInsights";
import BusinessPassportProgress from "@/components/customer/business-passport/BusinessPassportProgress";
import BusinessPassportSections from "@/components/customer/business-passport/BusinessPassportSections";
import BusinessPassportStatusCard from "@/components/customer/business-passport/BusinessPassportStatusCard";
import {
  defaultPassportPanelModel,
  defaultPassportPanelStates,
  passportPanelConfig,
} from "@/lib/customer/business-passport/passport-panel.config";
import type {
  PassportPanelConfig,
  PassportPanelModel,
  PassportPanelStatus,
} from "@/lib/customer/business-passport/passport-panel.types";

export interface BusinessPassportPanelProps {
  readonly model?: PassportPanelModel;
  readonly config?: PassportPanelConfig;
  readonly statusStates?: readonly PassportPanelStatus[];
}

export default function BusinessPassportPanel({
  model = defaultPassportPanelModel,
  config = passportPanelConfig,
  statusStates = defaultPassportPanelStates,
}: BusinessPassportPanelProps) {
  return (
    <div className="space-y-4">
      <BusinessPassportHeader config={config} model={model} />

      <BusinessPassportStatusCard config={config} status={model.panelStatus} states={statusStates} />

      <BusinessPassportProgress config={config} model={model} />

      <BusinessPassportSections config={config} model={model} />

      <BusinessPassportInsights config={config} recommendations={model.insights} />
    </div>
  );
}
