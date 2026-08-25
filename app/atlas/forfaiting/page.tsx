import ForfaitingWorkspace from "@/src/capabilities/forfaiting/components/ForfaitingWorkspace";
import type { ForfaittingWorkspaceState, ReceivableQueueItem } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";
import { createCanonicalReleaseOneRuntimeComposition } from "@/lib/application/InstitutionRuntimeComposition";
import {
  createBusinessContext,
  parseBusinessContext,
  serializeBusinessContext,
  transitionBusinessContext,
  type WorkflowContextRepository,
} from "@/lib/workflows/WorkflowContext";
import {
  OpportunityLifecycle,
  canTransitionOpportunityLifecycle,
  transitionOpportunityLifecycle,
} from "@/lib/workflows/WorkflowTransition";
import { getDemoScenario } from "@/lib/workflows/DemoScenario";

const FORFAITTING_WORKSPACE_STATE: ForfaittingWorkspaceState = {
  workspaceId: "FOR-8810",
  deskName: "Deepsea Forfaiting Desk",
  portfolioName: "Emerging Market Receivables",
  status: "active",
  reviewDate: "2026-07-15",
  sidebar: [
    { key: "queue", label: "Receivable Queue" },
    { key: "detail", label: "Receivable Detail" },
    { key: "pricing", label: "Pricing Workbench" },
    { key: "funding", label: "Funding Panel" },
    { key: "purchase", label: "Purchase Panel" },
    { key: "settlement", label: "Settlement Tracker" },
    { key: "collections", label: "Collections Board" },
    { key: "exposure", label: "Exposure Dashboard" },
    { key: "portfolio", label: "Portfolio Summary" },
    { key: "risk", label: "Risk Indicators" },
  ],
  receivableQueue: [
    { id: "RQ-1", obligor: "Nile Agro Imports", exporter: "Blue Ocean Trading", amount: "USD 2.4M", tenorDays: 120, status: "review" },
    { id: "RQ-2", obligor: "Atlas Metals", exporter: "Eastern Export FZE", amount: "USD 3.1M", tenorDays: 180, status: "approved" },
    { id: "RQ-3", obligor: "Sahara Industrial", exporter: "Meridian Trade House", amount: "USD 1.6M", tenorDays: 90, status: "new" },
  ],
  receivableDetail: {
    receivableId: "RCV-2026-044",
    currency: "USD",
    amount: "USD 2.4M",
    issueDate: "2026-06-01",
    maturityDate: "2026-09-29",
    instrumentType: "Accepted Bill of Exchange",
    countryRisk: "Moderate",
  },
  pricingWorkbench: [
    { id: "PW-1", scenario: "Baseline", discountRate: "7.85%", expectedYield: "8.20%", status: "baseline" },
    { id: "PW-2", scenario: "Preferred", discountRate: "8.10%", expectedYield: "8.45%", status: "preferred" },
    { id: "PW-3", scenario: "Stress", discountRate: "8.90%", expectedYield: "9.25%", status: "stress" },
  ],
  fundingPanel: [
    { id: "FP-1", source: "Treasury Line A", allocation: "USD 5.0M", availability: "USD 1.8M", status: "available" },
    { id: "FP-2", source: "Partner Facility B", allocation: "USD 7.5M", availability: "USD 0.9M", status: "constrained" },
  ],
  purchasePanel: [
    { id: "PP-1", receivableId: "RCV-2026-044", purchaseStatus: "ready", owner: "Execution Desk" },
    { id: "PP-2", receivableId: "RCV-2026-038", purchaseStatus: "pending", owner: "Commercial Control" },
  ],
  settlementTracker: [
    { id: "ST-1", milestone: "Assignment confirmation", status: "completed", eta: "2026-07-14" },
    { id: "ST-2", milestone: "Funding release", status: "in_progress", eta: "2026-07-16" },
    { id: "ST-3", milestone: "Settlement reconciliation", status: "upcoming", eta: "2026-07-18" },
  ],
  collectionsBoard: [
    { id: "CB-1", receivableId: "RCV-2026-044", collectionStatus: "on_track", nextAction: "Confirm obligor payment advice" },
    { id: "CB-2", receivableId: "RCV-2026-038", collectionStatus: "watch", nextAction: "Escalate reminder schedule" },
  ],
  exposureDashboard: [
    { id: "EX-1", dimension: "Obligor Concentration", value: "18%", limit: "20%", status: "normal" },
    { id: "EX-2", dimension: "Country Exposure", value: "24%", limit: "25%", status: "watch" },
    { id: "EX-3", dimension: "Sector Exposure", value: "31%", limit: "30%", status: "breach" },
  ],
  portfolioSummary: {
    outstanding: "USD 18.6M",
    concentration: "Top 5 obligors 52%",
    weightedTenor: "134 days",
    activeDeals: 11,
  },
  riskIndicators: [
    { id: "RI-1", indicator: "Obligor DSO drift", level: "medium", note: "One obligor extended by 11 days month-over-month." },
    { id: "RI-2", indicator: "Country transfer risk", level: "high", note: "Transfer window volatility increased in one corridor." },
    { id: "RI-3", indicator: "Documentation quality", level: "low", note: "Current receivable set meets control checklist." },
  ],
  timeline: [
    { id: "TL-1", timestamp: "2026-07-15T08:30:00Z", event: "Receivable queued for review", actor: "Forfaiting Intake", detail: "RCV-2026-044 entered review lane." },
    { id: "TL-2", timestamp: "2026-07-15T10:05:00Z", event: "Preferred pricing scenario selected", actor: "Commercial Analyst", detail: "Pricing workbench updated to preferred scenario." },
    { id: "TL-3", timestamp: "2026-07-15T11:20:00Z", event: "Funding coordination initiated", actor: "Treasury Desk", detail: "Funding release milestone started for RCV-2026-044." },
  ],
  aiDealAdvisor: {
    summary: "Deal setup is progressing with one concentration risk alert and one constrained funding source.",
    recommendations: [
      "Rebalance sector concentration before approving additional similar obligors.",
      "Prioritize settlement milestone tracking for in-progress funding release.",
      "Prepare alternative funding source for constrained facility B.",
    ],
    alerts: [
      "Sector exposure currently exceeds internal limit by 1 percentage point.",
      "Country exposure is approaching threshold and should be monitored daily.",
    ],
  },
};

