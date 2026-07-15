import TreasuryWorkspace from "@/src/capabilities/treasury/components/TreasuryWorkspace";
import type { FundingQueueItem, TreasuryWorkspaceState } from "@/src/capabilities/treasury/types/TreasuryWorkspaceState";
import {
  createBusinessContext,
  parseBusinessContext,
  serializeBusinessContext,
  transitionBusinessContext,
  workflowContextRepository,
} from "@/lib/workflows/WorkflowContext";
import {
  OpportunityLifecycle,
  canTransitionOpportunityLifecycle,
  transitionOpportunityLifecycle,
} from "@/lib/workflows/WorkflowTransition";
import { getDemoScenario } from "@/lib/workflows/DemoScenario";

const TREASURY_WORKSPACE_STATE: TreasuryWorkspaceState = {
  workspaceId: "TRS-5012",
  institutionName: "Deepsea Treasury Office",
  treasuryDesk: "Global Liquidity & Funding Desk",
  status: "active",
  reviewDate: "2026-07-15",
  sidebar: [
    { key: "liquidity", label: "Liquidity Dashboard" },
    { key: "funding_queue", label: "Funding Queue" },
    { key: "funding_sources", label: "Funding Sources" },
    { key: "settlement_queue", label: "Settlement Queue" },
    { key: "investor_allocation", label: "Investor Allocation" },
    { key: "cash_flow_forecast", label: "Cash Flow Forecast" },
    { key: "exposure_limits", label: "Exposure Limits" },
    { key: "bank_accounts", label: "Bank Accounts" },
  ],
  liquidityDashboard: [
    { id: "LQ-1", label: "Opening Liquidity", value: "USD 42.8M", trend: "flat" },
    { id: "LQ-2", label: "Available Funding Capacity", value: "USD 29.5M", trend: "up" },
    { id: "LQ-3", label: "Planned Outflow", value: "USD 12.2M", trend: "down" },
    { id: "LQ-4", label: "Projected End-of-Day", value: "USD 34.1M", trend: "up" },
  ],
  fundingQueue: [
    { id: "FQ-1", counterparty: "Blue Coast Distribution", amount: "USD 4.2M", priority: "high", status: "review" },
    { id: "FQ-2", counterparty: "Horizon Industrial Supplies", amount: "USD 3.6M", priority: "medium", status: "queued" },
    { id: "FQ-3", counterparty: "Al Noor Trading LLC", amount: "USD 2.8M", priority: "low", status: "ready" },
  ],
  fundingSources: [
    { id: "FS-1", source: "Treasury Credit Line A", limit: "USD 20.0M", available: "USD 8.5M", status: "active" },
    { id: "FS-2", source: "Partner Liquidity Facility B", limit: "USD 15.0M", available: "USD 3.4M", status: "watch" },
    { id: "FS-3", source: "Institutional Note Program", limit: "USD 30.0M", available: "USD 17.6M", status: "active" },
  ],
  settlementQueue: [
    { id: "SQ-1", instructionRef: "SET-2026-1482", valueDate: "2026-07-16", amount: "USD 4.2M", status: "pending" },
    { id: "SQ-2", instructionRef: "SET-2026-1483", valueDate: "2026-07-16", amount: "USD 1.6M", status: "released" },
    { id: "SQ-3", instructionRef: "SET-2026-1484", valueDate: "2026-07-17", amount: "USD 2.1M", status: "reconciled" },
  ],
  investorAllocation: [
    { id: "IA-1", investor: "Northbridge Capital", allocation: "USD 5.0M", mandate: "Senior short-duration paper", status: "confirmed" },
    { id: "IA-2", investor: "Mariner Institutional", allocation: "USD 3.4M", mandate: "Diversified receivables exposure", status: "proposed" },
    { id: "IA-3", investor: "Orchid Treasury Partners", allocation: "USD 2.8M", mandate: "Trade finance participations", status: "adjusted" },
  ],
  cashFlowForecast: [
    { id: "CF-1", bucket: "T+0", inflow: "USD 3.2M", outflow: "USD 4.8M", netPosition: "USD -1.6M" },
    { id: "CF-2", bucket: "T+1 to T+3", inflow: "USD 9.5M", outflow: "USD 7.1M", netPosition: "USD 2.4M" },
    { id: "CF-3", bucket: "T+4 to T+7", inflow: "USD 14.8M", outflow: "USD 10.2M", netPosition: "USD 4.6M" },
  ],
  exposureLimits: [
    { id: "EL-1", dimension: "Single Obligor Exposure", utilization: "72%", limit: "80%", status: "normal" },
    { id: "EL-2", dimension: "Country Concentration", utilization: "88%", limit: "90%", status: "watch" },
    { id: "EL-3", dimension: "Currency Mismatch", utilization: "94%", limit: "90%", status: "breach" },
  ],
  bankAccounts: [
    { id: "BA-1", accountName: "Primary Collections Account", bank: "Global Mercantile Bank", currency: "USD", balance: "USD 12.7M", status: "active" },
    { id: "BA-2", accountName: "Settlement Clearing Account", bank: "Maritime Trust", currency: "USD", balance: "USD 8.4M", status: "active" },
    { id: "BA-3", accountName: "Reserve Buffer Account", bank: "Harbor Financial", currency: "EUR", balance: "EUR 3.1M", status: "restricted" },
  ],
  timeline: [
    {
      id: "TT-1",
      timestamp: "2026-07-15T08:40:00Z",
      event: "Funding queue reprioritized",
      actor: "Treasury Operations",
      detail: "High-priority client instruction moved to review lane before cut-off.",
    },
    {
      id: "TT-2",
      timestamp: "2026-07-15T10:15:00Z",
      event: "Investor allocation draft refreshed",
      actor: "Treasury Portfolio Manager",
      detail: "Participation mix adjusted across three institutional investors.",
    },
    {
      id: "TT-3",
      timestamp: "2026-07-15T11:25:00Z",
      event: "Settlement release package assembled",
      actor: "Treasury Control",
      detail: "Two instructions prepared for value date release workflow.",
    },
  ],
  aiAdvisor: {
    summary: "Treasury posture is stable with one exposure breach and concentrated settlement activity around next value date.",
    recommendations: [
      "Rebalance currency mismatch exposure before approving additional USD outflows.",
      "Prioritize review of high-priority funding queue item before settlement window.",
      "Prepare alternate liquidity source for watch-status facility utilization.",
    ],
    alerts: [
      "Currency mismatch utilization exceeds configured limit and requires desk attention.",
      "Country concentration is near threshold and should be monitored each cycle.",
    ],
  },
};

