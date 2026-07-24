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

export interface CustomerWorkspaceRegistryModels {
  readonly businessPassportPanelModel: PassportPanelModel;
  readonly documentsPanelModel: DocumentsPanelModel;
  readonly relationshipPanelModel: RelationshipPanelModel;
  readonly approvalPanelModel: ApprovalPanelModel;
  readonly fundingPanelModel: FundingPanelModel;
  readonly insightsPanelModel: AiInsightsModel;
  readonly institutionalTimelineModel: InstitutionalTimelineModel;
  readonly workflowPanelModel: WorkflowPanelModel;
}

export type CustomerWorkspacePanelRenderer = () => React.ReactNode;

export type CustomerWorkspacePanelRegistry = Readonly<
  Record<CustomerWorkspaceTabId, CustomerWorkspacePanelRenderer>
>;

export function createCustomerWorkspacePanelRegistry(
  models: CustomerWorkspaceRegistryModels,
): CustomerWorkspacePanelRegistry {
  return {
    overview: () => (
      <div className="space-y-4">
        <PriorityBanner config={workflowPanelConfig} model={models.workflowPanelModel.priorityBanner} />
        <CustomerHealthCard config={workflowPanelConfig} health={models.workflowPanelModel.health} />
        <ReadinessProgress config={workflowPanelConfig} items={models.workflowPanelModel.readiness} />
        <WorkflowStatus config={workflowPanelConfig} model={models.workflowPanelModel.workflowStatus} />
        <NextBestAction config={workflowPanelConfig} action={models.workflowPanelModel.nextBestAction} />
        <AiInsightsPanel
          model={{
            recommendations: models.workflowPanelModel.recommendations,
            opportunities: models.insightsPanelModel.opportunities,
          }}
        />
      </div>
    ),
    "business-passport": () => <BusinessPassportPanel model={models.businessPassportPanelModel} />,
    documents: () => <DocumentsPanel model={models.documentsPanelModel} />,
    relationship: () => <RelationshipPanel model={models.relationshipPanelModel} />,
    approvals: () => <ApprovalPanel model={models.approvalPanelModel} />,
    funding: () => <FundingPanel model={models.fundingPanelModel} />,
    "ai-insights": () => <AiInsightsPanel model={models.insightsPanelModel} />,
    timeline: () => <InstitutionalTimeline model={models.institutionalTimelineModel} />,
  };
}
