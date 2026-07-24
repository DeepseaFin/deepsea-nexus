"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomerContent from "@/components/customer/CustomerContent";
import CustomerSidebar from "@/components/customer/CustomerSidebar";
import CustomerSummaryCard from "@/components/customer/CustomerSummaryCard";
import CustomerTabs from "@/components/customer/CustomerTabs";
import CustomerWorkspaceHeader from "@/components/customer/CustomerWorkspaceHeader";
import { createCustomerWorkspaceComposition } from "@/lib/application/CustomerWorkspaceComposition";
import { defaultPassportPanelModel } from "@/lib/customer/business-passport/passport-panel.config";
import {
  CUSTOMER_WORKSPACE_NAVIGATE_TAB_EVENT,
  type CustomerWorkspaceNavigateTabEventDetail,
  dispatchCustomerWorkspaceActionEvent,
} from "@/lib/customer/customer-workspace.events";
import {
  createCustomerWorkspacePanelRegistry,
  type CustomerWorkspaceRegistryModels,
} from "@/lib/customer/customer-workspace.registry";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import {
  customerWorkspaceLayout,
  defaultCustomerActions,
  defaultCustomerSummary,
} from "@/lib/customer/customer-workspace.layout";
import { defaultDocumentsPanelModel } from "@/lib/customer/documents/documents-panel.config";
import type { DocumentsPanelModel } from "@/lib/customer/documents/documents-panel.types";
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
import { defaultWorkflowPanelModel } from "@/lib/customer/workflow/workflow.config";
import type { WorkflowPanelModel } from "@/lib/customer/workflow/workflow.types";
import type {
  CustomerWorkspaceActionEvent,
  CustomerSummaryModel,
  CustomerWorkspaceAction,
  CustomerWorkspaceLayoutConfig,
  CustomerWorkspaceTabId,
} from "@/lib/customer/customer-workspace.types";
import type { DocumentsPresentationViewModel } from "@/lib/presentation/presenters/DocumentsPresenter";
import type { BusinessPassportPresentationViewModel } from "@/lib/presentation/presenters/BusinessPassportPresenter";
import type { RelationshipPresentationViewModel } from "@/lib/presentation/presenters/RelationshipPresenter";

export interface CustomerWorkspaceProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly customerId?: string;
  readonly summary?: CustomerSummaryModel;
  readonly actions?: readonly CustomerWorkspaceAction[];
  readonly layout?: CustomerWorkspaceLayoutConfig;
  readonly businessPassportProjection?: unknown;
  readonly documentsProjection?: unknown;
  readonly relationshipProjection?: unknown;
  readonly documentsPanelModel?: DocumentsPanelModel;
  readonly relationshipPanelModel?: RelationshipPanelModel;
  readonly approvalPanelModel?: ApprovalPanelModel;
  readonly fundingPanelModel?: FundingPanelModel;
  readonly insightsPanelModel?: AiInsightsModel;
  readonly institutionalTimelineModel?: InstitutionalTimelineModel;
  readonly workflowPanelModel?: WorkflowPanelModel;
  readonly initialTabId?: CustomerWorkspaceTabId;
  readonly onTabChange?: (tabId: CustomerWorkspaceTabId) => void;
  readonly onAction?: (event: CustomerWorkspaceActionEvent) => void;
  readonly renderTabContent?: (tabId: CustomerWorkspaceTabId) => React.ReactNode;
}

