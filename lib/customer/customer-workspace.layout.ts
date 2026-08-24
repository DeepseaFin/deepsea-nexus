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
    lifecycleStageLabel: "Business Passport",
    fundingReadinessLabel: "Unknown",
    criticalBlockerLabels: ["Business Passport"],
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
        "Unified customer context surface for metrics, health, and next actions across onboarding and decision workflows.",
      readinessLabel: "Operational overview active",
    },
    "business-passport": {
      id: "business-passport",
      heading: "Business Passport",
      description:
        "Business identity profile, governance posture, and lifecycle confidence for institutional decisioning.",
      readinessLabel: "Business Passport context active",
    },
    documents: {
      id: "documents",
      heading: "Documents",
      description:
        "Document vault, ingestion, classification, and evidence intelligence for onboarding and approvals.",
      readinessLabel: "Document intelligence active",
    },
    relationship: {
      id: "relationship",
      heading: "Relationship",
      description:
        "Relationship coverage, key contacts, and interaction narratives across institutional teams.",
      readinessLabel: "Relationship context active",
    },
    approvals: {
      id: "approvals",
      heading: "Approvals",
      description:
        "Approval workstreams, governance stages, and pending decision context for execution.",
      readinessLabel: "Approval workflow active",
    },
    funding: {
      id: "funding",
      heading: "Funding",
      description:
        "Funding readiness, opportunity tracking, and liquidity planning for customer outcomes.",
      readinessLabel: "Funding readiness context active",
    },
    "ai-insights": {
      id: "ai-insights",
      heading: "AI Insights",
      description:
        "Recommendation intelligence, confidence signals, and suggested operational actions.",
      readinessLabel: "Intelligence guidance active",
    },
    timeline: {
      id: "timeline",
      heading: "Timeline",
      description:
        "Chronological milestones, institutional events, and audit-visible relationship progression.",
      readinessLabel: "Event timeline active",
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
            value: "Identity and lifecycle signals available",
          },
          {
            id: "document-intel",
            label: "Document Intelligence",
            value: "Evidence and classification context available",
          },
          {
            id: "approvals",
            label: "Approvals",
            value: "Governance decision context available",
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
            value: "Profile and status signals available",
          },
          {
            id: "governance",
            label: "Governance",
            value: "Governance posture signals available",
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
