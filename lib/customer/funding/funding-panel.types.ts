import type { FundingAssessment } from "@/lib/business/fundingAssessmentService";
import type { WorkspaceAction } from "@/lib/workspaces/businessWorkspaceViewModel";
import type { WorkflowEvent } from "@/lib/workflows/WorkflowEvent";

export const FUNDING_READINESS_STATES = [
  "Not Started",
  "In Progress",
  "Ready",
  "On Hold",
  "Funded",
] as const;

export type FundingReadinessState = (typeof FUNDING_READINESS_STATES)[number];

export interface FundingPanelConfig {
  readonly title: string;
  readonly subtitle: string;
  readonly workspaceLabel: string;
  readonly summaryTitle: string;
  readonly summarySubtitle: string;
  readonly readinessTitle: string;
  readonly readinessSubtitle: string;
  readonly overviewTitle: string;
  readonly overviewSubtitle: string;
  readonly timelineTitle: string;
  readonly timelineSubtitle: string;
  readonly actionsTitle: string;
  readonly actionsSubtitle: string;
}

export interface FacilitySummaryModel {
  readonly requestedAmount: string;
  readonly approvedAmount: string;
  readonly availableLimit: string;
  readonly utilizedAmount: string;
  readonly currency: string;
  readonly facilityStatus: string;
}

export interface FundingReadinessModel {
  readonly state: FundingReadinessState;
  readonly confidence: string;
  readonly trend: string;
  readonly lastUpdated: string;
  readonly notes?: readonly string[];
}

export interface FacilityOverviewItem {
  readonly id: string;
  readonly facilityName: string;
  readonly facilityType: string;
  readonly status: string;
  readonly limit: string;
  readonly utilized: string;
  readonly assessment?: Pick<
    FundingAssessment,
    "recommendedFacility" | "advanceRate" | "riskLevel" | "turnaround" | "recommendation"
  >;
}

export interface FundingActionItem extends Pick<WorkspaceAction, "label" | "description" | "disabled" | "badge"> {
  readonly id: string;
}

export interface FundingPanelModel {
  readonly summary: FacilitySummaryModel;
  readonly readiness: FundingReadinessModel;
  readonly facilities: readonly FacilityOverviewItem[];
  readonly timeline: readonly WorkflowEvent[];
  readonly actions: readonly FundingActionItem[];
}
