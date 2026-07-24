import type { LucideIcon } from "lucide-react";
import type { StatusChipProps } from "@/components/ui/StatusChip";

export type DashboardWidgetWidth = "half" | "full";

export type DashboardWidgetId =
  | "institutional-kpi"
  | "recent-activity"
  | "ai-insights"
  | "my-tasks"
  | "upcoming-approvals"
  | "pipeline";

export type DashboardSeverity = "default" | "success" | "warning" | "danger" | "info";

export interface DashboardWorkspaceOption {
  readonly id: string;
  readonly label: string;
}

export interface DashboardHeaderAction {
  readonly id: string;
  readonly label: string;
  readonly icon?: LucideIcon;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

export interface DashboardHeaderModel {
  readonly greeting: string;
  readonly roleLabel: string;
  readonly currentDate: string;
  readonly workspaceOptions: readonly DashboardWorkspaceOption[];
  readonly selectedWorkspaceId: string;
  readonly onWorkspaceChange?: (workspaceId: string) => void;
  readonly actions?: readonly DashboardHeaderAction[];
}

export interface DashboardPriorityAction {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly severity: DashboardSeverity;
  readonly icon?: LucideIcon;
  readonly actionLabel: string;
  readonly onAction?: () => void;
}

export interface DashboardWidgetConfig {
  readonly id: DashboardWidgetId;
  readonly title: string;
  readonly description: string;
  readonly width: DashboardWidgetWidth;
}

export interface DashboardLayoutConfig {
  readonly widgets: readonly DashboardWidgetConfig[];
}

export interface DashboardKpiItem {
  readonly id: string;
  readonly title: string;
  readonly value: string;
  readonly trend?: string;
  readonly status: StatusChipProps["variant"];
  readonly icon?: LucideIcon;
  readonly footer?: string;
}

export interface DashboardActivityItem {
  readonly id: string;
  readonly timestamp: string;
  readonly title: string;
  readonly description: string;
  readonly actor?: string;
}

export interface DashboardInsightItem {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly confidence?: string;
  readonly category?: string;
}

export interface DashboardTaskItem {
  readonly id: string;
  readonly title: string;
  readonly dueLabel?: string;
  readonly owner?: string;
  readonly status: StatusChipProps["variant"];
}

export interface DashboardApprovalItem {
  readonly id: string;
  readonly subject: string;
  readonly stage: string;
  readonly dueLabel?: string;
  readonly status: StatusChipProps["variant"];
}

export interface DashboardPipelineItem {
  readonly id: string;
  readonly stage: string;
  readonly count: string;
  readonly amount?: string;
  readonly status: StatusChipProps["variant"];
}
