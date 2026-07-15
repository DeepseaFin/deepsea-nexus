import type { OpportunityLifecycle } from "@/lib/workflows/WorkflowTransition";

export type CommercialWorkflowStepId =
  | "institution_summary"
  | "create_opportunity"
  | "receivable_details"
  | "indicative_pricing"
  | "term_sheet_preview"
  | "ready_for_approval";

export type CommercialWorkflowStepStatus = "pending" | "in_progress" | "completed";

export interface CommercialWorkflowStep {
  readonly id: CommercialWorkflowStepId;
  readonly title: string;
  readonly subtitle: string;
  readonly status: CommercialWorkflowStepStatus;
}

export interface BusinessPassportSnapshot {
  readonly passportId: string;
  readonly legalName: string;
  readonly jurisdiction: string;
  readonly businessType: string;
  readonly registrationNumber: string;
  readonly riskBand: string;
  readonly readinessScore: number;
}

export interface OpportunityDraft {
  readonly opportunityId: string;
  readonly lifecycleStatus: OpportunityLifecycle;
  readonly product: string;
  readonly targetAmount: string;
  readonly tenor: string;
  readonly relationshipManager: string;
}

export interface ReceivableDraft {
  readonly receivableType: string;
  readonly invoiceCount: string;
  readonly averageInvoiceSize: string;
  readonly obligorSegment: string;
  readonly expectedDilution: string;
}

export interface IndicativePricingSnapshot {
  readonly pricingReference: string;
  readonly indicativeMargin: string;
  readonly indicativeDiscountRate: string;
  readonly fees: string;
  readonly notes: readonly string[];
}

export interface TermSheetSnapshot {
  readonly version: string;
  readonly governingLaw: string;
  readonly facilityType: string;
  readonly conditions: readonly string[];
}

export interface CommercialWorkflowState {
  readonly workflowId: string;
  readonly institutionName: string;
  readonly currentStepId: CommercialWorkflowStepId;
  readonly steps: readonly CommercialWorkflowStep[];
  readonly businessPassport: BusinessPassportSnapshot;
  readonly opportunity: OpportunityDraft;
  readonly receivable: ReceivableDraft;
  readonly pricing: IndicativePricingSnapshot;
  readonly termSheet: TermSheetSnapshot;
}
