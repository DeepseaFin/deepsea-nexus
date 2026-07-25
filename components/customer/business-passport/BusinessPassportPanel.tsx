"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import { PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
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

function resolvePanelStatus(status: string): PassportPanelStatus {
  const normalized = status.toLowerCase();

  if (normalized.includes("draft")) {
    return "Draft";
  }

  if (normalized.includes("approve") || normalized.includes("verified")) {
    return "Approved";
  }

  if (normalized.includes("archive")) {
    return "Archived";
  }

  return "In Review";
}

export interface BusinessPassportPanelProps {
  readonly viewModel?: BusinessPassportPresentationViewModel;
  readonly model?: PassportPanelModel;
  readonly config?: PassportPanelConfig;
  readonly statusStates?: readonly PassportPanelStatus[];
  readonly isLoading?: boolean;
  readonly error?: string;
}

function buildPresentationModel(
  viewModel: BusinessPassportPresentationViewModel,
  fallbackModel: PassportPanelModel,
): PassportPanelModel {
  const projection = viewModel.payload.projection;
  const confidence = Number(projection.confidenceScore);

  return {
    ...fallbackModel,
    panelStatus: resolvePanelStatus(String(projection.status)),
    completionPercent: confidence,
    completionLabel: `${confidence}% confidence`,
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
        audit: {
          ...fallbackModel.passport.metadata.audit,
          updatedAt: projection.updatedAt,
        },
      },
    },
    insights: [],
  };
}

export default function BusinessPassportPanel({
  viewModel,
  model = defaultPassportPanelModel,
  config = passportPanelConfig,
  statusStates = defaultPassportPanelStates,
  isLoading = false,
  error,
}: BusinessPassportPanelProps) {
  if (isLoading) {
    return <PanelLoadingState title={config.heading} subtitle={config.subtitle} />;
  }

  if (error) {
    return <PanelErrorState title={config.heading} subtitle={config.subtitle} message={error} />;
  }

  if (!viewModel) {
    return (
      <SectionCard title={config.heading} subtitle={config.subtitle}>
        <PanelEmptyState message="Business Passport data is not available in the current presentation context." />
      </SectionCard>
    );
  }

  const presentationModel = buildPresentationModel(viewModel, model);

  return (
    <div className="space-y-4">
      <BusinessPassportHeader config={config} model={presentationModel} />

      <BusinessPassportStatusCard config={config} status={presentationModel.panelStatus} states={statusStates} />

      <BusinessPassportProgress config={config} model={presentationModel} />

      <BusinessPassportSections viewModel={viewModel} />

      <BusinessPassportInsights config={config} recommendations={presentationModel.insights} />
    </div>
  );
}
