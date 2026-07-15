import type { OpportunityLifecycle } from "@/lib/workflows/WorkflowTransition";

export type ExecutiveViewKey =
  | "dashboard"
  | "priorities"
  | "alerts"
  | "decisions"
  | "portfolio"
  | "liquidity"
  | "customers"
  | "institution_health"
  | "risk_map";

export interface ExecutiveSidebarItem {
  readonly key: ExecutiveViewKey;
  readonly label: string;
}

export interface ExecutiveKpiItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly note: string;
}

export interface ExecutivePriorityItem {
  readonly id: string;
  readonly title: string;
  readonly owner: string;
  readonly horizon: string;
  readonly status: "on_track" | "watch" | "critical";
}

export interface ExecutiveAlertItem {
  readonly id: string;
  readonly category: string;
  readonly message: string;
  readonly severity: "low" | "medium" | "high";
  readonly updatedAt: string;
}

export interface ExecutiveDecisionItem {
  readonly id: string;
  readonly title: string;
  readonly committee: string;
  readonly outcome: "approved" | "conditional" | "pending";
  readonly decidedAt: string;
  readonly lifecycleStatus?: OpportunityLifecycle;
}

export interface ExecutivePortfolioItem {
  readonly id: string;
  readonly segment: string;
  readonly exposure: string;
  readonly trend: "up" | "flat" | "down";
  readonly quality: "strong" | "watch" | "stressed";
}

export interface ExecutiveLiquidityItem {
  readonly id: string;
  readonly metric: string;
  readonly value: string;
  readonly status: "normal" | "watch" | "tight";
}

export interface ExecutiveCustomerItem {
  readonly id: string;
  readonly customer: string;
  readonly segment: string;
  readonly relationshipStatus: "active" | "expanding" | "watch";
  readonly note: string;
}

export interface ExecutiveInstitutionHealthItem {
  readonly id: string;
  readonly dimension: string;
  readonly score: string;
  readonly status: "strong" | "watch" | "critical";
}

export interface ExecutiveRiskMapItem {
  readonly id: string;
  readonly riskType: string;
  readonly concentration: string;
  readonly threshold: string;
  readonly status: "normal" | "watch" | "breach";
}

export interface ExecutiveTimelineItem {
  readonly id: string;
  readonly timestamp: string;
  readonly event: string;
  readonly actor: string;
  readonly detail: string;
}

export interface ExecutiveAiAdvisorState {
  readonly summary: string;
  readonly recommendations: readonly string[];
  readonly alerts: readonly string[];
}

export interface ExecutiveWorkspaceState {
  readonly workspaceId: string;
  readonly officeName: string;
  readonly institutionName: string;
  readonly status: "active" | "watch" | "completed";
  readonly reviewDate: string;
  readonly sidebar: readonly ExecutiveSidebarItem[];
  readonly dashboard: readonly ExecutiveKpiItem[];
  readonly priorities: readonly ExecutivePriorityItem[];
  readonly alerts: readonly ExecutiveAlertItem[];
  readonly decisions: readonly ExecutiveDecisionItem[];
  readonly portfolio: readonly ExecutivePortfolioItem[];
  readonly liquidity: readonly ExecutiveLiquidityItem[];
  readonly customers: readonly ExecutiveCustomerItem[];
  readonly institutionHealth: readonly ExecutiveInstitutionHealthItem[];
  readonly riskMap: readonly ExecutiveRiskMapItem[];
  readonly timeline: readonly ExecutiveTimelineItem[];
  readonly aiAdvisor: ExecutiveAiAdvisorState;
}
