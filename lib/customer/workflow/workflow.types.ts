import type { AiRecommendation } from "@/lib/customer/insights/insights.types";

export const WORKFLOW_READINESS_STATES = [
  "Not Started",
  "In Progress",
  "Review Required",
  "Ready",
  "Completed",
] as const;

export type WorkflowReadinessState = (typeof WORKFLOW_READINESS_STATES)[number];

export type WorkflowPriority = "low" | "medium" | "high" | "critical";

export interface PriorityBannerModel {
  readonly title: string;
  readonly summary: string;
  readonly priority: WorkflowPriority;
  readonly recommendedAction: string;
  readonly estimatedImpact: string;
}

export interface CustomerHealthItem {
  readonly id: "business-passport" | "documents" | "relationship" | "approvals" | "funding";
  readonly label: string;
  readonly status: string;
  readonly progress: string;
  readonly trend: string;
}

export interface ReadinessItem {
  readonly id: string;
  readonly title: string;
  readonly state: WorkflowReadinessState;
  readonly detail?: string;
}

export interface WorkflowStatusModel {
  readonly currentPhase: string;
  readonly owner: string;
  readonly queueStatus: string;
  readonly dueWindow: string;
}

export interface NextBestActionModel {
  readonly title: string;
  readonly description: string;
  readonly owner: string;
  readonly priority: WorkflowPriority;
  readonly actionLabel: string;
}

export interface WorkflowPanelConfig {
  readonly priorityBannerTitle: string;
  readonly priorityBannerSubtitle: string;
  readonly healthTitle: string;
  readonly healthSubtitle: string;
  readonly readinessTitle: string;
  readonly readinessSubtitle: string;
  readonly workflowStatusTitle: string;
  readonly workflowStatusSubtitle: string;
  readonly nextActionTitle: string;
  readonly nextActionSubtitle: string;
  readonly insightBridgeTitle: string;
  readonly insightBridgeSubtitle: string;
}

export interface WorkflowPanelModel {
  readonly priorityBanner: PriorityBannerModel;
  readonly health: readonly CustomerHealthItem[];
  readonly readiness: readonly ReadinessItem[];
  readonly workflowStatus: WorkflowStatusModel;
  readonly nextBestAction: NextBestActionModel;
  readonly recommendations: readonly AiRecommendation[];
}
