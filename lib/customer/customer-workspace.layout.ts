import { Bot, FileUp, FileWarning, Sparkles } from "lucide-react";
import type {
  CustomerSummaryModel,
  CustomerWorkspaceAction,
  CustomerWorkspaceLayoutConfig,
} from "@/lib/customer/customer-workspace.types";
import { customerWorkspaceTabs } from "@/lib/customer/customer-navigation";

export const defaultCustomerSummary: CustomerSummaryModel = {
  customerName: "Northwind Maritime Holdings",
  status: {
    label: "Active",
    variant: "success",
  },
  relationshipManager: "Ariane D.",
  industry: "Maritime Logistics",
  country: "Singapore",
  risk: {
    label: "Moderate",
    variant: "warning",
  },
  fundingPotential: "USD 48M",
  onboardingProgress: {
    overallCompletionPercent: 0,
    currentStageLabel: "Business Passport",
    blockedStageLabels: ["Business Passport"],
    recommendedNextStageLabel: "Business Passport",
  },
};

export const defaultCustomerActions: readonly CustomerWorkspaceAction[] = [
  {
    id: "upload-documents",
    label: "Upload Documents",
    description: "Open document intake and classification",
    icon: FileUp,
    eventType: "customer.action.upload-documents",
  },
  {
    id: "request-approval",
    label: "Request Approval",
    description: "Open approval request package flow",
    icon: FileWarning,
    eventType: "customer.action.request-approval",
  },
  {
    id: "generate-report",
    label: "Generate Report",
    description: "Prepare customer workspace summary report",
    icon: Sparkles,
    eventType: "customer.action.generate-report",
  },
  {
    id: "open-ai-assistant",
    label: "Open AI Assistant",
    description: "Open AI copilot context for this workspace",
    icon: Bot,
    eventType: "customer.action.open-ai-assistant",
  },
];

export const customerWorkspaceLayout: CustomerWorkspaceLayoutConfig = {
  tabs: customerWorkspaceTabs,
  defaultTabId: "overview",
  tabContent: {
    overview: {
      id: "overview",
      heading: "Customer Overview",
      description:
        "Unified customer context surface for metrics, health, and next actions. This area is ready for capability modules.",
      readinessLabel: "Ready for capability composition",
    },
    "business-passport": {
      id: "business-passport",
      heading: "Business Passport",
      description:
        "Reserved panel for Business Passport identity profile integration with canonical institution and governance data.",
      readinessLabel: "Ready for Business Passport integration",
    },
    documents: {
      id: "documents",
      heading: "Documents",
      description:
        "Reserved panel for document vault, ingestion, classification, and evidence intelligence components.",
      readinessLabel: "Ready for Document Intelligence integration",
    },
    relationship: {
      id: "relationship",
      heading: "Relationship",
      description:
        "Reserved panel for relationship coverage, contacts, and interaction narratives across internal teams.",
      readinessLabel: "Ready for relationship capability modules",
    },
    approvals: {
      id: "approvals",
      heading: "Approvals",
      description:
        "Reserved panel for approval workstreams, governance stages, and pending decision context.",
      readinessLabel: "Ready for approval capability modules",
    },
    funding: {
      id: "funding",
      heading: "Funding",
      description:
        "Reserved panel for funding readiness, opportunity tracking, and liquidity planning components.",
      readinessLabel: "Ready for funding capability modules",
    },
    "ai-insights": {
      id: "ai-insights",
      heading: "AI Insights",
      description:
        "Reserved panel for recommendation intelligence, confidence signals, and suggested operational actions.",
      readinessLabel: "Ready for intelligence service integration",
    },
    timeline: {
      id: "timeline",
      heading: "Timeline",
      description:
        "Reserved panel for chronological milestones, events, and audit-visible relationship progression.",
      readinessLabel: "Ready for timeline and event projections",
    },
  },
  sidebarSections: {
    overview: [
      {
        id: "overview-readiness",
        title: "Workspace Readiness",
        items: [
          {
            id: "passport",
            label: "Business Passport",
            value: "Integration slot prepared",
          },
          {
            id: "document-intel",
            label: "Document Intelligence",
            value: "Integration slot prepared",
          },
          {
            id: "approvals",
            label: "Approvals",
            value: "Panel placeholder configured",
          },
        ],
      },
    ],
    "business-passport": [
      {
        id: "passport-context",
        title: "Identity Context",
        items: [
          {
            id: "entity-profile",
            label: "Entity Profile",
            value: "Awaiting capability composition",
          },
          {
            id: "governance",
            label: "Governance",
            value: "Awaiting capability composition",
          },
        ],
      },
    ],
    documents: [
      {
        id: "documents-context",
        title: "Document Operations",
        items: [
          {
            id: "vault",
            label: "Document Vault",
            value: "Ready",
          },
          {
            id: "classification",
            label: "Classification",
            value: "Ready",
          },
        ],
      },
    ],
    relationship: [
      {
        id: "relationship-context",
        title: "Relationship Signals",
        items: [
          {
            id: "coverage",
            label: "Coverage",
            value: "Ready",
          },
          {
            id: "interactions",
            label: "Interactions",
            value: "Ready",
          },
        ],
      },
    ],
    approvals: [
      {
        id: "approvals-context",
        title: "Approval Stream",
        items: [
          {
            id: "pending-queue",
            label: "Pending Queue",
            value: "Ready",
          },
          {
            id: "governance-stage",
            label: "Governance Stage",
            value: "Ready",
          },
        ],
      },
    ],
    funding: [
      {
        id: "funding-context",
        title: "Funding Signals",
        items: [
          {
            id: "readiness",
            label: "Readiness",
            value: "Ready",
          },
          {
            id: "pipeline",
            label: "Pipeline",
            value: "Ready",
          },
        ],
      },
    ],
    "ai-insights": [
      {
        id: "insights-context",
        title: "Insights Signals",
        items: [
          {
            id: "recommendations",
            label: "Recommendations",
            value: "Ready",
          },
          {
            id: "confidence",
            label: "Confidence",
            value: "Ready",
          },
        ],
      },
    ],
    timeline: [
      {
        id: "timeline-context",
        title: "Chronology",
        items: [
          {
            id: "events",
            label: "Events",
            value: "Ready",
          },
          {
            id: "audit",
            label: "Audit Trail",
            value: "Ready",
          },
        ],
      },
    ],
  },
};
