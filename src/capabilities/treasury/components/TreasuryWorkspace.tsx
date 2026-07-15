"use client";

import EmptyState from "@/components/atlas/design-system/EmptyState";
import WorkflowTimelinePanel from "@/components/atlas/workflows/WorkflowTimelinePanel";
import { buildMockWorkflowEvents } from "@/lib/workflows/WorkflowTimeline";
import BankAccounts from "@/src/capabilities/treasury/components/BankAccounts";
import CashFlowForecast from "@/src/capabilities/treasury/components/CashFlowForecast";
import ExposureLimits from "@/src/capabilities/treasury/components/ExposureLimits";
import FundingQueue from "@/src/capabilities/treasury/components/FundingQueue";
import FundingSources from "@/src/capabilities/treasury/components/FundingSources";
import InvestorAllocation from "@/src/capabilities/treasury/components/InvestorAllocation";
import LiquidityDashboard from "@/src/capabilities/treasury/components/LiquidityDashboard";
import SettlementQueue from "@/src/capabilities/treasury/components/SettlementQueue";
import TreasuryAiAdvisor from "@/src/capabilities/treasury/components/TreasuryAiAdvisor";
import { useTreasury } from "@/src/capabilities/treasury/hooks/useTreasury";
import type { TreasuryViewKey, TreasuryWorkspaceState } from "@/src/capabilities/treasury/types/TreasuryWorkspaceState";

type TreasuryWorkspaceProps = {
  readonly initialState: TreasuryWorkspaceState;
  readonly selectedFundingItemId?: string;
};

function renderMainView(
  view: TreasuryViewKey,
  workspace: TreasuryWorkspaceState,
  selectedFundingItemId?: string,
) {
  switch (view) {
    case "funding_queue":
      return (
        <FundingQueue
          items={workspace.fundingQueue}
          selectedItemId={selectedFundingItemId}
        />
      );
    case "funding_sources":
      return <FundingSources items={workspace.fundingSources} />;
    case "settlement_queue":
      return <SettlementQueue items={workspace.settlementQueue} />;
    case "investor_allocation":
      return <InvestorAllocation items={workspace.investorAllocation} />;
    case "cash_flow_forecast":
      return <CashFlowForecast items={workspace.cashFlowForecast} />;
    case "exposure_limits":
      return <ExposureLimits items={workspace.exposureLimits} />;
    case "bank_accounts":
      return <BankAccounts items={workspace.bankAccounts} />;
    case "liquidity":
    default:
      return (
        <div className="space-y-2">
          <LiquidityDashboard metrics={workspace.liquidityDashboard} />
          <FundingQueue
            items={workspace.fundingQueue}
            selectedItemId={selectedFundingItemId}
          />
        </div>
      );
  }
}

function TreasuryHeader({ workspace }: { readonly workspace: TreasuryWorkspaceState }) {
  return (
    <header className="rounded-2xl border border-slate-800/90 bg-slate-900/50 px-5 py-4 shadow-[0_12px_32px_rgba(2,6,23,0.24)] sm:px-6 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">ATLAS / TREASURY</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Treasury Operating Workspace</h1>
          <p className="mt-1 text-sm text-slate-300">{workspace.institutionName} · {workspace.treasuryDesk}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="uppercase tracking-[0.14em] text-slate-500">Workspace</p>
            <p className="mt-1 font-semibold text-slate-200">{workspace.workspaceId}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="uppercase tracking-[0.14em] text-slate-500">Status</p>
            <span className="mt-1 inline-flex rounded-full border border-cyan-700/50 bg-cyan-950/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-200">
              {workspace.status}
            </span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="uppercase tracking-[0.14em] text-slate-500">Review</p>
            <p className="mt-1 font-semibold text-slate-200">{workspace.reviewDate}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
            <p className="uppercase tracking-[0.14em] text-slate-500">Funding Items</p>
            <p className="mt-1 font-semibold text-emerald-200">{workspace.fundingQueue.length}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function TreasurySidebar({
  items,
  activeView,
  onSelect,
}: {
  readonly items: readonly TreasuryWorkspaceState["sidebar"][number][];
  readonly activeView: TreasuryViewKey;
  readonly onSelect: (view: TreasuryViewKey) => void;
}) {
  return (
    <aside className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Treasury Views</h2>
      <div className="space-y-2.5">
        {items.map((item) => {
          const isActive = item.key === activeView;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={[
                "w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition",
                isActive
                  ? "border-cyan-700/60 bg-cyan-950/35 text-cyan-100 shadow-[0_0_0_1px_rgba(6,182,212,0.16)]"
                  : "border-slate-700 bg-slate-950/70 text-slate-200 hover:border-slate-500",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default function TreasuryWorkspace({
  initialState,
  selectedFundingItemId,
}: TreasuryWorkspaceProps) {
  const { workspace, activeView, setActiveView } = useTreasury(initialState);

  if (!workspace.sidebar.length) {
    return (
      <div className="min-h-screen p-6 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Treasury views are unavailable"
            message="No treasury sections are configured for this workspace right now."
          />
        </div>
      </div>
    );
  }

  if (!workspace.fundingQueue.length && activeView === "funding_queue") {
    return (
      <div className="min-h-screen p-6 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Funding queue is empty"
            message="There are no funding items to process yet."
          />
        </div>
      </div>
    );
  }

  const selectedFundingItem = workspace.fundingQueue.find((item) => item.id === selectedFundingItemId) ?? workspace.fundingQueue[0];
  const workflowEvents = buildMockWorkflowEvents({
    institutionName: selectedFundingItem?.counterparty ?? workspace.institutionName,
    opportunityReference: selectedFundingItem?.opportunityReference ?? "OPP-7712",
    fundingAmount: selectedFundingItem?.amount ?? "USD 6,200,000",
    submittedBy: "Treasury Desk",
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1920px] space-y-4 pb-10">
        <TreasuryHeader workspace={workspace} />

        <div className="grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <TreasurySidebar items={workspace.sidebar} activeView={activeView} onSelect={setActiveView} />

          <main className="space-y-3">
            {selectedFundingItemId && !selectedFundingItem ? (
              <p className="rounded border border-amber-700/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-100">
                Requested funding item was not found. Showing the default queue selection.
              </p>
            ) : null}
            {renderMainView(activeView, workspace, selectedFundingItemId)}
            <WorkflowTimelinePanel events={workflowEvents} compact title="Workflow Timeline" />
          </main>

          <aside className="space-y-3">
            <TreasuryAiAdvisor advisor={workspace.aiAdvisor} />
            <ExposureLimits items={workspace.exposureLimits} />
            <BankAccounts items={workspace.bankAccounts} />
          </aside>
        </div>
      </div>
    </div>
  );
}
