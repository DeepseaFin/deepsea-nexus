import Link from "next/link";
import {
  BadgeCheck,
  BellRing,
  BriefcaseBusiness,
  BrainCircuit,
  FolderKanban,
} from "lucide-react";
import BusinessPassportSummary from "@/components/atlas/business-passport/BusinessPassportSummary";
import KPIGrid from "@/components/atlas/design-system/KPIGrid";
import QuickActionBar from "@/components/atlas/design-system/QuickActionBar";
import WorkspaceScaffold from "@/components/atlas/design-system/WorkspaceScaffold";
import SectionCard from "@/components/atlas/intelligence/SectionCard";
import RMWorkQueue from "@/components/atlas/workqueue/RMWorkQueue";
import { defaultRelationshipPanelModel, relationshipPanelConfig } from "@/lib/customer/relationship/relationship-panel.config";
import { getOperationsCenterContexts, getOperationsNotificationEvents } from "@/lib/workflows/DemoScenario";
import { OpportunityLifecycle, type OpportunityLifecycle as OpportunityLifecycleType } from "@/lib/workflows/WorkflowTransition";
import { JourneyStatus, type JourneyRecommendation } from "@/lib/journey";
import { getJourneyBusinessPassportProjection } from "@/src/capabilities/journey/adapters/getJourneyBusinessPassportProjection";
import { getJourneyKnowledgeInsightsProjection } from "@/src/capabilities/journey/adapters/getJourneyKnowledgeInsightsProjection";
import JourneyAiPanel from "@/src/capabilities/journey/components/JourneyAiPanel";
import JourneyKnowledgeInsightsPanel from "@/src/capabilities/journey/components/JourneyKnowledgeInsightsPanel";

const OPPORTUNITY_VALUES: Readonly<Record<string, number>> = {
  "OPP-7712": 6200000,
  "OPP-8801": 3800000,
  "OPP-8802": 5100000,
  "OPP-8803": 4400000,
  "OPP-8804": 3600000,
  "OPP-8805": 2900000,
  "OPP-8806": 2500000,
  "OPP-8807": 2100000,
};

const LIFECYCLE_PROGRESS: Readonly<Record<OpportunityLifecycleType, number>> = {
  [OpportunityLifecycle.DRAFT]: 10,
  [OpportunityLifecycle.SUBMITTED]: 25,
  [OpportunityLifecycle.UNDER_REVIEW]: 45,
  [OpportunityLifecycle.APPROVED]: 60,
  [OpportunityLifecycle.FUNDING_ALLOCATED]: 75,
  [OpportunityLifecycle.RELEASED_FOR_PURCHASE]: 85,
  [OpportunityLifecycle.PURCHASED]: 90,
  [OpportunityLifecycle.SETTLING]: 95,
  [OpportunityLifecycle.SETTLED]: 100,
  [OpportunityLifecycle.CLOSED]: 100,
};

const LIFECYCLE_ORDER: readonly OpportunityLifecycleType[] = [
  OpportunityLifecycle.DRAFT,
  OpportunityLifecycle.SUBMITTED,
  OpportunityLifecycle.UNDER_REVIEW,
  OpportunityLifecycle.APPROVED,
  OpportunityLifecycle.FUNDING_ALLOCATED,
  OpportunityLifecycle.RELEASED_FOR_PURCHASE,
  OpportunityLifecycle.PURCHASED,
  OpportunityLifecycle.SETTLING,
  OpportunityLifecycle.SETTLED,
  OpportunityLifecycle.CLOSED,
];

type ContextRecord = ReturnType<typeof getOperationsCenterContexts>[number];

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 1,
    notation: value >= 1_000_000 ? "compact" : "standard",
  }).format(value);
}

function formatLifecycle(value: OpportunityLifecycleType): string {
  return value.replaceAll("_", " ");
}

function compareLifecycle(left: OpportunityLifecycleType, right: OpportunityLifecycleType): number {
  return LIFECYCLE_ORDER.indexOf(left) - LIFECYCLE_ORDER.indexOf(right);
}

function getOpportunityValue(opportunityId: string): number {
  return OPPORTUNITY_VALUES[opportunityId] ?? 3000000;
}

function dedupeLatestContexts(contexts: readonly ContextRecord[]): readonly ContextRecord[] {
  const byOpportunity = new Map<string, ContextRecord>();

  contexts.forEach((context) => {
    const current = byOpportunity.get(context.opportunityId);
    if (!current || compareLifecycle(current.opportunityLifecycle, context.opportunityLifecycle) < 0) {
      byOpportunity.set(context.opportunityId, context);
    }
  });

  return Array.from(byOpportunity.values()).sort((left, right) => compareLifecycle(right.opportunityLifecycle, left.opportunityLifecycle));
}

