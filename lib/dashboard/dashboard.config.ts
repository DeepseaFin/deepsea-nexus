import { BriefcaseBusiness, CalendarClock, FileCheck2, FolderCheck, ShieldCheck, Sparkles } from "lucide-react";
import type { DashboardLayoutConfig, DashboardPriorityAction, DashboardWorkspaceOption } from "@/lib/dashboard/dashboard.types";
import { createDashboardLayout, DEFAULT_WIDGET_ORDER } from "@/lib/dashboard/dashboard.layout";

export const DEFAULT_DASHBOARD_LAYOUT: DashboardLayoutConfig = createDashboardLayout(DEFAULT_WIDGET_ORDER);

export const DEFAULT_WORKSPACE_OPTIONS: readonly DashboardWorkspaceOption[] = [
  { id: "institution-overview", label: "Institution Overview" },
  { id: "commercial-operations", label: "Commercial Operations" },
  { id: "portfolio-governance", label: "Portfolio Governance" },
];

export const DEFAULT_PRIORITY_ACTIONS: readonly DashboardPriorityAction[] = [
  {
    id: "review-document-completeness",
    title: "Review document completeness",
    description: "Verify required documents for active workflows are complete and current.",
    severity: "warning",
    icon: FolderCheck,
    actionLabel: "Open Checklist",
  },
  {
    id: "prepare-approval-packages",
    title: "Prepare approval packages",
    description: "Prepare pending approval packages for institutional review sessions.",
    severity: "info",
    icon: FileCheck2,
    actionLabel: "View Approvals",
  },
  {
    id: "align-today-priorities",
    title: "Align today priorities",
    description: "Coordinate role-level priorities before customer and portfolio meetings.",
    severity: "default",
    icon: CalendarClock,
    actionLabel: "Open Agenda",
  },
  {
    id: "validate-risk-controls",
    title: "Validate risk controls",
    description: "Confirm governance and control checkpoints are in expected operational status.",
    severity: "success",
    icon: ShieldCheck,
    actionLabel: "Review Controls",
  },
  {
    id: "rebalance-pipeline-focus",
    title: "Rebalance pipeline focus",
    description: "Review stage distribution and rebalance execution focus for throughput.",
    severity: "default",
    icon: BriefcaseBusiness,
    actionLabel: "Open Pipeline",
  },
  {
    id: "capture-insight-brief",
    title: "Capture insight brief",
    description: "Capture new institutional insights for team-wide planning and review.",
    severity: "info",
    icon: Sparkles,
    actionLabel: "Open Insights",
  },
];
