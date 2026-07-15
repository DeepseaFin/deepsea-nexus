"use client";

import EmptyState from "@/components/atlas/design-system/EmptyState";
import WorkflowTimelinePanel from "@/components/atlas/workflows/WorkflowTimelinePanel";
import { buildMockWorkflowEvents } from "@/lib/workflows/WorkflowTimeline";
import AiDealAdvisor from "@/src/capabilities/forfaiting/components/AiDealAdvisor";
import CollectionsBoard from "@/src/capabilities/forfaiting/components/CollectionsBoard";
import ExposureDashboard from "@/src/capabilities/forfaiting/components/ExposureDashboard";
import ForfaitingHeader from "@/src/capabilities/forfaiting/components/ForfaitingHeader";
import PortfolioSummary from "@/src/capabilities/forfaiting/components/PortfolioSummary";
import PricingWorkbench from "@/src/capabilities/forfaiting/components/PricingWorkbench";
import PurchasePanel from "@/src/capabilities/forfaiting/components/PurchasePanel";
import ReceivableDetail from "@/src/capabilities/forfaiting/components/ReceivableDetail";
import ReceivableQueue from "@/src/capabilities/forfaiting/components/ReceivableQueue";
import RiskIndicators from "@/src/capabilities/forfaiting/components/RiskIndicators";
import SettlementTracker from "@/src/capabilities/forfaiting/components/SettlementTracker";
import FundingPanel from "@/src/capabilities/forfaiting/components/FundingPanel";
import { useForfaitting } from "@/src/capabilities/forfaiting/hooks/useForfaitting";
import type {
  ForfaittingViewKey,
  ForfaittingWorkspaceState,
  ReceivableQueueItem,
} from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

type ForfaitingWorkspaceProps = {
  readonly initialState: ForfaittingWorkspaceState;
  readonly selectedReceivableId?: string;
  readonly buildReceivableHref?: (item: ReceivableQueueItem) => string;
};

function renderMainView(
  view: ForfaittingViewKey,
  workspace: ForfaittingWorkspaceState,
  selectedReceivableId?: string,
  buildReceivableHref?: (item: ReceivableQueueItem) => string,
) {
  switch (view) {
    case "detail":
      return <ReceivableDetail detail={workspace.receivableDetail} />;
    case "pricing":
      return <PricingWorkbench items={workspace.pricingWorkbench} />;
    case "funding":
      return <FundingPanel items={workspace.fundingPanel} />;
    case "purchase":
      return <PurchasePanel items={workspace.purchasePanel} />;
    case "settlement":
      return <SettlementTracker items={workspace.settlementTracker} />;
    case "collections":
      return <CollectionsBoard items={workspace.collectionsBoard} />;
    case "exposure":
      return <ExposureDashboard items={workspace.exposureDashboard} />;
    case "portfolio":
      return <PortfolioSummary summary={workspace.portfolioSummary} />;
    case "risk":
      return <RiskIndicators indicators={workspace.riskIndicators} />;
    case "queue":
    default:
      return (
        <div className="space-y-2">
          <ReceivableQueue
            items={workspace.receivableQueue}
            selectedItemId={selectedReceivableId}
            buildItemHref={buildReceivableHref}
          />
          <ReceivableDetail detail={workspace.receivableDetail} />
        </div>
      );
  }
}

function Sidebar({
  items,
  activeView,
  onSelect,
}: {
  readonly items: readonly ForfaittingWorkspaceState["sidebar"][number][];
  readonly activeView: ForfaittingViewKey;
  readonly onSelect: (view: ForfaittingViewKey) => void;
}) {
  return (
    <aside className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Forfaiting Views</h2>
      <div className="space-y-2">
        {items.map((item) => {
          const isActive = item.key === activeView;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={[
                "w-full rounded border px-3 py-2 text-left text-sm font-medium transition",
                isActive
                  ? "border-cyan-700/50 bg-cyan-950/30 text-cyan-100"
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

export default function ForfaitingWorkspace({
  initialState,
  selectedReceivableId,
  buildReceivableHref,
}: ForfaitingWorkspaceProps) {
  const { workspace, activeView, setActiveView } = useForfaitting(initialState);

  if (!workspace.sidebar.length) {
    return (
      <div className="min-h-screen p-6 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Forfaiting views are unavailable"
            message="No forfaiting sections are configured for this workspace right now."
          />
        </div>
      </div>
    );
  }

  if (!workspace.receivableQueue.length && activeView === "queue") {
    return (
      <div className="min-h-screen p-6 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Receivable queue is empty"
            message="No receivables are currently available for review."
          />
        </div>
      </div>
    );
  }

  const selectedReceivable = workspace.receivableQueue.find((item) => item.id === selectedReceivableId) ?? workspace.receivableQueue[0];
  const workflowEvents = buildMockWorkflowEvents({
    institutionName: selectedReceivable?.obligor ?? workspace.portfolioName,
    opportunityReference: selectedReceivable?.id ?? workspace.receivableDetail.receivableId,
    fundingAmount: selectedReceivable?.amount ?? workspace.receivableDetail.amount,
    submittedBy: "Forfaiting Desk",
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1920px] space-y-3 pb-8">
        <ForfaitingHeader workspace={workspace} />

        <div className="grid gap-2 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <Sidebar items={workspace.sidebar} activeView={activeView} onSelect={setActiveView} />

          <main className="space-y-2">
            {selectedReceivableId && !selectedReceivable ? (
              <p className="rounded border border-amber-700/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-100">
                Requested receivable was not found. Showing the default queue selection.
              </p>
            ) : null}
            {renderMainView(activeView, workspace, selectedReceivableId, buildReceivableHref)}
            <WorkflowTimelinePanel events={workflowEvents} compact title="Workflow Timeline" />
          </main>

          <aside className="space-y-2">
            <AiDealAdvisor advisor={workspace.aiDealAdvisor} />
            <PortfolioSummary summary={workspace.portfolioSummary} compact />
            <RiskIndicators indicators={workspace.riskIndicators} compact />
          </aside>
        </div>
      </div>
    </div>
  );
}
