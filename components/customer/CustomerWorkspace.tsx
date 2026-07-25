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
import type { DocumentsPresentationViewModel } from "@/lib/presentation/presenters/DocumentsPresenter";
import type { ApprovalPresentationViewModel } from "@/lib/presentation/presenters/ApprovalPresenter";
import type { FundingPresentationViewModel } from "@/lib/presentation/presenters/FundingPresenter";
import type { AiInsightsPresentationViewModel } from "@/lib/presentation/presenters/AiInsightsPresenter";
import type { InstitutionalTimelinePresentationViewModel } from "@/lib/presentation/presenters/InstitutionalTimelinePresenter";
import type { WorkflowPresentationViewModel } from "@/lib/presentation/presenters/WorkflowPresenter";
import type { BusinessPassportPresentationViewModel } from "@/lib/presentation/presenters/BusinessPassportPresenter";
import type { RelationshipPresentationViewModel } from "@/lib/presentation/presenters/RelationshipPresenter";
import type {
  CustomerWorkspaceRepositoryAdapters,
  CustomerWorkspaceRepositoryContext,
} from "@/lib/customer/customer-workspace.repositories";

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

type CustomerWorkspaceRepositoryData = {
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
};

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

  const composition = useMemo(() => createCustomerWorkspaceComposition(), []);
  const [repositoryData, setRepositoryData] = useState<CustomerWorkspaceRepositoryData>({});
  const [repositoryLoadingByTabId, setRepositoryLoadingByTabId] =
    useState<Partial<Record<CustomerWorkspaceTabId, boolean>>>({});
  const [repositoryErrorByTabId, setRepositoryErrorByTabId] =
    useState<Partial<Record<CustomerWorkspaceTabId, string>>>({});

  useEffect(() => {
    let cancelled = false;

    if (!repositoryAdapters) {
      return () => {
        cancelled = true;
      };
    }

    const context: CustomerWorkspaceRepositoryContext = {
      customerId,
    };

    const loaders = [
      { key: "businessPassportProjection", tabId: "business-passport", load: repositoryAdapters.businessPassportProjection },
      { key: "documentsProjection", tabId: "documents", load: repositoryAdapters.documentsProjection },
      { key: "relationshipProjection", tabId: "relationship", load: repositoryAdapters.relationshipProjection },
      { key: "approvalProjection", tabId: "approvals", load: repositoryAdapters.approvalProjection },
      { key: "fundingProjection", tabId: "funding", load: repositoryAdapters.fundingProjection },
      { key: "businessPassportPanelModel", tabId: "business-passport", load: repositoryAdapters.businessPassportPanelModel },
      { key: "documentsPanelModel", tabId: "documents", load: repositoryAdapters.documentsPanelModel },
      { key: "relationshipPanelModel", tabId: "relationship", load: repositoryAdapters.relationshipPanelModel },
      { key: "approvalPanelModel", tabId: "approvals", load: repositoryAdapters.approvalPanelModel },
      { key: "fundingPanelModel", tabId: "funding", load: repositoryAdapters.fundingPanelModel },
      { key: "insightsPanelModel", tabId: "ai-insights", load: repositoryAdapters.insightsPanelModel },
      { key: "institutionalTimelineModel", tabId: "timeline", load: repositoryAdapters.institutionalTimelineModel },
      { key: "workflowPanelModel", tabId: "overview", load: repositoryAdapters.workflowPanelModel },
    ] as const;

    const activeLoaders = loaders.filter((loader) => typeof loader.load === "function");
    if (activeLoaders.length === 0) {
      return () => {
        cancelled = true;
      };
    }

    const loadingState: Partial<Record<CustomerWorkspaceTabId, boolean>> = {};
    for (const loader of activeLoaders) {
      loadingState[loader.tabId] = true;
    }

    void (async () => {
      setRepositoryLoadingByTabId(loadingState);
      setRepositoryErrorByTabId({});

      const results = await Promise.all(
        activeLoaders.map(async (loader) => {
          try {
            const value = await loader.load(context);
            return { key: loader.key, tabId: loader.tabId, value };
          } catch (error) {
            const message = error instanceof Error ? error.message : "Repository adapter failed to resolve data.";
            return { key: loader.key, tabId: loader.tabId, error: message };
          }
        }),
      );

      if (cancelled) {
        return;
      }

      const nextData: Partial<CustomerWorkspaceRepositoryData> = {};
      const nextErrors: Partial<Record<CustomerWorkspaceTabId, string>> = {};

      for (const result of results) {
        if ("error" in result) {
          nextErrors[result.tabId] = result.error;
          continue;
        }

        if (typeof result.value !== "undefined") {
          (nextData as Record<string, unknown>)[result.key] = result.value;
        }
      }

      setRepositoryData(nextData as CustomerWorkspaceRepositoryData);
      setRepositoryErrorByTabId(nextErrors);
      setRepositoryLoadingByTabId({});
    })();

    return () => {
      cancelled = true;
    };
  }, [customerId, repositoryAdapters]);

  const resolvedBusinessPassportProjection = repositoryAdapters
    ? (repositoryData.businessPassportProjection ?? businessPassportProjection)
    : businessPassportProjection;
  const resolvedDocumentsProjection = repositoryAdapters
    ? (repositoryData.documentsProjection ?? documentsProjection)
    : documentsProjection;
  const resolvedRelationshipProjection = repositoryAdapters
    ? (repositoryData.relationshipProjection ?? relationshipProjection)
    : relationshipProjection;
  const resolvedApprovalProjection = repositoryAdapters
    ? (repositoryData.approvalProjection ?? approvalProjection)
    : approvalProjection;
  const resolvedFundingProjection = repositoryAdapters
    ? (repositoryData.fundingProjection ?? fundingProjection)
    : fundingProjection;
  const resolvedBusinessPassportPanelModel = repositoryAdapters
    ? (repositoryData.businessPassportPanelModel ?? businessPassportPanelModel)
    : businessPassportPanelModel;
  const resolvedDocumentsPanelModel = repositoryAdapters
    ? (repositoryData.documentsPanelModel ?? documentsPanelModel)
    : documentsPanelModel;
  const resolvedRelationshipPanelModel = repositoryAdapters
    ? (repositoryData.relationshipPanelModel ?? relationshipPanelModel)
    : relationshipPanelModel;
  const resolvedApprovalPanelModel = repositoryAdapters
    ? (repositoryData.approvalPanelModel ?? approvalPanelModel)
    : approvalPanelModel;
  const resolvedFundingPanelModel = repositoryAdapters
    ? (repositoryData.fundingPanelModel ?? fundingPanelModel)
    : fundingPanelModel;
  const resolvedInsightsPanelModel = repositoryAdapters
    ? (repositoryData.insightsPanelModel ?? insightsPanelModel)
    : insightsPanelModel;
  const resolvedInstitutionalTimelineModel = repositoryAdapters
    ? (repositoryData.institutionalTimelineModel ?? institutionalTimelineModel)
    : institutionalTimelineModel;
  const resolvedWorkflowPanelModel = repositoryAdapters
    ? (repositoryData.workflowPanelModel ?? workflowPanelModel)
    : workflowPanelModel;

  const businessPassportPresentation = useMemo(() => {
    if (!resolvedBusinessPassportProjection) {
      return { viewModel: null, error: undefined as string | undefined };
    }

    const result = composition.resolveBusinessPassportViewModel(resolvedBusinessPassportProjection);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, resolvedBusinessPassportProjection]);

  const documentsPresentation = useMemo(() => {
    const documentsInput = resolvedDocumentsProjection ?? resolvedDocumentsPanelModel;
    if (!documentsInput) {
      return { viewModel: null, error: undefined as string | undefined };
    }

    const result = composition.resolveDocumentsViewModel(documentsInput);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, resolvedDocumentsProjection, resolvedDocumentsPanelModel]);

  const relationshipPresentation = useMemo(() => {
    if (!resolvedRelationshipProjection) {
      return { viewModel: null, error: undefined as string | undefined };
    }

    const result = composition.resolveRelationshipViewModel(resolvedRelationshipProjection);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, resolvedRelationshipProjection]);

  const approvalPresentation = useMemo(() => {
    if (!resolvedApprovalProjection) {
      return { viewModel: null, error: undefined as string | undefined };
    }

    const result = composition.resolveApprovalViewModel(resolvedApprovalProjection);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, resolvedApprovalProjection]);

  const fundingPresentation = useMemo(() => {
    const fundingInput = resolvedFundingProjection ?? resolvedFundingPanelModel;
    if (!fundingInput) {
      return { viewModel: null, error: undefined as string | undefined };
    }

    const result = composition.resolveFundingViewModel(fundingInput);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, resolvedFundingProjection, resolvedFundingPanelModel]);

  const aiInsightsPresentation = useMemo(() => {
    if (!resolvedInsightsPanelModel) {
      return { viewModel: null, error: undefined as string | undefined };
    }

    const result = composition.resolveAiInsightsViewModel(resolvedInsightsPanelModel);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, resolvedInsightsPanelModel]);

  const institutionalTimelinePresentation = useMemo(() => {
    if (!resolvedInstitutionalTimelineModel) {
      return { viewModel: null, error: undefined as string | undefined };
    }

    const result = composition.resolveInstitutionalTimelineViewModel(resolvedInstitutionalTimelineModel);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, resolvedInstitutionalTimelineModel]);

  const workflowPresentation = useMemo(() => {
    if (!resolvedWorkflowPanelModel) {
      return { viewModel: null, error: undefined as string | undefined };
    }

    const result = composition.resolveWorkflowViewModel(resolvedWorkflowPanelModel);

    return result.ok
      ? { viewModel: result.viewModel, error: undefined as string | undefined }
      : { viewModel: null, error: result.reason };
  }, [composition, resolvedWorkflowPanelModel]);

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
      "business-passport": businessPassportPresentation.error ?? repositoryErrorByTabId["business-passport"],
      documents: documentsPresentation.error ?? repositoryErrorByTabId.documents,
      relationship: relationshipPresentation.error ?? repositoryErrorByTabId.relationship,
      approvals: approvalPresentation.error ?? repositoryErrorByTabId.approvals,
      funding: fundingPresentation.error ?? repositoryErrorByTabId.funding,
      "ai-insights": aiInsightsPresentation.error ?? repositoryErrorByTabId["ai-insights"],
      timeline: institutionalTimelinePresentation.error ?? repositoryErrorByTabId.timeline,
      overview: workflowPresentation.error ?? repositoryErrorByTabId.overview,
    }),
    [
      approvalPresentation.error,
      aiInsightsPresentation.error,
      businessPassportPresentation.error,
      documentsPresentation.error,
      fundingPresentation.error,
      institutionalTimelinePresentation.error,
      repositoryErrorByTabId,
      relationshipPresentation.error,
      workflowPresentation.error,
    ],
  );

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
