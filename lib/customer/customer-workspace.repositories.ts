import type { ApprovalPanelModel } from "@/lib/customer/approval/approval-panel.types";
import type { PassportPanelModel } from "@/lib/customer/business-passport/passport-panel.types";
import type { DocumentsPanelModel } from "@/lib/customer/documents/documents-panel.types";
import type { FundingPanelModel } from "@/lib/customer/funding/funding-panel.types";
import type { AiInsightsModel } from "@/lib/customer/insights/insights.types";
import type { RelationshipPanelModel } from "@/lib/customer/relationship/relationship-panel.types";
import type { InstitutionalTimelineModel } from "@/lib/customer/timeline/timeline.types";
import type { WorkflowPanelModel } from "@/lib/customer/workflow/workflow.types";

export interface CustomerWorkspaceRepositoryContext {
  readonly customerId?: string;
}

export interface CustomerWorkspaceRepositoryAdapters {
  readonly businessPassportProjection?: (context: CustomerWorkspaceRepositoryContext) => Promise<unknown> | unknown;
  readonly documentsProjection?: (context: CustomerWorkspaceRepositoryContext) => Promise<unknown> | unknown;
  readonly relationshipProjection?: (context: CustomerWorkspaceRepositoryContext) => Promise<unknown> | unknown;
  readonly approvalProjection?: (context: CustomerWorkspaceRepositoryContext) => Promise<unknown> | unknown;
  readonly fundingProjection?: (context: CustomerWorkspaceRepositoryContext) => Promise<unknown> | unknown;
  readonly businessPassportPanelModel?: (context: CustomerWorkspaceRepositoryContext) => Promise<PassportPanelModel> | PassportPanelModel;
  readonly documentsPanelModel?: (context: CustomerWorkspaceRepositoryContext) => Promise<DocumentsPanelModel> | DocumentsPanelModel;
  readonly relationshipPanelModel?: (context: CustomerWorkspaceRepositoryContext) => Promise<RelationshipPanelModel> | RelationshipPanelModel;
  readonly approvalPanelModel?: (context: CustomerWorkspaceRepositoryContext) => Promise<ApprovalPanelModel> | ApprovalPanelModel;
  readonly fundingPanelModel?: (context: CustomerWorkspaceRepositoryContext) => Promise<FundingPanelModel> | FundingPanelModel;
  readonly insightsPanelModel?: (context: CustomerWorkspaceRepositoryContext) => Promise<AiInsightsModel> | AiInsightsModel;
  readonly institutionalTimelineModel?: (context: CustomerWorkspaceRepositoryContext) => Promise<InstitutionalTimelineModel> | InstitutionalTimelineModel;
  readonly workflowPanelModel?: (context: CustomerWorkspaceRepositoryContext) => Promise<WorkflowPanelModel> | WorkflowPanelModel;
}
