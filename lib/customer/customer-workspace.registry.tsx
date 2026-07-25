import React from "react";
import ApprovalPanel from "@/components/customer/approval/ApprovalPanel";
import BusinessPassportPanel from "@/components/customer/business-passport/BusinessPassportPanel";
import DocumentsPanel from "@/components/customer/documents/DocumentsPanel";
import FundingPanel from "@/components/customer/funding/FundingPanel";
import AiInsightsPanel from "@/components/customer/insights/AiInsightsPanel";
import RelationshipPanel from "@/components/customer/relationship/RelationshipPanel";
import InstitutionalTimeline from "@/components/customer/timeline/InstitutionalTimeline";
import CustomerHealthCard from "@/components/customer/workflow/CustomerHealthCard";
import NextBestAction from "@/components/customer/workflow/NextBestAction";
import PriorityBanner from "@/components/customer/workflow/PriorityBanner";
import ReadinessProgress from "@/components/customer/workflow/ReadinessProgress";
import WorkflowStatus from "@/components/customer/workflow/WorkflowStatus";
import { PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import type { WorkspaceIntelligenceModel } from "@/lib/application/WorkspaceIntelligence";
import { workflowPanelConfig } from "@/lib/customer/workflow/workflow.config";
import type { ApprovalPanelModel } from "@/lib/customer/approval/approval-panel.types";
import type { PassportPanelModel } from "@/lib/customer/business-passport/passport-panel.types";
import type { DocumentsPanelModel } from "@/lib/customer/documents/documents-panel.types";
import type { FundingPanelModel } from "@/lib/customer/funding/funding-panel.types";
import type { AiInsightsModel } from "@/lib/customer/insights/insights.types";
import type { RelationshipPanelModel } from "@/lib/customer/relationship/relationship-panel.types";
import type { InstitutionalTimelineModel } from "@/lib/customer/timeline/timeline.types";
import type { WorkflowPanelModel } from "@/lib/customer/workflow/workflow.types";
import type { CustomerWorkspaceTabId } from "@/lib/customer/customer-workspace.types";
import type { DocumentsPresentationViewModel } from "@/lib/presentation/presenters/DocumentsPresenter";
import type { ApprovalPresentationViewModel } from "@/lib/presentation/presenters/ApprovalPresenter";
import type { FundingPresentationViewModel } from "@/lib/presentation/presenters/FundingPresenter";
import type { AiInsightsPresentationViewModel } from "@/lib/presentation/presenters/AiInsightsPresenter";
import type { InstitutionalTimelinePresentationViewModel } from "@/lib/presentation/presenters/InstitutionalTimelinePresenter";
import type { WorkflowPresentationViewModel } from "@/lib/presentation/presenters/WorkflowPresenter";
import type { BusinessPassportPresentationViewModel } from "@/lib/presentation/presenters/BusinessPassportPresenter";
import type { RelationshipPresentationViewModel } from "@/lib/presentation/presenters/RelationshipPresenter";

export interface CustomerWorkspaceRegistryModels {
  readonly businessPassportPanelModel: PassportPanelModel;
  readonly businessPassportViewModel?: BusinessPassportPresentationViewModel;
  readonly documentsPanelModel: DocumentsPanelModel;
  readonly documentsViewModel?: DocumentsPresentationViewModel;
  readonly relationshipPanelModel: RelationshipPanelModel;
  readonly relationshipViewModel?: RelationshipPresentationViewModel;
  readonly approvalViewModel?: ApprovalPresentationViewModel;
  readonly fundingViewModel?: FundingPresentationViewModel;
  readonly aiInsightsViewModel?: AiInsightsPresentationViewModel;
  readonly institutionalTimelineViewModel?: InstitutionalTimelinePresentationViewModel;
  readonly workflowViewModel?: WorkflowPresentationViewModel;
  readonly approvalPanelModel: ApprovalPanelModel;
  readonly fundingPanelModel: FundingPanelModel;
  readonly insightsPanelModel: AiInsightsModel;
  readonly institutionalTimelineModel: InstitutionalTimelineModel;
  readonly workflowPanelModel: WorkflowPanelModel;
  readonly workspaceIntelligence: WorkspaceIntelligenceModel;
  readonly loadingByTabId?: Partial<Record<CustomerWorkspaceTabId, boolean>>;
  readonly errorByTabId?: Partial<Record<CustomerWorkspaceTabId, string>>;
}

export type CustomerWorkspacePanelRenderer = () => React.ReactNode;

export type CustomerWorkspacePanelRegistry = Readonly<
  Record<CustomerWorkspaceTabId, CustomerWorkspacePanelRenderer>
>;

export function createCustomerWorkspacePanelRegistry(
  models: CustomerWorkspaceRegistryModels,
): CustomerWorkspacePanelRegistry {
  return {
    overview: () => {
      if (models.loadingByTabId?.overview) {
        return (
          <PanelLoadingState
            title={workflowPanelConfig.workflowStatusTitle}
            subtitle={workflowPanelConfig.workflowStatusSubtitle}
          />
        );
      }

      if (models.errorByTabId?.overview) {
        return (
          <PanelErrorState
            title={workflowPanelConfig.workflowStatusTitle}
            subtitle={workflowPanelConfig.workflowStatusSubtitle}
            message={models.errorByTabId.overview}
          />
        );
      }

      return (
        <div className="space-y-4">
          <PriorityBanner
            config={workflowPanelConfig}
            model={models.workflowViewModel?.payload.panelModel.priorityBanner ?? models.workflowPanelModel.priorityBanner}
          />
          <CustomerHealthCard
            config={workflowPanelConfig}
            health={models.workflowViewModel?.payload.panelModel.health ?? models.workflowPanelModel.health}
          />
          <ReadinessProgress
            config={workflowPanelConfig}
            items={models.workflowViewModel?.payload.panelModel.readiness ?? models.workflowPanelModel.readiness}
          />
          <WorkflowStatus
            config={workflowPanelConfig}
            model={models.workflowViewModel?.payload.panelModel.workflowStatus ?? models.workflowPanelModel.workflowStatus}
          />
          <NextBestAction
            config={workflowPanelConfig}
            intelligence={models.workspaceIntelligence}
          />
          <AiInsightsPanel
            viewModel={models.aiInsightsViewModel}
            model={models.insightsPanelModel}
            isLoading={models.loadingByTabId?.["ai-insights"]}
            error={models.errorByTabId?.["ai-insights"]}
          />
        </div>
      );
    },
    "business-passport": () => (
      <BusinessPassportPanel
        viewModel={models.businessPassportViewModel}
        model={models.businessPassportPanelModel}
        isLoading={models.loadingByTabId?.["business-passport"]}
        error={models.errorByTabId?.["business-passport"]}
      />
    ),
    documents: () => (
      <DocumentsPanel
        viewModel={models.documentsViewModel}
        model={models.documentsPanelModel}
        isLoading={models.loadingByTabId?.documents}
        error={models.errorByTabId?.documents}
      />
    ),
    relationship: () => (
      <RelationshipPanel
        viewModel={models.relationshipViewModel}
        model={models.relationshipPanelModel}
        isLoading={models.loadingByTabId?.relationship}
        error={models.errorByTabId?.relationship}
      />
    ),
    approvals: () => (
      <ApprovalPanel
        viewModel={models.approvalViewModel}
        model={models.approvalPanelModel}
        isLoading={models.loadingByTabId?.approvals}
        error={models.errorByTabId?.approvals}
      />
    ),
    funding: () => (
      <FundingPanel
        viewModel={models.fundingViewModel}
        model={models.fundingPanelModel}
        isLoading={models.loadingByTabId?.funding}
        error={models.errorByTabId?.funding}
      />
    ),
    "ai-insights": () => (
      <AiInsightsPanel
        viewModel={models.aiInsightsViewModel}
        model={models.insightsPanelModel}
        isLoading={models.loadingByTabId?.["ai-insights"]}
        error={models.errorByTabId?.["ai-insights"]}
      />
    ),
    timeline: () => (
      <InstitutionalTimeline
        viewModel={models.institutionalTimelineViewModel}
        model={models.institutionalTimelineModel}
        isLoading={models.loadingByTabId?.timeline}
        error={models.errorByTabId?.timeline}
      />
    ),
  };
}
