import type { OpportunityLifecycle } from "@/lib/workflows/WorkflowTransition";

export type TreasuryViewKey =
  | "liquidity"
  | "funding_queue"
  | "funding_sources"
  | "settlement_queue"
  | "investor_allocation"
  | "cash_flow_forecast"
  | "exposure_limits"
  | "bank_accounts";

export interface TreasurySidebarItem {
  readonly key: TreasuryViewKey;
  readonly label: string;
}

export interface LiquidityMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly trend: "up" | "flat" | "down";
}

export interface FundingQueueItem {
  readonly id: string;
  readonly counterparty: string;
  readonly opportunityReference?: string;
  readonly amount: string;
  readonly fundingDate?: string;
  readonly currency?: string;
  readonly priority: "high" | "medium" | "low";
  readonly status: "queued" | "review" | "ready";
  readonly currentStatus?: OpportunityLifecycle;
}

export interface FundingSourceItem {
  readonly id: string;
  readonly source: string;
  readonly limit: string;
  readonly available: string;
  readonly status: "active" | "watch" | "paused";
}

export interface SettlementQueueItem {
  readonly id: string;
  readonly instructionRef: string;
  readonly valueDate: string;
  readonly amount: string;
  readonly status: "pending" | "released" | "reconciled";
}

export interface InvestorAllocationItem {
  readonly id: string;
  readonly investor: string;
  readonly allocation: string;
  readonly mandate: string;
  readonly status: "proposed" | "confirmed" | "adjusted";
}

export interface CashFlowForecastItem {
  readonly id: string;
  readonly bucket: string;
  readonly inflow: string;
  readonly outflow: string;
  readonly netPosition: string;
}

export interface ExposureLimitItem {
  readonly id: string;
  readonly dimension: string;
  readonly utilization: string;
  readonly limit: string;
  readonly status: "normal" | "watch" | "breach";
}

export interface BankAccountItem {
  readonly id: string;
  readonly accountName: string;
  readonly bank: string;
  readonly currency: string;
  readonly balance: string;
  readonly status: "active" | "restricted";
}

export interface TreasuryTimelineItem {
  readonly id: string;
  readonly timestamp: string;
  readonly event: string;
  readonly actor: string;
  readonly detail: string;
}

export interface TreasuryAiAdvisorState {
  readonly summary: string;
  readonly recommendations: readonly string[];
  readonly alerts: readonly string[];
}

export interface TreasuryWorkspaceState {
  readonly workspaceId: string;
  readonly institutionName: string;
  readonly treasuryDesk: string;
  readonly status: "active" | "watch" | "completed";
  readonly reviewDate: string;
  readonly sidebar: readonly TreasurySidebarItem[];
  readonly liquidityDashboard: readonly LiquidityMetric[];
  readonly fundingQueue: readonly FundingQueueItem[];
  readonly fundingSources: readonly FundingSourceItem[];
  readonly settlementQueue: readonly SettlementQueueItem[];
  readonly investorAllocation: readonly InvestorAllocationItem[];
  readonly cashFlowForecast: readonly CashFlowForecastItem[];
  readonly exposureLimits: readonly ExposureLimitItem[];
  readonly bankAccounts: readonly BankAccountItem[];
  readonly timeline: readonly TreasuryTimelineItem[];
  readonly aiAdvisor: TreasuryAiAdvisorState;
}
