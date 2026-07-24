import type { DashboardLayoutConfig, DashboardWidgetConfig, DashboardWidgetId } from "@/lib/dashboard/dashboard.types";

export const DEFAULT_WIDGET_ORDER: readonly DashboardWidgetId[] = [
  "institutional-kpi",
  "recent-activity",
  "ai-insights",
  "my-tasks",
  "upcoming-approvals",
  "pipeline",
];

export const DASHBOARD_WIDGET_LIBRARY: Readonly<Record<DashboardWidgetId, DashboardWidgetConfig>> = {
  "institutional-kpi": {
    id: "institutional-kpi",
    title: "Institutional KPIs",
    description: "Key metrics for role-based workspace health.",
    width: "full",
  },
  "recent-activity": {
    id: "recent-activity",
    title: "Recent Activity",
    description: "Timeline of recent institutional actions.",
    width: "half",
  },
  "ai-insights": {
    id: "ai-insights",
    title: "AI Insights",
    description: "Framework container for recommendation summaries.",
    width: "half",
  },
  "my-tasks": {
    id: "my-tasks",
    title: "My Tasks",
    description: "Assigned tasks for current role context.",
    width: "half",
  },
  "upcoming-approvals": {
    id: "upcoming-approvals",
    title: "Upcoming Approvals",
    description: "Approvals nearing decision windows.",
    width: "half",
  },
  pipeline: {
    id: "pipeline",
    title: "Pipeline",
    description: "Summary of active pipeline stages.",
    width: "full",
  },
};

export function createDashboardLayout(widgetOrder: readonly DashboardWidgetId[]): DashboardLayoutConfig {
  return {
    widgets: widgetOrder.map((id) => DASHBOARD_WIDGET_LIBRARY[id]),
  };
}
