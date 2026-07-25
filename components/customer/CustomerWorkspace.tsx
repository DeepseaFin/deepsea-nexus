"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomerContent from "@/components/customer/CustomerContent";
import CustomerSidebar from "@/components/customer/CustomerSidebar";
import CustomerSummaryCard from "@/components/customer/CustomerSummaryCard";
import CustomerTabs from "@/components/customer/CustomerTabs";
import CustomerWorkspaceHeader from "@/components/customer/CustomerWorkspaceHeader";
import OnboardingDashboard from "@/components/customer/onboarding/OnboardingDashboard";
import {
  CUSTOMER_WORKSPACE_NAVIGATE_TAB_EVENT,
  type CustomerWorkspaceNavigateTabEventDetail,
  dispatchCustomerWorkspaceActionEvent,
} from "@/lib/customer/customer-workspace.events";
import {
  createCustomerWorkspacePanelRegistry,
  type CustomerWorkspaceRegistryModels,
} from "@/lib/customer/customer-workspace.registry";
import {
  composeCustomerWorkspaceData,
  getCustomerWorkspaceRepositoryLoadingState,
  loadCustomerWorkspaceData,
  type CustomerWorkspaceDataComposition,
  type CustomerWorkspaceSourceData,
} from "@/lib/customer/customer-workspace.data";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import {
  customerWorkspaceLayout,
  defaultCustomerActions,
  defaultCustomerSummary,
} from "@/lib/customer/customer-workspace.layout";
import type { DocumentsPanelModel } from "@/lib/customer/documents/documents-panel.types";
import type { RelationshipPanelModel } from "@/lib/customer/relationship/relationship-panel.types";
import type { ApprovalPanelModel } from "@/lib/customer/approval/approval-panel.types";
import type { FundingPanelModel } from "@/lib/customer/funding/funding-panel.types";
import type { AiInsightsModel } from "@/lib/customer/insights/insights.types";
import type { InstitutionalTimelineModel } from "@/lib/customer/timeline/timeline.types";
import type { WorkflowPanelModel } from "@/lib/customer/workflow/workflow.types";
import type { PassportPanelModel } from "@/lib/customer/business-passport/passport-panel.types";
import type {
  CustomerWorkspaceActionEvent,
  CustomerSummaryModel,
  CustomerWorkspaceAction,
  CustomerWorkspaceLayoutConfig,
  CustomerWorkspaceTabId,
} from "@/lib/customer/customer-workspace.types";
import type { CustomerWorkspaceRepositoryAdapters } from "@/lib/customer/customer-workspace.repositories";

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
  readonly approvalProjection?: unknown;
  readonly fundingProjection?: unknown;
  readonly businessPassportPanelModel?: PassportPanelModel;
  readonly documentsPanelModel?: DocumentsPanelModel;
  readonly relationshipPanelModel?: RelationshipPanelModel;
  readonly approvalPanelModel?: ApprovalPanelModel;
  readonly fundingPanelModel?: FundingPanelModel;
  readonly insightsPanelModel?: AiInsightsModel;
  readonly institutionalTimelineModel?: InstitutionalTimelineModel;
  readonly workflowPanelModel?: WorkflowPanelModel;
  readonly repositoryAdapters?: CustomerWorkspaceRepositoryAdapters;
  readonly loadingByTabId?: Partial<Record<CustomerWorkspaceTabId, boolean>>;
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
  approvalProjection,
  fundingProjection,
  businessPassportPanelModel,
  documentsPanelModel,
  relationshipPanelModel,
  approvalPanelModel,
  fundingPanelModel,
  insightsPanelModel,
  institutionalTimelineModel,
  workflowPanelModel,
  repositoryAdapters,
  loadingByTabId,
  initialTabId,
  onTabChange,
  onAction,
  renderTabContent,
}: CustomerWorkspaceProps) {
  const [activeTabId, setActiveTabId] = useState<CustomerWorkspaceTabId>(initialTabId ?? layout.defaultTabId);

  const panelRef = useRef<HTMLDivElement | null>(null);

  const sourceData = useMemo<CustomerWorkspaceSourceData>(
    () => ({
      businessPassportProjection,
      documentsProjection,
      relationshipProjection,
      approvalProjection,
      fundingProjection,
      businessPassportPanelModel,
      documentsPanelModel,
      relationshipPanelModel,
      approvalPanelModel,
      fundingPanelModel,
      insightsPanelModel,
      institutionalTimelineModel,
      workflowPanelModel,
    }),
    [
      approvalPanelModel,
      approvalProjection,
      businessPassportPanelModel,
      businessPassportProjection,
      documentsPanelModel,
      documentsProjection,
      fundingPanelModel,
      fundingProjection,
      insightsPanelModel,
      institutionalTimelineModel,
      relationshipPanelModel,
      relationshipProjection,
      workflowPanelModel,
    ],
  );

  const baselineWorkspaceData = useMemo<CustomerWorkspaceDataComposition>(
    () =>
      composeCustomerWorkspaceData({
        customerId,
        customerName: summary.customerName,
        source: sourceData,
      }),
    [customerId, sourceData, summary.customerName],
  );

  const [repositoryWorkspaceData, setRepositoryWorkspaceData] =
    useState<CustomerWorkspaceDataComposition | null>(null);
  const [repositoryLoadingByTabId, setRepositoryLoadingByTabId] =
    useState<Partial<Record<CustomerWorkspaceTabId, boolean>>>({});

  useEffect(() => {
    let cancelled = false;

    if (!repositoryAdapters) {
      return () => {
        cancelled = true;
      };
    }

    void (async () => {
      setRepositoryWorkspaceData(null);
      setRepositoryLoadingByTabId(getCustomerWorkspaceRepositoryLoadingState(repositoryAdapters));

      try {
        const loadedData = await loadCustomerWorkspaceData({
          customerId,
          customerName: summary.customerName,
          source: sourceData,
          repositoryAdapters,
        });

        if (cancelled) {
          return;
        }

        setRepositoryWorkspaceData(loadedData);
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : "Workspace data composition failed.";
        setRepositoryWorkspaceData({
          ...baselineWorkspaceData,
          errorByTabId: {
            ...baselineWorkspaceData.errorByTabId,
            overview: message,
          },
        });
      } finally {
        if (!cancelled) {
          setRepositoryLoadingByTabId({});
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [baselineWorkspaceData, customerId, repositoryAdapters, sourceData, summary.customerName]);

  const workspaceData = repositoryAdapters
    ? (repositoryWorkspaceData ?? baselineWorkspaceData)
    : baselineWorkspaceData;

  const businessPassportViewModel = workspaceData.viewModels.businessPassport;
  const documentsViewModel = workspaceData.viewModels.documents;
  const relationshipViewModel = workspaceData.viewModels.relationship;
  const approvalViewModel = workspaceData.viewModels.approvals;
  const fundingViewModel = workspaceData.viewModels.funding;
  const aiInsightsViewModel = workspaceData.viewModels.aiInsights;
  const institutionalTimelineViewModel = workspaceData.viewModels.timeline;
  const workflowViewModel = workspaceData.viewModels.workflow;

  const workspaceIntelligence = workspaceData.workspaceIntelligence;

  const resolvedBusinessPassportPanelModel = workspaceData.resolved.businessPassportPanelModel;
  const resolvedDocumentsPanelModel = workspaceData.resolved.documentsPanelModel;
  const resolvedRelationshipPanelModel = workspaceData.resolved.relationshipPanelModel;
  const resolvedApprovalPanelModel = workspaceData.resolved.approvalPanelModel;
  const resolvedFundingPanelModel = workspaceData.resolved.fundingPanelModel;
  const resolvedInsightsPanelModel = workspaceData.resolved.insightsPanelModel;
  const resolvedInstitutionalTimelineModel = workspaceData.resolved.institutionalTimelineModel;
  const resolvedWorkflowPanelModel = workspaceData.resolved.workflowPanelModel;

  const errorByTabId = workspaceData.errorByTabId;

  const mergedLoadingByTabId = useMemo<Partial<Record<CustomerWorkspaceTabId, boolean>>>(
    () => ({
      overview: Boolean(loadingByTabId?.overview || repositoryLoadingByTabId.overview),
      "business-passport": Boolean(
        loadingByTabId?.["business-passport"] || repositoryLoadingByTabId["business-passport"],
      ),
      documents: Boolean(loadingByTabId?.documents || repositoryLoadingByTabId.documents),
      relationship: Boolean(loadingByTabId?.relationship || repositoryLoadingByTabId.relationship),
      approvals: Boolean(loadingByTabId?.approvals || repositoryLoadingByTabId.approvals),
      funding: Boolean(loadingByTabId?.funding || repositoryLoadingByTabId.funding),
      "ai-insights": Boolean(loadingByTabId?.["ai-insights"] || repositoryLoadingByTabId["ai-insights"]),
      timeline: Boolean(loadingByTabId?.timeline || repositoryLoadingByTabId.timeline),
    }),
    [loadingByTabId, repositoryLoadingByTabId],
  );

  const registryModels: CustomerWorkspaceRegistryModels = useMemo(() => {
    return {
      businessPassportPanelModel: resolvedBusinessPassportPanelModel,
      businessPassportViewModel,
      documentsPanelModel: resolvedDocumentsPanelModel,
      documentsViewModel,
      relationshipPanelModel: resolvedRelationshipPanelModel,
      relationshipViewModel,
      approvalPanelModel: resolvedApprovalPanelModel,
      approvalViewModel,
      fundingViewModel,
      aiInsightsViewModel,
      institutionalTimelineViewModel,
      workflowViewModel,
      fundingPanelModel: resolvedFundingPanelModel,
      insightsPanelModel: resolvedInsightsPanelModel,
      institutionalTimelineModel: resolvedInstitutionalTimelineModel,
      workflowPanelModel: resolvedWorkflowPanelModel,
      workspaceIntelligence,
      loadingByTabId: mergedLoadingByTabId,
      errorByTabId,
    };
  }, [
    resolvedApprovalPanelModel,
    businessPassportViewModel,
    documentsViewModel,
    resolvedBusinessPassportPanelModel,
    resolvedDocumentsPanelModel,
    resolvedFundingPanelModel,
    resolvedInsightsPanelModel,
    resolvedInstitutionalTimelineModel,
    relationshipViewModel,
    resolvedRelationshipPanelModel,
    resolvedWorkflowPanelModel,
    approvalViewModel,
    fundingViewModel,
    aiInsightsViewModel,
    institutionalTimelineViewModel,
    workflowViewModel,
    workspaceIntelligence,
    mergedLoadingByTabId,
    errorByTabId,
  ]);

  const panelRegistry = useMemo(
    () => createCustomerWorkspacePanelRegistry(registryModels),
    [registryModels],
  );

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
  const onboardingProgress = workspaceIntelligence.onboardingProgress;
  const onboardingWorkflow = workspaceIntelligence.onboardingWorkflow;
  const summaryWithOnboarding: CustomerSummaryModel = {
    ...summary,
    onboardingProgress: {
      overallCompletionPercent: onboardingProgress.overallCompletionPercent,
      currentStageLabel: onboardingProgress.currentStage.label,
      blockedStageLabels: onboardingProgress.blockedStages.map((stage) => stage.label),
      recommendedNextStageLabel: onboardingProgress.recommendedNextStage.label,
      lifecycleStageLabel: onboardingWorkflow.currentLifecycleStage,
      fundingReadinessLabel: onboardingWorkflow.fundingReadiness,
      criticalBlockerLabels: onboardingWorkflow.blockers.map((blocker) => blocker.title),
    },
  };

  const onboardingDashboardStates = {
    decisionBoard: {
      isLoading: mergedLoadingByTabId.overview,
      error: errorByTabId.overview,
    },
    customerHealth: {
      isLoading: mergedLoadingByTabId.overview,
      error: errorByTabId.overview,
    },
    creditAssessment: {
      isLoading: mergedLoadingByTabId.approvals,
      error: errorByTabId.approvals,
    },
    approvalWorkflow: {
      isLoading: mergedLoadingByTabId.approvals,
      error: errorByTabId.approvals,
    },
    evidenceOverview: {
      isLoading: mergedLoadingByTabId.documents,
      error: errorByTabId.documents,
    },
    journey: {
      isLoading: mergedLoadingByTabId.overview,
      error: errorByTabId.overview,
    },
    fundingReadiness: {
      isLoading: mergedLoadingByTabId.funding,
      error: errorByTabId.funding,
    },
    decisionSummary: {
      isLoading: mergedLoadingByTabId.overview,
      error: errorByTabId.overview,
    },
    blockers: {
      isLoading: mergedLoadingByTabId.overview,
      error: errorByTabId.overview,
    },
    requiredDocuments: {
      isLoading: mergedLoadingByTabId.documents,
      error: errorByTabId.documents,
    },
    pendingApprovals: {
      isLoading: mergedLoadingByTabId.approvals,
      error: errorByTabId.approvals,
    },
    relationshipHealth: {
      isLoading: mergedLoadingByTabId.relationship,
      error: errorByTabId.relationship,
    },
    nextAction: {
      isLoading: mergedLoadingByTabId.overview,
      error: errorByTabId.overview,
    },
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <CustomerWorkspaceHeader
        title={title}
        subtitle={subtitle}
        customerId={customerId}
        actions={actions}
        onAction={handleAction}
      />

      <OnboardingDashboard
        model={workspaceIntelligence.onboardingDashboard}
        sectionStates={onboardingDashboardStates}
      />

      <CustomerSummaryCard summary={summaryWithOnboarding} />

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
