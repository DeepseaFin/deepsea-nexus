import type { OpportunityLifecycle } from "@/lib/workflows/WorkflowTransition";

export type ForfaittingViewKey =
  | "queue"
  | "detail"
  | "pricing"
  | "funding"
  | "purchase"
  | "settlement"
  | "collections"
  | "exposure"
  | "portfolio"
  | "risk";

export interface ForfaittingSidebarItem {
  readonly key: ForfaittingViewKey;
  readonly label: string;
}

export interface ReceivableQueueItem {
  readonly id: string;
  readonly obligor: string;
  readonly exporter: string;
  readonly itemHref?: string;
  readonly amount: string;
  readonly tenorDays: number;
  readonly status: "new" | "review" | "approved" | "on_hold";
  readonly lifecycleStatus?: OpportunityLifecycle;
}

export interface ReceivableDetailState {
  readonly receivableId: string;
  readonly currency: string;
  readonly amount: string;
  readonly issueDate: string;
  readonly maturityDate: string;
  readonly instrumentType: string;
  readonly countryRisk: string;
}

export interface PricingWorkbenchItem {
  readonly id: string;
  readonly scenario: string;
  readonly discountRate: string;
  readonly expectedYield: string;
  readonly status: "baseline" | "preferred" | "stress";
}

export interface FundingPanelItem {
  readonly id: string;
  readonly source: string;
  readonly allocation: string;
  readonly availability: string;
  readonly status: "available" | "constrained";
}

export interface PurchasePanelItem {
  readonly id: string;
  readonly receivableId: string;
  readonly purchaseStatus: "pending" | "ready" | "executed";
  readonly owner: string;
}

export interface SettlementTrackerItem {
  readonly id: string;
  readonly milestone: string;
  readonly status: "upcoming" | "in_progress" | "completed";
  readonly eta: string;
}

export interface CollectionsBoardItem {
  readonly id: string;
  readonly receivableId: string;
  readonly collectionStatus: "on_track" | "watch" | "delayed";
  readonly nextAction: string;
}

export interface ExposureDashboardItem {
  readonly id: string;
  readonly dimension: string;
  readonly value: string;
  readonly limit: string;
  readonly status: "normal" | "watch" | "breach";
}

export interface PortfolioSummaryState {
  readonly outstanding: string;
  readonly concentration: string;
  readonly weightedTenor: string;
  readonly activeDeals: number;
}

export interface RiskIndicatorItem {
  readonly id: string;
  readonly indicator: string;
  readonly level: "low" | "medium" | "high";
  readonly note: string;
}

export interface ForfaittingTimelineItem {
  readonly id: string;
  readonly timestamp: string;
  readonly event: string;
  readonly actor: string;
  readonly detail: string;
}

export interface AiDealAdvisorState {
  readonly summary: string;
  readonly recommendations: readonly string[];
  readonly alerts: readonly string[];
}

export interface ForfaittingWorkspaceState {
  readonly workspaceId: string;
  readonly deskName: string;
  readonly portfolioName: string;
  readonly status: "active" | "watch" | "completed";
  readonly reviewDate: string;
  readonly sidebar: readonly ForfaittingSidebarItem[];
  readonly receivableQueue: readonly ReceivableQueueItem[];
  readonly receivableDetail: ReceivableDetailState;
  readonly pricingWorkbench: readonly PricingWorkbenchItem[];
  readonly fundingPanel: readonly FundingPanelItem[];
  readonly purchasePanel: readonly PurchasePanelItem[];
  readonly settlementTracker: readonly SettlementTrackerItem[];
  readonly collectionsBoard: readonly CollectionsBoardItem[];
  readonly exposureDashboard: readonly ExposureDashboardItem[];
  readonly portfolioSummary: PortfolioSummaryState;
  readonly riskIndicators: readonly RiskIndicatorItem[];
  readonly timeline: readonly ForfaittingTimelineItem[];
  readonly aiDealAdvisor: AiDealAdvisorState;
}
