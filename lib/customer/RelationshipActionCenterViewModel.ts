export type RelationshipActionCategory =
  | "missing-documents"
  | "outstanding-information"
  | "compliance-follow-up"
  | "trade-documentation"
  | "financial-updates"
  | "recommended-relationship-manager-actions";

export type RelationshipActionPriority = "high" | "medium" | "low";

export type RelationshipActionSource = "insight" | "readiness" | "evidence";

export interface RelationshipActionCenterItemViewModel {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly priority: RelationshipActionPriority;
  readonly relatedCustomer: string;
  readonly relatedDocuments: readonly {
    readonly id: string;
    readonly label: string;
  }[];
  readonly source: RelationshipActionSource;
  readonly suggestedNextStep: string;
  readonly supportingIntelligence: {
    readonly sourceModel: "relationship-workspace-intelligence" | "relationship-insights-report" | "relationship-readiness-report";
    readonly reference: string;
  };
}

export interface RelationshipActionCenterCategoryGroupViewModel {
  readonly key: RelationshipActionCategory;
  readonly title:
    | "Missing Documents"
    | "Outstanding Information"
    | "Compliance Follow-up"
    | "Trade Documentation"
    | "Financial Updates"
    | "Recommended Relationship Manager Actions";
  readonly totalActions: number;
  readonly priorities: {
    readonly high: readonly RelationshipActionCenterItemViewModel[];
    readonly medium: readonly RelationshipActionCenterItemViewModel[];
    readonly low: readonly RelationshipActionCenterItemViewModel[];
  };
}

export interface RelationshipActionCenterViewModel {
  readonly generatedAt: string;
  readonly relatedCustomer: string;
  readonly totalActions: number;
  readonly categories: readonly RelationshipActionCenterCategoryGroupViewModel[];
  readonly priorities: {
    readonly high: readonly RelationshipActionCenterItemViewModel[];
    readonly medium: readonly RelationshipActionCenterItemViewModel[];
    readonly low: readonly RelationshipActionCenterItemViewModel[];
  };
}