type ForfaitingPageProps = {
  searchParams?: Promise<{
    demoScenario?: string;
    businessContext?: string;
    workflowId?: string;
    receivableId?: string;
    institution?: string;
    exporter?: string;
    amount?: string;
    currency?: string;
    fundingDate?: string;
    tenorDays?: string;
    status?: string;
  }>;
};

function toTenorDays(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 180;
}

function toOpportunityLifecycle(
  value: string | undefined,
  fallback: OpportunityLifecycle,
): OpportunityLifecycle {
  if (!value) {
    return fallback;
  }

  const match = Object.values(OpportunityLifecycle).find((item) => item === value);
  return match ?? fallback;
}

function toReceivableStatus(value: OpportunityLifecycle): ReceivableQueueItem["status"] {
  if (value === OpportunityLifecycle.RELEASED_FOR_PURCHASE) {
    return "approved";
  }

  if (value === OpportunityLifecycle.PURCHASED || value === OpportunityLifecycle.SETTLING || value === OpportunityLifecycle.SETTLED || value === OpportunityLifecycle.CLOSED) {
    return "review";
  }

  if (value === OpportunityLifecycle.FUNDING_ALLOCATED || value === OpportunityLifecycle.APPROVED) {
    return "new";
  }

  return "on_hold";
}

function resolveBusinessContext(
  workflowContextRepository: WorkflowContextRepository,
  workflowId: string,
) {
  return workflowContextRepository.findByWorkflowId(workflowId);
}

