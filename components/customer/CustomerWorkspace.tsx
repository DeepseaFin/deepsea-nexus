"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomerContent from "@/components/customer/CustomerContent";
import CustomerSidebar from "@/components/customer/CustomerSidebar";
import CustomerSummaryCard from "@/components/customer/CustomerSummaryCard";
import CustomerTabs from "@/components/customer/CustomerTabs";
import CustomerWorkspaceHeader from "@/components/customer/CustomerWorkspaceHeader";
import OnboardingDashboard from "@/components/customer/onboarding/OnboardingDashboard";
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
import type { WorkspaceIntelligenceModel } from "@/lib/application/WorkspaceIntelligence";
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
import type { ApprovalPresentationViewModel } from "@/lib/presentation/presenters/ApprovalPresenter";
import type { FundingPresentationViewModel } from "@/lib/presentation/presenters/FundingPresenter";
import type { AiInsightsPresentationViewModel } from "@/lib/presentation/presenters/AiInsightsPresenter";
import type { InstitutionalTimelinePresentationViewModel } from "@/lib/presentation/presenters/InstitutionalTimelinePresenter";
import type { WorkflowPresentationViewModel } from "@/lib/presentation/presenters/WorkflowPresenter";
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
  readonly approvalProjection?: unknown;
  readonly fundingProjection?: unknown;
  readonly documentsPanelModel?: DocumentsPanelModel;
  readonly relationshipPanelModel?: RelationshipPanelModel;
  readonly approvalPanelModel?: ApprovalPanelModel;
  readonly fundingPanelModel?: FundingPanelModel;
  readonly insightsPanelModel?: AiInsightsModel;
  readonly institutionalTimelineModel?: InstitutionalTimelineModel;
  readonly workflowPanelModel?: WorkflowPanelModel;
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
  documentsPanelModel = defaultDocumentsPanelModel,
  relationshipPanelModel = defaultRelationshipPanelModel,
  approvalPanelModel = defaultApprovalPanelModel,
  fundingPanelModel = defaultFundingPanelModel,
  insightsPanelModel = defaultAiInsightsModel,
  institutionalTimelineModel = defaultInstitutionalTimelineModel,
  workflowPanelModel = defaultWorkflowPanelModel,
  loadingByTabId,
  initialTabId,
  onTabChange,
  onAction,
  renderTabContent,
}: CustomerWorkspaceProps) {
  const [activeTabId, setActiveTabId] = useState<CustomerWorkspaceTabId>(initialTabId ?? layout.defaultTabId);

  const panelRef = useRef<HTMLDivElement | null>(null);

  const composition = useMemo(() => createCustomerWorkspaceComposition(), []);

  const businessPassportPresentation = useMemo(() => {
    if (!businessPassportProjection) {
      return { viewModel: null, error: undefined as string | undefined };
    }

    const result = composition.resolveBusinessPassportViewModel(businessPassportProjection);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [businessPassportProjection, composition]);

  const documentsPresentation = useMemo(() => {
    const documentsInput = documentsProjection ?? documentsPanelModel;
    const result = composition.resolveDocumentsViewModel(documentsInput);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, documentsProjection, documentsPanelModel]);

  const relationshipPresentation = useMemo(() => {
    if (!relationshipProjection) {
      return { viewModel: null, error: undefined as string | undefined };
    }

    const result = composition.resolveRelationshipViewModel(relationshipProjection);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, relationshipProjection]);

  const approvalPresentation = useMemo(() => {
    if (!approvalProjection) {
      return { viewModel: null, error: undefined as string | undefined };
    }

    const result = composition.resolveApprovalViewModel(approvalProjection);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [approvalProjection, composition]);

  const fundingPresentation = useMemo(() => {
    const fundingInput = fundingProjection ?? fundingPanelModel;
    const result = composition.resolveFundingViewModel(fundingInput);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, fundingProjection, fundingPanelModel]);

  const aiInsightsPresentation = useMemo(() => {
    const result = composition.resolveAiInsightsViewModel(insightsPanelModel);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, insightsPanelModel]);

  const institutionalTimelinePresentation = useMemo(() => {
    const result = composition.resolveInstitutionalTimelineViewModel(institutionalTimelineModel);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, institutionalTimelineModel]);

  const workflowPresentation = useMemo(() => {
    const result = composition.resolveWorkflowViewModel(workflowPanelModel);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, workflowPanelModel]);

  const businessPassportViewModel: BusinessPassportPresentationViewModel | null =
    businessPassportPresentation.viewModel;
  const documentsViewModel: DocumentsPresentationViewModel | null = documentsPresentation.viewModel;
  const relationshipViewModel: RelationshipPresentationViewModel | null = relationshipPresentation.viewModel;
  const approvalViewModel: ApprovalPresentationViewModel | null = approvalPresentation.viewModel;
  const fundingViewModel: FundingPresentationViewModel | null = fundingPresentation.viewModel;
  const aiInsightsViewModel: AiInsightsPresentationViewModel | null = aiInsightsPresentation.viewModel;
  const institutionalTimelineViewModel: InstitutionalTimelinePresentationViewModel | null =
    institutionalTimelinePresentation.viewModel;
  const workflowViewModel: WorkflowPresentationViewModel | null = workflowPresentation.viewModel;

  const workspaceIntelligence = useMemo<WorkspaceIntelligenceModel>(
    () =>
      composition.composeWorkspaceIntelligence({
        customer: {
          id: customerId,
          name: summary.customerName,
        },
        businessPassport: businessPassportViewModel,
        documents: documentsViewModel,
        relationship: relationshipViewModel,
        approvals: approvalViewModel,
        funding: fundingViewModel,
        aiInsights: aiInsightsViewModel,
        timeline: institutionalTimelineViewModel,
        workflow: workflowViewModel,
      }),
    [
      aiInsightsViewModel,
      approvalViewModel,
      businessPassportViewModel,
      customerId,
      composition,
      documentsViewModel,
      fundingViewModel,
      institutionalTimelineViewModel,
      relationshipViewModel,
      summary.customerName,
      workflowViewModel,
    ],
  );

  const errorByTabId = useMemo<Partial<Record<CustomerWorkspaceTabId, string>>>(
    () => ({
      "business-passport": businessPassportPresentation.error,
      documents: documentsPresentation.error,
      relationship: relationshipPresentation.error,
      approvals: approvalPresentation.error,
      funding: fundingPresentation.error,
      "ai-insights": aiInsightsPresentation.error,
      timeline: institutionalTimelinePresentation.error,
      overview: workflowPresentation.error,
    }),
    [
      approvalPresentation.error,
      aiInsightsPresentation.error,
      businessPassportPresentation.error,
      documentsPresentation.error,
      fundingPresentation.error,
      institutionalTimelinePresentation.error,
      relationshipPresentation.error,
      workflowPresentation.error,
    ],
  );

  const registryModels: CustomerWorkspaceRegistryModels = useMemo(() => {
    return {
      businessPassportPanelModel: defaultPassportPanelModel,
      businessPassportViewModel,
      documentsPanelModel,
      documentsViewModel,
      relationshipPanelModel,
      relationshipViewModel,
      approvalPanelModel,
      approvalViewModel,
      fundingViewModel,
      aiInsightsViewModel,
      institutionalTimelineViewModel,
      workflowViewModel,
      fundingPanelModel,
      insightsPanelModel,
      institutionalTimelineModel,
      workflowPanelModel,
      workspaceIntelligence,
      loadingByTabId,
      errorByTabId,
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
    approvalViewModel,
    fundingViewModel,
    aiInsightsViewModel,
    institutionalTimelineViewModel,
    workflowViewModel,
    workspaceIntelligence,
    loadingByTabId,
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
    customerHealth: {
      isLoading: loadingByTabId?.overview,
      error: errorByTabId.overview,
    },
    journey: {
      isLoading: loadingByTabId?.overview,
      error: errorByTabId.overview,
    },
    fundingReadiness: {
      isLoading: loadingByTabId?.funding,
      error: errorByTabId.funding,
    },
    decisionSummary: {
      isLoading: loadingByTabId?.overview,
      error: errorByTabId.overview,
    },
    blockers: {
      isLoading: loadingByTabId?.overview,
      error: errorByTabId.overview,
    },
    requiredDocuments: {
      isLoading: loadingByTabId?.documents,
      error: errorByTabId.documents,
    },
    pendingApprovals: {
      isLoading: loadingByTabId?.approvals,
      error: errorByTabId.approvals,
    },
    relationshipHealth: {
      isLoading: loadingByTabId?.relationship,
      error: errorByTabId.relationship,
    },
    nextAction: {
      isLoading: loadingByTabId?.overview,
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
