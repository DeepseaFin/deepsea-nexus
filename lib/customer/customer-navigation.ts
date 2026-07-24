import type { CustomerWorkspaceTab } from "@/lib/customer/customer-workspace.types";

export const customerWorkspaceTabs: readonly CustomerWorkspaceTab[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Cross-capability customer snapshot",
  },
  {
    id: "business-passport",
    label: "Business Passport",
    description: "Identity, governance, and profile context",
  },
  {
    id: "documents",
    label: "Documents",
    description: "Document vault and intelligence surface",
  },
  {
    id: "relationship",
    label: "Relationship",
    description: "Coverage model and engagement trail",
  },
  {
    id: "approvals",
    label: "Approvals",
    description: "Approval workflows and decisions",
  },
  {
    id: "funding",
    label: "Funding",
    description: "Funding readiness and options",
  },
  {
    id: "timeline",
    label: "Timeline",
    description: "Milestones and operational chronology",
  },
];