export default async function ForfaitingPage({ searchParams }: ForfaitingPageProps) {
  const params = (await searchParams) ?? {};
  const runtimeComposition = createCanonicalReleaseOneRuntimeComposition();
  const workflowContextRepository = runtimeComposition.workflowContextRepository;
  await workflowContextRepository.hydrate?.();
  const demoScenario = getDemoScenario(params.demoScenario);
  const parsedBusinessContext = parseBusinessContext(params.businessContext);
  const workflowId = parsedBusinessContext?.workflowId
    ?? demoScenario?.contexts.forfaitting.workflowId
    ?? params.workflowId
    ?? "COM-ORIG-9001";

  if (demoScenario) {
    await workflowContextRepository.save(demoScenario.contexts.forfaitting);
  }

  const repositoryBusinessContext = resolveBusinessContext(
    workflowContextRepository,
    workflowId,
  );
  const resolvedBusinessContext = repositoryBusinessContext ?? parsedBusinessContext;

  if (!repositoryBusinessContext && parsedBusinessContext) {
    await workflowContextRepository.save(parsedBusinessContext);
  }

  const hasReleasedItem = Boolean(resolvedBusinessContext?.receivableId ?? params.receivableId);
  const lifecycleStatus = resolvedBusinessContext?.opportunityLifecycle
    ?? toOpportunityLifecycle(
      params.status,
      OpportunityLifecycle.RELEASED_FOR_PURCHASE,
    );

  const forfaittingBusinessContext = resolvedBusinessContext
    ? createBusinessContext({
        ...resolvedBusinessContext,
        currentWorkspace: "forfaitting",
        currentOwner: "Forfaitting Desk",
      })
    : createBusinessContext({
        institutionId: params.institution ?? "INS-AL-NOOR",
        opportunityId: params.receivableId ?? "OPP-7712",
        receivableId: params.receivableId,
        workflowId,
        opportunityLifecycle: lifecycleStatus,
        currentOwner: "Forfaitting Desk",
        currentWorkspace: "forfaitting",
      });

  await workflowContextRepository.save(forfaittingBusinessContext);

  const releasedReceivable: ReceivableQueueItem = {
    id: forfaittingBusinessContext.receivableId ?? params.receivableId ?? "RQ-TRS-9001",
    obligor: params.institution ?? forfaittingBusinessContext.institutionId,
    exporter: params.exporter ?? params.institution ?? "Al Noor Trading LLC",
    amount: params.amount ?? "USD 6,200,000",
    tenorDays: toTenorDays(params.tenorDays),
    status: toReceivableStatus(lifecycleStatus),
    lifecycleStatus,
  };

  const receivableQueue = hasReleasedItem
    ? [releasedReceivable, ...FORFAITTING_WORKSPACE_STATE.receivableQueue.filter((item) => item.id !== releasedReceivable.id)]
    : FORFAITTING_WORKSPACE_STATE.receivableQueue;

  const selectedReceivableId = params.receivableId ?? receivableQueue[0]?.id;
  const selectedReceivable = receivableQueue.find((item) => item.id === selectedReceivableId) ?? receivableQueue[0];
  const selectedCurrency = params.currency ?? "USD";
  const selectedFundingDate = params.fundingDate ?? FORFAITTING_WORKSPACE_STATE.reviewDate;

  const state: ForfaittingWorkspaceState = {
    ...FORFAITTING_WORKSPACE_STATE,
    receivableQueue,
    receivableDetail: {
      receivableId: selectedReceivable.id,
      currency: selectedCurrency,
      amount: selectedReceivable.amount,
      issueDate: selectedFundingDate,
      maturityDate: FORFAITTING_WORKSPACE_STATE.receivableDetail.maturityDate,
      instrumentType: FORFAITTING_WORKSPACE_STATE.receivableDetail.instrumentType,
      countryRisk: FORFAITTING_WORKSPACE_STATE.receivableDetail.countryRisk,
    },
    pricingWorkbench: FORFAITTING_WORKSPACE_STATE.pricingWorkbench.map((item, index) =>
      index === 0
        ? {
            ...item,
            scenario: `Selected ${selectedReceivable.id}`,
          }
        : item,
    ),
    fundingPanel: FORFAITTING_WORKSPACE_STATE.fundingPanel.map((item, index) =>
      index === 0
        ? {
            ...item,
            allocation: selectedReceivable.amount,
          }
        : item,
    ),
    purchasePanel: [
      {
        id: `PP-${selectedReceivable.id}`,
        receivableId: selectedReceivable.id,
        purchaseStatus: "ready",
        owner: "Execution Desk",
      },
      ...FORFAITTING_WORKSPACE_STATE.purchasePanel.slice(0, 1),
    ],
    settlementTracker: [
      {
        id: `ST-${selectedReceivable.id}`,
        milestone: "Funding release",
        status: "in_progress",
        eta: selectedFundingDate,
      },
      ...FORFAITTING_WORKSPACE_STATE.settlementTracker.slice(0, 2),
    ],
    collectionsBoard: [
      {
        id: `CB-${selectedReceivable.id}`,
        receivableId: selectedReceivable.id,
        collectionStatus: "on_track",
        nextAction: `Monitor payment advice for ${selectedReceivable.obligor}`,
      },
      ...FORFAITTING_WORKSPACE_STATE.collectionsBoard.slice(0, 1),
    ],
    portfolioSummary: {
      ...FORFAITTING_WORKSPACE_STATE.portfolioSummary,
      outstanding: selectedReceivable.amount,
      weightedTenor: `${selectedReceivable.tenorDays} days`,
    },
    riskIndicators: FORFAITTING_WORKSPACE_STATE.riskIndicators.map((indicator, index) =>
      index === 0
        ? {
            ...indicator,
            note: `Primary monitoring item is ${selectedReceivable.obligor} (${selectedReceivable.id}).`,
          }
        : indicator,
    ),
  };

  const receivableQueueWithHrefs: ReceivableQueueItem[] = await Promise.all(state.receivableQueue.map(async (item) => {
    let nextLifecycle = item.lifecycleStatus ?? forfaittingBusinessContext.opportunityLifecycle;
    let nextBusinessContext = createBusinessContext({
      ...forfaittingBusinessContext,
      receivableId: item.id,
      opportunityId: item.id,
      opportunityLifecycle: nextLifecycle,
    });

    if (canTransitionOpportunityLifecycle(nextLifecycle, OpportunityLifecycle.PURCHASED)) {
      nextLifecycle = transitionOpportunityLifecycle(nextLifecycle, OpportunityLifecycle.PURCHASED);
      nextBusinessContext = transitionBusinessContext({
        context: nextBusinessContext,
        toLifecycle: OpportunityLifecycle.PURCHASED,
        toWorkspace: "forfaitting",
        nextOwner: "Forfaitting Desk",
        receivableId: item.id,
      });
    }

    await workflowContextRepository.save(nextBusinessContext);

    const itemParams = new URLSearchParams({
      receivableId: item.id,
      institution: item.obligor,
      exporter: item.exporter,
      amount: item.amount,
      currency: selectedCurrency,
      fundingDate: selectedFundingDate,
      tenorDays: String(item.tenorDays),
      status: nextLifecycle,
      workflowId: nextBusinessContext.workflowId,
      businessContext: serializeBusinessContext(nextBusinessContext),
    });

    return {
      ...item,
      itemHref: `/atlas/forfaiting?${itemParams.toString()}`,
    };
  }));

  const hydratedState: ForfaittingWorkspaceState = {
    ...state,
    receivableQueue: receivableQueueWithHrefs,
  };

  return (
    <ForfaitingWorkspace
      initialState={hydratedState}
      selectedReceivableId={selectedReceivable.id}
    />
  );
}
