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

export interface DocumentsPanelProps {
  readonly config?: DocumentsPanelConfig;
  readonly model?: DocumentsPanelModel;
}

export default function DocumentsPanel({
  config = documentsPanelConfig,
  model = defaultDocumentsPanelModel,
}: DocumentsPanelProps) {
  return (
    <div className="space-y-4">
      <DocumentsHeader model={config.header} />

      <DocumentSummaryCard title={config.summaryTitle} subtitle={config.summarySubtitle} metrics={model.summary} />

      <DocumentStatusList title={config.statusListTitle} subtitle={config.statusListSubtitle} items={model.statuses} />

      <DocumentChecklist title={config.checklistTitle} subtitle={config.checklistSubtitle} items={model.checklist} />

      <MissingDocumentsCard title={config.missingTitle} subtitle={config.missingSubtitle} items={model.missingDocuments} />

      <DocumentTimeline title={config.timelineTitle} subtitle={config.timelineSubtitle} events={model.timeline} />
    </div>
  );
}
