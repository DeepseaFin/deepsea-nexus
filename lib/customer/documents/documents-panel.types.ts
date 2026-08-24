import type { DocumentRecord } from "@/lib/documents/documentRepository";
import type { Evidence } from "@/lib/evidence/domain/Evidence";

export const DOCUMENT_STATUS_STATES = [
  "Uploaded",
  "Processing",
  "Verified",
  "Rejected",
  "Expired",
  "Required",
] as const;

export type DocumentUiStatus = (typeof DOCUMENT_STATUS_STATES)[number];

export interface DocumentsPanelHeaderModel {
  readonly title: string;
  readonly subtitle: string;
  readonly workspaceLabel?: string;
}

export interface DocumentMetricItem {
  readonly id: string;
  readonly label: "Total Documents" | "Verified" | "Pending" | "Missing" | "Expiring";
  readonly value: string;
}

export type DocumentPortfolioSummary = readonly DocumentMetricItem[];

export type DocumentStatusItem = Pick<DocumentRecord, "id" | "document_code" | "document_type" | "status" | "updated_at"> & {
  readonly title: string;
  readonly uiStatus: DocumentUiStatus;
};

export interface DocumentChecklistItem {
  readonly id: string;
  readonly documentName: string;
  readonly status: DocumentUiStatus;
  readonly required: boolean;
  readonly lastUpdated: string;
}

export interface MissingDocumentItem {
  readonly id: string;
  readonly documentName: string;
  readonly reason: string;
  readonly dueLabel?: string;
}

export interface DocumentTimelineEvent {
  readonly id: string;
  readonly timestamp: string;
  readonly title: string;
  readonly description: string;
  readonly actor?: string;
  readonly relatedDocumentName?: string;
}

export type DocumentEvidenceSummary = Pick<Evidence, "evidenceId" | "status" | "metadata">;

export interface DocumentEvidenceSummarySerialized {
  readonly evidenceId: string;
  readonly status: DocumentEvidenceSummary["status"];
  readonly metadata: DocumentEvidenceSummary["metadata"];
}

export interface DocumentsPanelConfig {
  readonly header: DocumentsPanelHeaderModel;
  readonly summaryTitle: string;
  readonly summarySubtitle: string;
  readonly statusListTitle: string;
  readonly statusListSubtitle: string;
  readonly checklistTitle: string;
  readonly checklistSubtitle: string;
  readonly missingTitle: string;
  readonly missingSubtitle: string;
  readonly timelineTitle: string;
  readonly timelineSubtitle: string;
}

export interface DocumentsPanelModel {
  readonly summary: DocumentPortfolioSummary;
  readonly statuses: readonly DocumentStatusItem[];
  readonly checklist: readonly DocumentChecklistItem[];
  readonly missingDocuments: readonly MissingDocumentItem[];
  readonly timeline: readonly DocumentTimelineEvent[];
  readonly evidenceSummary?: readonly DocumentEvidenceSummary[];
}

export interface DocumentsPanelClientModel {
  readonly summary: DocumentPortfolioSummary;
  readonly statuses: readonly DocumentStatusItem[];
  readonly checklist: readonly DocumentChecklistItem[];
  readonly missingDocuments: readonly MissingDocumentItem[];
  readonly timeline: readonly DocumentTimelineEvent[];
  readonly evidenceSummary?: readonly DocumentEvidenceSummarySerialized[];
}