export default function CustomerWorkspace({
  title = "Institution Customer Workspace",
  subtitle = "Primary operating surface for customer capabilities and decision context",
  customerId,
  summary = defaultCustomerSummary,
  actions = defaultCustomerActions,
  layout = customerWorkspaceLayout,
  businessPassportProjection,
  documentsProjection,
  relationshipProjection,
  documentsPanelModel = defaultDocumentsPanelModel,
  relationshipPanelModel = defaultRelationshipPanelModel,
  approvalPanelModel = defaultApprovalPanelModel,
  fundingPanelModel = defaultFundingPanelModel,
  insightsPanelModel = defaultAiInsightsModel,
  institutionalTimelineModel = defaultInstitutionalTimelineModel,
  workflowPanelModel = defaultWorkflowPanelModel,
  initialTabId,
  onTabChange,
  onAction,
  renderTabContent,
}: CustomerWorkspaceProps) {
  const [activeTabId, setActiveTabId] = useState<CustomerWorkspaceTabId>(initialTabId ?? layout.defaultTabId);

  const panelRef = useRef<HTMLDivElement | null>(null);

  const businessPassportViewModel = useMemo<BusinessPassportPresentationViewModel | null>(() => {
    if (!businessPassportProjection) {
      return null;
    }

    const composition = createCustomerWorkspaceComposition();
    const result = composition.resolveBusinessPassportViewModel(businessPassportProjection);

    return result.ok ? result.viewModel : null;
  }, [businessPassportProjection]);

  const documentsViewModel = useMemo<DocumentsPresentationViewModel | null>(() => {
    if (!documentsProjection) {
      return null;
    }

    const composition = createCustomerWorkspaceComposition();
    const result = composition.resolveDocumentsViewModel(documentsProjection);

    return result.ok ? result.viewModel : null;
  }, [documentsProjection]);

  const relationshipViewModel = useMemo<RelationshipPresentationViewModel | null>(() => {
    if (!relationshipProjection) {
      return null;
    }

    const composition = createCustomerWorkspaceComposition();
    const result = composition.resolveRelationshipViewModel(relationshipProjection);

    return result.ok ? result.viewModel : null;
  }, [relationshipProjection]);

  const registryModels: CustomerWorkspaceRegistryModels = useMemo(() => {
    return {
      businessPassportPanelModel: defaultPassportPanelModel,
      businessPassportViewModel,
      documentsPanelModel,
      documentsViewModel,
      relationshipPanelModel,
      relationshipViewModel,
      approvalPanelModel,
      fundingPanelModel,
      insightsPanelModel,
      institutionalTimelineModel,
      workflowPanelModel,
    };
  }, [
    approvalPanelModel,
    businessPassportViewModel,
    documentsViewModel,
    documentsPanelModel,
    fundingPanelModel,
    insightsPanelModel,
    institutionalTimelineModel,
    relationshipViewModel,
    relationshipPanelModel,
    workflowPanelModel,
  ]);

  const panelRegistry = useMemo(
    () => createCustomerWorkspacePanelRegistry(registryModels),
    [registryModels],
  );

  useEffect(() => {
    if (!initialTabId) {
      return;
    }

    setActiveTabId(initialTabId);
  }, [initialTabId]);

  useEffect(() => {
    panelRef.current?.focus();
  }, [activeTabId]);

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<CustomerWorkspaceNavigateTabEventDetail>;
      const nextTabId = customEvent.detail?.tabId;

      if (!nextTabId) {
        return;
      }

      const tabExists = layout.tabs.some((tab) => tab.id === nextTabId && !tab.disabled);
      if (!tabExists) {
        return;
      }

      setActiveTabId(nextTabId);
      onTabChange?.(nextTabId);
    };

    window.addEventListener(CUSTOMER_WORKSPACE_NAVIGATE_TAB_EVENT, listener as EventListener);
    return () => {
      window.removeEventListener(CUSTOMER_WORKSPACE_NAVIGATE_TAB_EVENT, listener as EventListener);
    };
  }, [layout.tabs, onTabChange]);

  const handleTabChange = (tabId: CustomerWorkspaceTabId) => {
    setActiveTabId(tabId);
    onTabChange?.(tabId);
  };

  const handleAction = (event: CustomerWorkspaceActionEvent) => {
    onAction?.(event);
    dispatchCustomerWorkspaceActionEvent(event);
  };

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
        onAction={handleAction}
      />

      <CustomerSummaryCard summary={summary} />

      <CustomerTabs tabs={layout.tabs} activeTabId={activeTab.id} onTabChange={handleTabChange} />

      <CustomerContent
        main={
          <AnimatePresence mode="wait">
            <motion.div
              ref={panelRef}
              key={activeTab.id}
              id={`customer-panel-${activeTab.id}`}
              role="tabpanel"
              aria-labelledby={`customer-tab-${activeTab.id}`}
              tabIndex={-1}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {renderTabContent ? (
                renderTabContent(activeTab.id)
              ) : panelRegistry[activeTab.id] ? (
                panelRegistry[activeTab.id]()
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
