export type CommercialViewKey =
  | "pipeline"
  | "pricing"
  | "term_sheet"
  | "approval"
  | "legal"
  | "settlement";

export interface CommercialSidebarItem {
  readonly key: CommercialViewKey;
  readonly label: string;
}

export interface CommercialOpportunity {
  readonly id: string;
  readonly counterparty: string;
  readonly facilityType: string;
  readonly notional: string;
  readonly stage: string;
  readonly owner: string;
}

export interface CommercialPricingItem {
  readonly id: string;
  readonly scenario: string;
  readonly marginBps: number;
  readonly discountRate: string;
  readonly status: "baseline" | "recommended" | "stress";
}

export interface CommercialTermSheetItem {
  readonly id: string;
  readonly version: string;
  readonly status: "draft" | "review" | "approved";
  readonly owner: string;
  readonly updatedAt: string;
}

export interface CommercialApprovalItem {
  readonly id: string;
  readonly committee: string;
  readonly decision: "pending" | "approved" | "conditional";
  readonly scheduledAt: string;
}

export interface CommercialLegalItem {
  readonly id: string;
  readonly item: string;
  readonly status: "open" | "ready" | "blocked";
  readonly owner: string;
}

export interface CommercialSettlementItem {
  readonly id: string;
  readonly milestone: string;
  readonly status: "upcoming" | "in_progress" | "completed";
  readonly eta: string;
}

export interface CommercialTimelineItem {
  readonly id: string;
  readonly timestamp: string;
  readonly event: string;
  readonly actor: string;
  readonly detail: string;
}

export interface CommercialAiAdvisorState {
  readonly summary: string;
  readonly recommendations: readonly string[];
  readonly risks: readonly string[];
}

export interface CommercialWorkspaceState {
  readonly workspaceId: string;
  readonly institutionName: string;
  readonly portfolio: string;
  readonly status: "active" | "watch" | "completed";
  readonly reviewDate: string;
  readonly sidebar: readonly CommercialSidebarItem[];
  readonly opportunities: readonly CommercialOpportunity[];
  readonly pricing: readonly CommercialPricingItem[];
  readonly termSheets: readonly CommercialTermSheetItem[];
  readonly approvals: readonly CommercialApprovalItem[];
  readonly legalChecklist: readonly CommercialLegalItem[];
  readonly settlement: readonly CommercialSettlementItem[];
  readonly timeline: readonly CommercialTimelineItem[];
  readonly aiAdvisor: CommercialAiAdvisorState;
}
