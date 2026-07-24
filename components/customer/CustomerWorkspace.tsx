"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomerContent from "@/components/customer/CustomerContent";
import CustomerSidebar from "@/components/customer/CustomerSidebar";
import CustomerSummaryCard from "@/components/customer/CustomerSummaryCard";
import CustomerTabs from "@/components/customer/CustomerTabs";
import CustomerWorkspaceHeader from "@/components/customer/CustomerWorkspaceHeader";
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
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import {
  customerWorkspaceLayout,
  defaultCustomerActions,
  defaultCustomerSummary,
} from "@/lib/customer/customer-workspace.layout";
import { defaultPassportPanelModel } from "@/lib/customer/business-passport/passport-panel.config";
import { defaultDocumentsPanelModel } from "@/lib/customer/documents/documents-panel.config";
import type { DocumentsPanelModel } from "@/lib/customer/documents/documents-panel.types";
import type { PassportPanelModel } from "@/lib/customer/business-passport/passport-panel.types";
import { defaultRelationshipPanelModel } from "@/lib/customer/relationship/relationship-panel.config";
import type { RelationshipPanelModel } from "@/lib/customer/relationship/relationship-panel.types";
import { defaultApprovalPanelModel } from "@/lib/customer/approval/approval-panel.config";
import type { ApprovalPanelModel } from "@/lib/customer/approval/approval-panel.types";
import { defaultFundingPanelModel } from "@/lib/customer/funding/funding-panel.config";
import type { FundingPanelModel } from "@/lib/customer/funding/funding-panel.types";
import { defaultAiInsightsModel } from "@/lib/customer/insights/insights.config";
import type { AiInsightsModel } from "@/lib/customer/insights/insights.types";
import { defaultInstitutionalTimelineModel } from "@/lib/customer/timeline/timeline.config";
import type { InstitutionalTimelineModel } from "@/lib/customer/timeline/timeline.types";
import { defaultWorkflowPanelModel, workflowPanelConfig } from "@/lib/customer/workflow/workflow.config";
import type { WorkflowPanelModel } from "@/lib/customer/workflow/workflow.types";
import type {
  CustomerSummaryModel,
  CustomerWorkspaceAction,
  CustomerWorkspaceLayoutConfig,
  CustomerWorkspaceTabId,
} from "@/lib/customer/customer-workspace.types";

export interface CustomerWorkspaceProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly customerId?: string;
  readonly summary?: CustomerSummaryModel;
  readonly actions?: readonly CustomerWorkspaceAction[];
  readonly layout?: CustomerWorkspaceLayoutConfig;
  readonly businessPassportPanelModel?: PassportPanelModel;
  readonly documentsPanelModel?: DocumentsPanelModel;
  readonly relationshipPanelModel?: RelationshipPanelModel;
  readonly approvalPanelModel?: ApprovalPanelModel;
  readonly fundingPanelModel?: FundingPanelModel;
  readonly insightsPanelModel?: AiInsightsModel;
  readonly institutionalTimelineModel?: InstitutionalTimelineModel;
  readonly workflowPanelModel?: WorkflowPanelModel;
  readonly renderTabContent?: (tabId: CustomerWorkspaceTabId) => React.ReactNode;
}

export default function CustomerWorkspace({
  title = "Institution Customer Workspace",
  subtitle = "Primary operating surface for customer capabilities and decision context",
  customerId,
  summary = defaultCustomerSummary,
  actions = defaultCustomerActions,
  layout = customerWorkspaceLayout,
  businessPassportPanelModel = defaultPassportPanelModel,
  documentsPanelModel = defaultDocumentsPanelModel,
  relationshipPanelModel = defaultRelationshipPanelModel,
  approvalPanelModel = defaultApprovalPanelModel,
  fundingPanelModel = defaultFundingPanelModel,
  insightsPanelModel = defaultAiInsightsModel,
  institutionalTimelineModel = defaultInstitutionalTimelineModel,
  workflowPanelModel = defaultWorkflowPanelModel,
  renderTabContent,
}: CustomerWorkspaceProps) {
  const [activeTabId, setActiveTabId] = useState<CustomerWorkspaceTabId>(layout.defaultTabId);

  const activeTab = useMemo(
    () => layout.tabs.find((tab) => tab.id === activeTabId) ?? layout.tabs[0],
    [activeTabId, layout.tabs],
  );

  const sidebarSections = layout.sidebarSections[activeTab.id] ?? [];
  const tabPanelModel = layout.tabContent[activeTab.id];

  return (
    <div className="space-y-4 sm:space-y-5">
      <CustomerWorkspaceHeader
        title={title}
        subtitle={subtitle}
        customerId={customerId}
        actions={actions}
      />

      <CustomerSummaryCard summary={summary} />

      <CustomerTabs tabs={layout.tabs} activeTabId={activeTab.id} onTabChange={setActiveTabId} />

      <CustomerContent
        main={
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              id={`customer-panel-${activeTab.id}`}
              role="tabpanel"
              aria-labelledby={`customer-tab-${activeTab.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {renderTabContent ? (
                renderTabContent(activeTab.id)
              ) : activeTab.id === "overview" ? (
                <div className="space-y-4">
                  <PriorityBanner config={workflowPanelConfig} model={workflowPanelModel.priorityBanner} />
                  <CustomerHealthCard config={workflowPanelConfig} health={workflowPanelModel.health} />
                  <ReadinessProgress config={workflowPanelConfig} items={workflowPanelModel.readiness} />
                  <WorkflowStatus config={workflowPanelConfig} model={workflowPanelModel.workflowStatus} />
                  <NextBestAction config={workflowPanelConfig} action={workflowPanelModel.nextBestAction} />
                  <AiInsightsPanel
                    model={{
                      recommendations: workflowPanelModel.recommendations,
                      opportunities: insightsPanelModel.opportunities,
                    }}
                  />
                </div>
              ) : activeTab.id === "business-passport" ? (
                <BusinessPassportPanel model={businessPassportPanelModel} />
              ) : activeTab.id === "documents" ? (
                <DocumentsPanel model={documentsPanelModel} />
              ) : activeTab.id === "relationship" ? (
                <RelationshipPanel model={relationshipPanelModel} />
              ) : activeTab.id === "approvals" ? (
                <ApprovalPanel model={approvalPanelModel} />
              ) : activeTab.id === "funding" ? (
                <FundingPanel model={fundingPanelModel} />
              ) : activeTab.id === "timeline" ? (
                <InstitutionalTimeline model={institutionalTimelineModel} />
              ) : (
                <SectionCard title={tabPanelModel.heading} subtitle={activeTab.description}>
                  <p className="text-sm text-slate-300">{tabPanelModel.description}</p>
                  {tabPanelModel.readinessLabel ? (
                    <div className="mt-4">
                      <StatusChip label={tabPanelModel.readinessLabel} variant="info" />
                    </div>
                  ) : null}
                </SectionCard>
              )}
            </motion.div>
          </AnimatePresence>
        }
        sidebar={<CustomerSidebar sections={sidebarSections} />}
      />
    </div>
  );
}
