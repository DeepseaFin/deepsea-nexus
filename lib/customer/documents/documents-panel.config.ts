import { EvidenceStatus } from "@/lib/evidence/constants/EvidenceStatus";
import { EvidenceId } from "@/lib/evidence/value-objects/EvidenceId";
import type {
  DocumentsPanelConfig,
  DocumentsPanelModel,
  DocumentUiStatus,
} from "@/lib/customer/documents/documents-panel.types";

export const documentsPanelConfig: DocumentsPanelConfig = {
  header: {
    title: "Document Intelligence",
    subtitle: "ORACLE document portfolio visibility for the active customer workspace",
    workspaceLabel: "Customer Documents Surface",
  },
  summaryTitle: "Portfolio Summary",
  summarySubtitle: "Operational metrics supplied by upstream integrations",
  statusListTitle: "Verification Status",
  statusListSubtitle: "Document lifecycle visibility for processing and validation",
  checklistTitle: "Document Checklist",
  checklistSubtitle: "Configuration-driven required and optional document readiness list",
  missingTitle: "Missing Documents",
  missingSubtitle: "Outstanding document requirements pending upload or verification",
  timelineTitle: "Recent Activity Timeline",
  timelineSubtitle: "Generic document events prepared for ORACLE, Evidence, and Knowledge overlays",
};

export const defaultDocumentStatusStates: readonly DocumentUiStatus[] = [
  "Uploaded",
  "Processing",
  "Verified",
  "Rejected",
  "Expired",
  "Required",
];

export const defaultDocumentsPanelModel: DocumentsPanelModel = {
  summary: [
    { id: "metric-total", label: "Total Documents", value: "42" },
    { id: "metric-verified", label: "Verified", value: "26" },
    { id: "metric-pending", label: "Pending", value: "9" },
    { id: "metric-missing", label: "Missing", value: "5" },
    { id: "metric-expiring", label: "Expiring", value: "2" },
  ],
  statuses: [
    {
      id: "doc-status-1",
      document_code: "DOC-TRD-014",
      document_type: "Trade License",
      status: "UPLOADED",
      updated_at: "2026-07-21T09:10:00.000Z",
      title: "Trade License",
      uiStatus: "Uploaded",
    },
    {
      id: "doc-status-2",
      document_code: "DOC-AUD-002",
      document_type: "Audited Financials",
      status: "PROCESSING",
      updated_at: "2026-07-21T11:45:00.000Z",
      title: "Audited Financials 2025",
      uiStatus: "Processing",
    },
    {
      id: "doc-status-3",
      document_code: "DOC-UBO-101",
      document_type: "UBO Declaration",
      status: "VERIFIED",
      updated_at: "2026-07-20T16:18:00.000Z",
      title: "Ultimate Beneficial Ownership Declaration",
      uiStatus: "Verified",
    },
    {
      id: "doc-status-4",
      document_code: "DOC-COMP-007",
      document_type: "Compliance Certificate",
      status: "REJECTED",
      updated_at: "2026-07-19T14:02:00.000Z",
      title: "Compliance Certificate",
      uiStatus: "Rejected",
    },
    {
      id: "doc-status-5",
      document_code: "DOC-SAN-998",
      document_type: "Sanctions Screening",
      status: "EXPIRED",
      updated_at: "2026-07-18T08:52:00.000Z",
      title: "Sanctions Screening Record",
      uiStatus: "Expired",
    },
  ],
  checklist: [
    {
      id: "checklist-1",
      documentName: "Trade License",
      status: "Verified",
      required: true,
      lastUpdated: "2026-07-20T10:22:00.000Z",
    },
    {
      id: "checklist-2",
      documentName: "Audited Financial Statements",
      status: "Processing",
      required: true,
      lastUpdated: "2026-07-21T11:45:00.000Z",
    },
    {
      id: "checklist-3",
      documentName: "Ultimate Beneficial Ownership Declaration",
      status: "Required",
      required: true,
      lastUpdated: "2026-07-17T07:00:00.000Z",
    },
    {
      id: "checklist-4",
      documentName: "Board Resolution",
      status: "Uploaded",
      required: false,
      lastUpdated: "2026-07-19T13:20:00.000Z",
    },
  ],
  missingDocuments: [
    {
      id: "missing-1",
      documentName: "Ultimate Beneficial Ownership Declaration",
      reason: "Required for verification completion",
      dueLabel: "Due in 3 days",
    },
    {
      id: "missing-2",
      documentName: "Tax Compliance Certificate",
      reason: "Not yet uploaded for current review cycle",
      dueLabel: "Due in 5 days",
    },
  ],
  timeline: [
    {
      id: "timeline-1",
      timestamp: "2026-07-21T11:45:00.000Z",
      title: "Document entered ORACLE processing",
      description: "Audited Financial Statements are currently processing for extraction and validation.",
      actor: "ORACLE Pipeline",
      relatedDocumentName: "Audited Financial Statements",
    },
    {
      id: "timeline-2",
      timestamp: "2026-07-20T16:18:00.000Z",
      title: "Document verified",
      description: "UBO Declaration passed verification checks and was marked verified.",
      actor: "Evidence Validator",
      relatedDocumentName: "Ultimate Beneficial Ownership Declaration",
    },
    {
      id: "timeline-3",
      timestamp: "2026-07-19T14:02:00.000Z",
      title: "Verification rejected",
      description: "Compliance Certificate failed validation due to signature mismatch.",
      actor: "Operations Review",
      relatedDocumentName: "Compliance Certificate",
    },
  ],
  evidenceSummary: [
    {
      evidenceId: EvidenceId.create("ev:trade-license:2026:001"),
      status: EvidenceStatus.Valid,
      metadata: {
        documentId: "doc-trade-license",
        documentVersion: "v4",
        uploadedBy: "rm.ariane",
        uploadedAt: "2026-07-20T10:22:00.000Z",
        mimeType: "application/pdf",
        checksum: "sha256:trade-license-v4",
        sourceSystem: "oracle_document_upload",
        retentionPolicy: "institutional_default",
      },
    },
    {
      evidenceId: EvidenceId.create("ev:audited-fs:2026:002"),
      status: EvidenceStatus.PendingValidation,
      metadata: {
        documentId: "doc-audited-fs",
        documentVersion: "v1",
        uploadedBy: "ops.specialist",
        uploadedAt: "2026-07-21T11:45:00.000Z",
        mimeType: "application/pdf",
        checksum: "sha256:audited-fs-v1",
        sourceSystem: "oracle_document_upload",
        retentionPolicy: "institutional_default",
      },
    },
  ],
};
