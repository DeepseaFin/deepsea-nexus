export interface MonetaryAmount {
  readonly amount: number;
  readonly currency: string;
}

export type OwnershipStructure =
  | "sole_owner"
  | "partnership"
  | "private_company"
  | "public_company"
  | "group_subsidiary";

export type StrategicClassification =
  | "core_relationship"
  | "growth_relationship"
  | "watchlist_relationship"
  | "institutional_priority";

export interface FundingHistoryEntry {
  readonly facilityType: string;
  readonly providerName: string;
  readonly amount: MonetaryAmount;
  readonly startedAt: string;
  readonly endedAt?: string;
  readonly status: "active" | "closed" | "restructured" | "defaulted";
}

export interface BankingRelationship {
  readonly institutionName: string;
  readonly relationshipType: "primary" | "secondary" | "trade" | "treasury";
  readonly since: string;
}

export interface BranchRecord {
  readonly branchCode: string;
  readonly country: string;
  readonly city?: string;
}

export type ReviewFrequency = "monthly" | "quarterly" | "semi_annual" | "annual" | "event_driven";

export type GovernanceApprovalStatus = "pending" | "approved" | "conditional" | "rejected";