function createPortfolioMetrics(contexts: readonly ContextRecord[]) {
  const activeContexts = contexts.filter((context) => context.opportunityLifecycle !== OpportunityLifecycle.CLOSED);
  const activeClients = new Set(activeContexts.map((context) => context.institutionId)).size;
  const activeDeals = activeContexts.length;
  const pipelineValue = activeContexts.reduce((sum, context) => sum + getOpportunityValue(context.opportunityId), 0);
  const fundingOutstanding = activeContexts
    .filter((context) => [
      OpportunityLifecycle.APPROVED,
      OpportunityLifecycle.FUNDING_ALLOCATED,
      OpportunityLifecycle.RELEASED_FOR_PURCHASE,
      OpportunityLifecycle.PURCHASED,
      OpportunityLifecycle.SETTLING,
    ].includes(context.opportunityLifecycle))
    .reduce((sum, context) => sum + getOpportunityValue(context.opportunityId), 0);
  const collectionsDue = activeContexts
    .filter((context) => [OpportunityLifecycle.PURCHASED, OpportunityLifecycle.SETTLING, OpportunityLifecycle.SETTLED].includes(context.opportunityLifecycle))
    .reduce((sum, context) => sum + getOpportunityValue(context.opportunityId) * 0.18, 0);

  return [
    {
      label: "Active Clients",
      value: String(activeClients),
      note: "Institutions with live operational workflows",
    },
    {
      label: "Active Deals",
      value: String(activeDeals),
      note: "Open opportunities across the ATLAS operating chain",
    },
    {
      label: "Pipeline Value",
      value: formatMoney(pipelineValue),
      note: "Live portfolio value across active opportunities",
    },
    {
      label: "Funding Outstanding",
      value: formatMoney(fundingOutstanding),
      note: "Approved and in-flight funding awaiting closure",
    },
    {
      label: "Collections Due",
      value: formatMoney(collectionsDue),
      note: "Near-term settlement and collection exposure",
    },
  ] as const;
}

function createPassportProgressItems(contexts: readonly ContextRecord[]) {
  return contexts.slice(0, 5).map((context) => ({
    institutionId: context.institutionId,
    opportunityId: context.opportunityId,
    lifecycle: context.opportunityLifecycle,
    progress: LIFECYCLE_PROGRESS[context.opportunityLifecycle],
    owner: context.currentOwner,
  }));
}

