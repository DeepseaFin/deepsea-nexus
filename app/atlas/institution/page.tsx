import InstitutionWorkspace from "@/src/capabilities/institution/components/InstitutionWorkspace";
import type { InstitutionWorkspaceState } from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

const INSTITUTION_WORKSPACE_STATE: InstitutionWorkspaceState = {
  institutionId: "INS-2401",
  institutionName: "Deepsea Institutional Governance Office",
  classification: "Foundational Institutional Domain",
  status: "Active",
  version: "2.0.0",
  reviewedAt: "2026-07-15",
  navigation: [
    { key: "dashboard", label: "Dashboard" },
    { key: "timeline", label: "Timeline" },
    { key: "health", label: "Health" },
    { key: "documents", label: "Documents" },
    { key: "decisions", label: "Decision Feed" },
    { key: "knowledge", label: "Knowledge Graph" },
    { key: "advisor", label: "AI Advisor" },
  ],
  kpis: [
    { label: "Institutional Domains", value: "7", note: "Doctrine, Constitution, Policy, Governance, Stewardship, Memory, Academy" },
    { label: "Controlled Documents", value: "42", note: "Active constitutional and standards-linked artifacts" },
    { label: "Governance Coverage", value: "96%", note: "Repository records mapped to domain contracts" },
    { label: "Review Discipline", value: "Quarterly", note: "Next review cycle tracked in legacy controls" },
  ],
  timeline: [
    {
      id: "TL-001",
      timestamp: "2026-07-15T08:00:00Z",
      title: "Institutional core baseline accepted",
      actor: "Repository Custodian Council",
      detail: "Shared kernel contracts aligned with institutional module boundaries.",
    },
    {
      id: "TL-002",
      timestamp: "2026-07-15T09:20:00Z",
      title: "Charter publication architecture approved",
      actor: "Founder Office",
      detail: "Back matter structure separated from constitutional chapter sequence.",
    },
    {
      id: "TL-003",
      timestamp: "2026-07-15T10:40:00Z",
      title: "Knowledge graph standards integrated",
      actor: "Knowledge Architecture",
      detail: "Ontology and metadata standards linked to institutional governance artifacts.",
    },
  ],
  health: {
    score: 92,
    status: "strong",
    reviewedAt: "2026-07-15",
    metrics: [
      { id: "HM-1", label: "Governance Integrity", value: "Strong", trend: "Stable quarter-over-quarter", status: "strong" },
      { id: "HM-2", label: "Document Freshness", value: "Watch", trend: "Two domains due for review", status: "watch" },
      { id: "HM-3", label: "Decision Traceability", value: "Strong", trend: "Full linkage to registry records", status: "strong" },
      { id: "HM-4", label: "Control Exceptions", value: "1 Open", trend: "Target closure within cycle", status: "watch" },
    ],
  },
  documents: [
    { id: "DOC-001", title: "DS-CHR-001 The Charter of Deepsea", classification: "Charter", status: "draft", version: "2.0.0", reviewedAt: "2026-07-15" },
    { id: "DOC-002", title: "DS-000 Deepsea Doctrine", classification: "Doctrine", status: "draft", version: "1.0.0", reviewedAt: "2026-07-15" },
    { id: "DOC-003", title: "Knowledge Graph Standard", classification: "Standard", status: "active", version: "1.0.0", reviewedAt: "2026-07-14" },
    { id: "DOC-004", title: "Document Standard", classification: "Standard", status: "active", version: "1.0.0", reviewedAt: "2026-07-14" },
  ],
  decisionFeed: [
    {
      id: "DEC-101",
      title: "Adopt institutional kernel for domain contracts",
      outcome: "Approved",
      owner: "Chief Knowledge Architect",
      decidedAt: "2026-07-15",
    },
    {
      id: "DEC-102",
      title: "Enforce back matter separation in constitutional publications",
      outcome: "Approved",
      owner: "Founder",
      decidedAt: "2026-07-15",
    },
    {
      id: "DEC-103",
      title: "Promote metadata compliance checks to required gate",
      outcome: "In Review",
      owner: "Governance Office",
      decidedAt: "2026-07-15",
    },
  ],
  knowledgeGraph: {
    nodes: [
      { id: "N-CHR", label: "Charter", type: "Institution Document" },
      { id: "N-DOC", label: "Document Standard", type: "Governance Standard" },
      { id: "N-KGS", label: "Knowledge Graph Standard", type: "Knowledge Standard" },
      { id: "N-REV", label: "Review Workflow", type: "Procedure" },
    ],
    edges: [
      { sourceId: "N-CHR", targetId: "N-DOC", relation: "governed_by" },
      { sourceId: "N-CHR", targetId: "N-KGS", relation: "indexed_by" },
      { sourceId: "N-DOC", targetId: "N-REV", relation: "implemented_by" },
    ],
  },
  aiAdvisor: {
    summary: "Institutional posture remains strong. Prioritize review-cycle closure for open watch items.",
    recommendations: [
      "Close pending control exception and attach rationale to decision feed.",
      "Advance DS-CHR-001 from draft after signature workflow completes.",
      "Run cross-reference audit before next publication cycle.",
    ],
    alerts: [
      "Document freshness threshold is nearing policy limit in one subdomain.",
      "One decision record remains in review without final outcome tag.",
    ],
  },
};

export default function InstitutionPage() {
  return <InstitutionWorkspace initialState={INSTITUTION_WORKSPACE_STATE} />;
}
