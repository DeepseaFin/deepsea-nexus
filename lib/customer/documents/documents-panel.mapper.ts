import type {
  DocumentEvidenceSummary,
  DocumentEvidenceSummarySerialized,
  DocumentsPanelClientModel,
  DocumentsPanelModel,
} from "@/lib/customer/documents/documents-panel.types";

function toSerializedEvidenceSummary(
  item: DocumentEvidenceSummary,
): DocumentEvidenceSummarySerialized {
  return {
    evidenceId: item.evidenceId.toString(),
    status: item.status,
    metadata: item.metadata,
  };
}

export function toDocumentsPanelClientModel(
  model: DocumentsPanelModel,
): DocumentsPanelClientModel {
  return {
    summary: model.summary,
    statuses: model.statuses,
    checklist: model.checklist,
    missingDocuments: model.missingDocuments,
    timeline: model.timeline,
    evidenceSummary: model.evidenceSummary?.map(toSerializedEvidenceSummary),
  };
}
