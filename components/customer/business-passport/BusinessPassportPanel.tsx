"use client";

import React from "react";
import BusinessPassportHeader from "@/components/customer/business-passport/BusinessPassportHeader";
import BusinessPassportInsights from "@/components/customer/business-passport/BusinessPassportInsights";
import BusinessPassportProgress from "@/components/customer/business-passport/BusinessPassportProgress";
import BusinessPassportSections from "@/components/customer/business-passport/BusinessPassportSections";
import BusinessPassportStatusCard from "@/components/customer/business-passport/BusinessPassportStatusCard";
import type { BusinessPassportPresentationViewModel } from "@/lib/presentation/presenters/BusinessPassportPresenter";
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
  readonly viewModel?: BusinessPassportPresentationViewModel;
  readonly model?: PassportPanelModel;
  readonly config?: PassportPanelConfig;
  readonly statusStates?: readonly PassportPanelStatus[];
}

function buildPresentationModel(
  viewModel: BusinessPassportPresentationViewModel,
  fallbackModel: PassportPanelModel,
): PassportPanelModel {
  const projection = viewModel.payload.projection;

  return {
    ...fallbackModel,
    passport: {
      ...fallbackModel.passport,
      passportId: projection.passportId,
      status: projection.status,
      lifecycle: projection.lifecycle,
      confidence: {
        ...fallbackModel.passport.confidence,
        score: projection.confidenceScore,
      },
      knowledgeDensity: {
        ...fallbackModel.passport.knowledgeDensity,
        band: projection.knowledgeDensityBand,
      },
      metadata: {
        ...fallbackModel.passport.metadata,
      },
    },
  };
}

export default function BusinessPassportPanel({
  viewModel,
  model = defaultPassportPanelModel,
  config = passportPanelConfig,
  statusStates = defaultPassportPanelStates,
}: BusinessPassportPanelProps) {
  const presentationModel = viewModel ? buildPresentationModel(viewModel, model) : model;

  return (
    <div className="space-y-4">
      <BusinessPassportHeader config={config} model={presentationModel} />

      <BusinessPassportStatusCard config={config} status={presentationModel.panelStatus} states={statusStates} />

      <BusinessPassportProgress config={config} model={presentationModel} />

      <BusinessPassportSections config={config} model={presentationModel} />

      <BusinessPassportInsights config={config} recommendations={presentationModel.insights} />
    </div>
  );
}