function createRecentActivity() {
  return [...getOperationsNotificationEvents()]
    .sort((left, right) => Date.parse(right.occurredAt) - Date.parse(left.occurredAt))
    .slice(0, 6)
    .map((event) => ({
      time: new Date(event.occurredAt).toLocaleString([], {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      title: event.metadata.eventLabel ?? event.type,
      detail: event.message ?? `Workflow ${event.workflowId}`,
    }));
}

function createRelationshipAlertModel(contexts: readonly ContextRecord[]) {
  const followUps = defaultRelationshipPanelModel.nextActions.filter((action) => action.status !== "Queued");
  const expiringRelationships = defaultRelationshipPanelModel.timeline.filter((item) => item.status !== "completed");
  const highRiskRelationships = contexts.filter((context) => context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW).length;

  return {
    followUps: followUps.length,
    expiringRelationships: expiringRelationships.length,
    highRiskRelationships,
    rows: [
      {
        label: "Follow-ups",
        value: followUps.length,
        detail: followUps[0]?.title ?? "Relationship follow-up queue is clear.",
        href: "/atlas/journey",
      },
      {
        label: "Expiring relationships",
        value: expiringRelationships.length,
        detail: expiringRelationships[0]?.subject ?? "No expiring relationship checkpoints.",
        href: "/atlas/relationship-intelligence",
      },
      {
        label: "High-risk relationships",
        value: highRiskRelationships,
        detail: `${highRiskRelationships} institutions are still under executive review.`,
        href: "/atlas/relationship-intelligence",
      },
    ],
  };
}

function createAiRecommendations(): readonly JourneyRecommendation[] {
  return defaultRelationshipPanelModel.insights.map((insight, index) => ({
    title: insight.title,
    description: insight.summary,
    priority: index === 0 ? "high" : "medium",
    generatedAt: new Date().toISOString(),
  }));
}

export default function ExecutiveCommandCenter() {
  const latestContexts = dedupeLatestContexts(getOperationsCenterContexts());
  const portfolioMetrics = createPortfolioMetrics(latestContexts);
  const passport = getJourneyBusinessPassportProjection();
  const passportProgress = createPassportProgressItems(latestContexts);
  const knowledgeInsights = getJourneyKnowledgeInsightsProjection();
  const relationshipAlerts = createRelationshipAlertModel(latestContexts);
  const recentActivity = createRecentActivity();
  const aiRecommendations = createAiRecommendations();

  const readyCount = passportProgress.filter((item) => item.progress >= 75).length;
  const inProgressCount = passportProgress.filter((item) => item.progress >= 25 && item.progress < 75).length;
  const earlyStageCount = passportProgress.filter((item) => item.progress < 25).length;

  return (
    <WorkspaceScaffold
      title="Executive Command Center"
      subtitle="Executive home page for portfolio oversight, work queue prioritization, relationship posture, and institutional intelligence."
      status={{ label: "Live", tone: "success" }}
      headerFields={[
        { label: "Operating Surface", value: "ATLAS Executive Home" },
        { label: "Portfolio Scope", value: `${latestContexts.length} active institutional workflows` },
        { label: "Relationship View", value: relationshipPanelConfig.workspaceLabel },
        { label: "Passport Progress", value: `${readyCount} ready / ${inProgressCount} in progress` },
        { label: "Collections Due", value: portfolioMetrics[4].value },
      ]}
      actions={[
        { label: "New Client", href: "/atlas/clients" },
        { label: "New Deal", href: "/atlas/deals/new" },
        { label: "Upload Documents", href: "/atlas/oracle" },
        { label: "Business Passport", href: "/atlas/business-passport" },
        { label: "Relationship Journey", href: "/atlas/journey" },
      ]}
      activity={recentActivity}
      main={(
        <div className="space-y-4">
          <SectionCard title="Portfolio Overview" icon={BriefcaseBusiness} badge={{ label: "Executive", variant: "info" }}>
            <KPIGrid items={[...portfolioMetrics]} />
          </SectionCard>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
            <BusinessPassportSummary passport={passport} />

            <SectionCard title="Relationship Alerts" icon={BellRing} badge={{ label: "Journey", variant: "warning" }}>
              <p className="text-sm text-slate-400">{relationshipPanelConfig.subtitle}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Follow-ups</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-100">{relationshipAlerts.followUps}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Expiring</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-100">{relationshipAlerts.expiringRelationships}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">High Risk</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-100">{relationshipAlerts.highRiskRelationships}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {relationshipAlerts.rows.map((row) => (
                  <Link
                    key={row.label}
                    href={row.href}
                    className="block rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-cyan-700/40 hover:bg-slate-950"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{row.label}</p>
                        <p className="mt-1 text-xs text-slate-400">{row.detail}</p>
                      </div>
                      <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
                        {row.value}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Business Passport Progress" icon={BadgeCheck} badge={{ label: "Onboarding", variant: "success" }}>
            <KPIGrid
              items={[
                {
                  label: "Ready",
                  value: String(readyCount),
                  note: "Institutions at funding-ready or later",
                },
                {
                  label: "In Progress",
                  value: String(inProgressCount),
                  note: "Passports currently advancing through review",
                },
                {
                  label: "At Intake",
                  value: String(earlyStageCount),
                  note: "Institution records still in early onboarding stages",
                },
              ]}
            />

            <div className="mt-4 space-y-3">
              {passportProgress.map((item) => (
                <div key={item.opportunityId} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{item.institutionId}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{item.opportunityId} • {formatLifecycle(item.lifecycle)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-100">{item.progress}%</p>
                      <p className="mt-1 text-xs text-slate-400">Owner {item.owner}</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-900">
                    <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <div>
            <RMWorkQueue />
          </div>

          <SectionCard title="Institutional Intelligence" icon={BrainCircuit} badge={{ label: "AI Summary", variant: "info" }}>
            <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.3fr)_360px]">
              <JourneyKnowledgeInsightsPanel insights={knowledgeInsights} />
              <JourneyAiPanel
                recommendations={aiRecommendations}
                missingItems={knowledgeInsights.missingInformation.map((item) => item.detail).slice(0, 4)}
                nextAction={defaultRelationshipPanelModel.nextActions[0]?.title ?? "Review the highest-priority institutional follow-up."}
                status={JourneyStatus.InProgress}
              />
            </div>
          </SectionCard>

          <SectionCard title="Quick Actions" icon={FolderKanban} badge={{ label: "Operational", variant: "default" }}>
            <QuickActionBar
              actions={[
                { label: "New Client", href: "/atlas/clients" },
                { label: "New Deal", href: "/atlas/deals/new" },
                { label: "Business Passport", href: "/atlas/business-passport" },
                { label: "Relationship Journey", href: "/atlas/journey" },
                { label: "Upload Documents", href: "/atlas/oracle" },
              ]}
            />
          </SectionCard>
        </div>
      )}
    />
  );
}