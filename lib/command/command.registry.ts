import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardPlus,
  FileUp,
  Files,
  FolderKanban,
  LayoutDashboard,
  LineChart,
} from "lucide-react";
import type {
  CommandDescriptor,
  CommandRegistry,
  CommandSearchProvider,
  QuickActionDescriptor,
} from "@/lib/command/command.types";

export const commandRegistryEntries: readonly CommandDescriptor[] = [
  {
    id: "open-dashboard",
    title: "Open Dashboard",
    description: "Navigate to the institutional dashboard workspace.",
    category: "Reports",
    icon: LayoutDashboard,
    keywords: ["home", "overview"],
  },
  {
    id: "open-customer-workspace",
    title: "Open Customer Workspace",
    description: "Navigate to the customer workspace and institutional profile view.",
    category: "Customers",
    icon: Building2,
    keywords: ["client", "institution", "workspace"],
  },
  {
    id: "new-customer",
    title: "New Customer",
    description: "Start a new customer onboarding entry point.",
    category: "Customers",
    icon: ClipboardPlus,
    keywords: ["create", "onboarding"],
  },
  {
    id: "upload-documents",
    title: "Upload Documents",
    description: "Open the document upload and classification workspace.",
    category: "Documents",
    icon: FileUp,
    keywords: ["vault", "files"],
  },
  {
    id: "open-deals",
    title: "Open Deals",
    description: "Navigate to active deal work queues and pipelines.",
    category: "Deals",
    icon: BriefcaseBusiness,
    keywords: ["pipeline", "commercial"],
  },
  {
    id: "create-approval",
    title: "Create Approval",
    description: "Create a new institutional approval request package.",
    category: "Approvals",
    icon: CheckCircle2,
    keywords: ["request", "governance"],
  },
  {
    id: "open-tasks",
    title: "Open Tasks",
    description: "Navigate to assigned operational and governance tasks.",
    category: "Tasks",
    icon: FolderKanban,
    keywords: ["work queue", "assignments"],
  },
  {
    id: "generate-report",
    title: "Generate Report",
    description: "Open reporting workspace for institutional summaries.",
    category: "Reports",
    icon: LineChart,
    keywords: ["summary", "executive"],
  },
  {
    id: "open-funding",
    title: "Open Funding Workspace",
    description: "Navigate to funding objectives and readiness workspace.",
    category: "Funding",
    icon: Files,
    keywords: ["capital", "liquidity"],
  },
];

export const quickActionsRegistry: readonly QuickActionDescriptor[] = [
  {
    id: "quick-new-customer",
    title: "New Customer",
    description: "Start a new customer onboarding workflow.",
    icon: ClipboardPlus,
    commandId: "new-customer",
  },
  {
    id: "quick-upload-documents",
    title: "Upload Documents",
    description: "Open document upload and indexing workspace.",
    icon: FileUp,
    commandId: "upload-documents",
  },
  {
    id: "quick-open-dashboard",
    title: "Open Dashboard",
    description: "Navigate to institutional dashboard overview.",
    icon: LayoutDashboard,
    commandId: "open-dashboard",
  },
  {
    id: "quick-open-customer-workspace",
    title: "Open Customer Workspace",
    description: "Open institutional customer workspace context.",
    icon: Building2,
    commandId: "open-customer-workspace",
  },
  {
    id: "quick-create-approval",
    title: "Create Approval",
    description: "Initiate a new approval package.",
    icon: CheckCircle2,
    commandId: "create-approval",
  },
  {
    id: "quick-generate-report",
    title: "Generate Report",
    description: "Open report generation workspace.",
    icon: LineChart,
    commandId: "generate-report",
  },
];

const noopSearchProviders: readonly CommandSearchProvider[] = [];

export const commandRegistry: CommandRegistry = {
  commands: commandRegistryEntries,
  quickActions: quickActionsRegistry,
  searchProviders: noopSearchProviders,
};