type TreasuryPageProps = {
  searchParams?: Promise<{
    demoScenario?: string;
    businessContext?: string;
    workflowId?: string;
    fundingId?: string;
    institutionName?: string;
    opportunityId?: string;
    fundingAmount?: string;
    fundingDate?: string;
    currency?: string;
    priority?: string;
    status?: string;
  }>;
};

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

function toPriority(value: string | undefined): FundingQueueItem["priority"] {
  if (value === "high" || value === "medium" || value === "low") {
    return value;
  }

  return "high";
}

function toQueueStatus(value: OpportunityLifecycle): FundingQueueItem["status"] {
  if (value === OpportunityLifecycle.FUNDING_ALLOCATED) {
    return "review";
  }

  if (value === OpportunityLifecycle.RELEASED_FOR_PURCHASE) {
    return "ready";
  }

  if (value === OpportunityLifecycle.PURCHASED || value === OpportunityLifecycle.SETTLING || value === OpportunityLifecycle.SETTLED || value === OpportunityLifecycle.CLOSED) {
    return "queued";
  }

  return "review";
}

export default async function TreasuryPage({ searchParams }: TreasuryPageProps) {
  const params = (await searchParams) ?? {};
  const demoScenario = getDemoScenario(params.demoScenario);
  const parsedBusinessContext = parseBusinessContext(params.businessContext);
  const workflowId = parsedBusinessContext?.workflowId
    ?? demoScenario?.contexts.treasury.workflowId
    ?? params.workflowId
    ?? "COM-ORIG-9001";

  if (demoScenario) {
    workflowContextRepository.save(demoScenario.contexts.treasury);
  }

  const repositoryBusinessContext = workflowContextRepository.findByWorkflowId(workflowId);
  const resolvedBusinessContext = repositoryBusinessContext ?? parsedBusinessContext;

  if (!repositoryBusinessContext && parsedBusinessContext) {
    workflowContextRepository.save(parsedBusinessContext);
  }

  const hasApprovedFunding = Boolean(resolvedBusinessContext?.opportunityId ?? params.opportunityId);
  const lifecycleStatus = resolvedBusinessContext?.opportunityLifecycle
    ?? toOpportunityLifecycle(params.status, OpportunityLifecycle.FUNDING_ALLOCATED);

  const treasuryBusinessContext = resolvedBusinessContext
    ? createBusinessContext({
        ...resolvedBusinessContext,
        currentWorkspace: "treasury",
        currentOwner: "Treasury Desk",
      })
    : createBusinessContext({
        institutionId: params.institutionName ?? "INS-AL-NOOR",
        opportunityId: params.opportunityId ?? "OPP-7712",
        workflowId,
        opportunityLifecycle: lifecycleStatus,
        currentOwner: "Treasury Desk",
        currentWorkspace: "treasury",
      });

  workflowContextRepository.save(treasuryBusinessContext);

  const approvedItem: FundingQueueItem = {
    id: params.fundingId ?? `FQ-${treasuryBusinessContext.opportunityId}`,
    counterparty: params.institutionName ?? treasuryBusinessContext.institutionId,
    opportunityReference: treasuryBusinessContext.opportunityId,
    amount: params.fundingAmount ?? "USD 6,200,000",
    fundingDate: params.fundingDate ?? "2026-07-16",
    currency: params.currency ?? "USD",
    priority: toPriority(params.priority),
    status: toQueueStatus(lifecycleStatus),
    currentStatus: lifecycleStatus,
  };

  const fundingQueue = hasApprovedFunding
    ? [approvedItem, ...TREASURY_WORKSPACE_STATE.fundingQueue.filter((item) => item.id !== approvedItem.id)]
    : TREASURY_WORKSPACE_STATE.fundingQueue;

  const selectedFundingId = params.fundingId ?? fundingQueue[0]?.id;
  const selectedFundingItem = fundingQueue.find((item) => item.id === selectedFundingId) ?? fundingQueue[0];

  const state: TreasuryWorkspaceState = {
    ...TREASURY_WORKSPACE_STATE,
    fundingQueue,
    liquidityDashboard: [
      {
        id: "LQ-selected-funding",
        label: "Selected Funding Amount",
        value: selectedFundingItem.amount,
        trend: "up",
      },
      ...TREASURY_WORKSPACE_STATE.liquidityDashboard.slice(1),
    ],
    settlementQueue: [
      {
        id: `SQ-${selectedFundingItem.id}`,
        instructionRef: selectedFundingItem.opportunityReference ?? selectedFundingItem.id,
        valueDate: selectedFundingItem.fundingDate ?? TREASURY_WORKSPACE_STATE.reviewDate,
        amount: selectedFundingItem.amount,
        status: selectedFundingItem.status === "ready"
          ? "released"
          : selectedFundingItem.status === "queued"
            ? "pending"
            : "reconciled",
      },
      ...TREASURY_WORKSPACE_STATE.settlementQueue.slice(0, 2),
    ],
    cashFlowForecast: [
      {
        id: "CF-selected-funding",
        bucket: `Selected Funding ${selectedFundingItem.opportunityReference ?? selectedFundingItem.id}`,
        inflow: selectedFundingItem.amount,
        outflow: "USD 0.0M",
        netPosition: selectedFundingItem.amount,
      },
      ...TREASURY_WORKSPACE_STATE.cashFlowForecast.slice(1),
    ],
  };

  const buildFundingItemHref = (item: FundingQueueItem): string => {
    const itemParams = new URLSearchParams({
      fundingId: item.id,
      institutionName: item.counterparty,
      opportunityId: item.opportunityReference ?? item.id,
      fundingAmount: item.amount,
      fundingDate: item.fundingDate ?? state.reviewDate,
      currency: item.currency ?? "USD",
      priority: item.priority,
      status: item.currentStatus ?? OpportunityLifecycle.FUNDING_ALLOCATED,
      workflowId: treasuryBusinessContext.workflowId,
      businessContext: serializeBusinessContext(
        createBusinessContext({
          ...treasuryBusinessContext,
          opportunityId: item.opportunityReference ?? treasuryBusinessContext.opportunityId,
          opportunityLifecycle: item.currentStatus ?? OpportunityLifecycle.FUNDING_ALLOCATED,
        }),
      ),
    });

    return `/atlas/treasury?${itemParams.toString()}`;
  };

  const buildReleaseHref = (item: FundingQueueItem): string => {
    let releaseLifecycle = item.currentStatus ?? treasuryBusinessContext.opportunityLifecycle;
    let releaseBusinessContext = createBusinessContext({
      ...treasuryBusinessContext,
      opportunityId: item.opportunityReference ?? treasuryBusinessContext.opportunityId,
      opportunityLifecycle: releaseLifecycle,
    });

    if (canTransitionOpportunityLifecycle(releaseLifecycle, OpportunityLifecycle.RELEASED_FOR_PURCHASE)) {
      releaseLifecycle = transitionOpportunityLifecycle(releaseLifecycle, OpportunityLifecycle.RELEASED_FOR_PURCHASE);
      releaseBusinessContext = transitionBusinessContext({
        context: releaseBusinessContext,
        toLifecycle: OpportunityLifecycle.RELEASED_FOR_PURCHASE,
        toWorkspace: "forfaitting",
        nextOwner: "Forfaitting Desk",
        receivableId: item.opportunityReference ?? item.id,
      });
    }

    workflowContextRepository.save(releaseBusinessContext);

    const releaseParams = new URLSearchParams({
      receivableId: item.opportunityReference ?? item.id,
      institution: item.counterparty,
      exporter: item.counterparty,
      amount: item.amount,
      currency: item.currency ?? "USD",
      fundingDate: item.fundingDate ?? state.reviewDate,
      tenorDays: "180",
      status: releaseLifecycle,
      workflowId: releaseBusinessContext.workflowId,
      businessContext: serializeBusinessContext(releaseBusinessContext),
    });

    return `/atlas/forfaiting?${releaseParams.toString()}`;
  };

  return (
    <TreasuryWorkspace
      initialState={state}
      selectedFundingItemId={selectedFundingItem.id}
      buildFundingItemHref={buildFundingItemHref}
      buildReleaseHref={buildReleaseHref}
    />
  );
}
