"use client";

import React from "react";
import DocumentChecklist from "@/components/customer/documents/DocumentChecklist";
import DocumentsHeader from "@/components/customer/documents/DocumentsHeader";
import DocumentStatusList from "@/components/customer/documents/DocumentStatusList";
import DocumentSummaryCard from "@/components/customer/documents/DocumentSummaryCard";
import DocumentTimeline from "@/components/customer/documents/DocumentTimeline";
import MissingDocumentsCard from "@/components/customer/documents/MissingDocumentsCard";
import { defaultDocumentsPanelModel, documentsPanelConfig } from "@/lib/customer/documents/documents-panel.config";
import type { DocumentsPanelConfig, DocumentsPanelModel } from "@/lib/customer/documents/documents-panel.types";
import type { DocumentsPresentationViewModel } from "@/lib/presentation/presenters/DocumentsPresenter";

export interface DocumentsPanelProps {
  readonly config?: DocumentsPanelConfig;
  readonly viewModel?: DocumentsPresentationViewModel;
  readonly model?: DocumentsPanelModel;
}

function buildDocumentsPanelModel(
  viewModel: DocumentsPresentationViewModel | undefined,
  fallbackModel: DocumentsPanelModel,
): DocumentsPanelModel {
  return viewModel?.payload.panelModel ?? fallbackModel;
}

export default function DocumentsPanel({
  config = documentsPanelConfig,
  viewModel,
  model = defaultDocumentsPanelModel,
}: DocumentsPanelProps) {
  const panelModel = buildDocumentsPanelModel(viewModel, model);
  const headerModel = viewModel
    ? {
        ...config.header,
        title: viewModel.title,
        subtitle: viewModel.subtitle,
      }
    : config.header;

  return (
    <div className="space-y-4">
      <DocumentsHeader model={headerModel} />

      <DocumentSummaryCard title={config.summaryTitle} subtitle={config.summarySubtitle} metrics={panelModel.summary} />

      <DocumentStatusList title={config.statusListTitle} subtitle={config.statusListSubtitle} items={panelModel.statuses} />

      <DocumentChecklist title={config.checklistTitle} subtitle={config.checklistSubtitle} items={panelModel.checklist} />

      <MissingDocumentsCard
        title={config.missingTitle}
        subtitle={config.missingSubtitle}
        items={panelModel.missingDocuments}
      />

      <DocumentTimeline title={config.timelineTitle} subtitle={config.timelineSubtitle} events={panelModel.timeline} />
    </div>
  );
}
