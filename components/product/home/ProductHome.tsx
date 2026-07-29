import AIInsightsPanel, { type AIInsightItem } from "@/components/product/home/AIInsightsPanel";
import HomeQuickActions, { type HomeQuickAction } from "@/components/product/home/QuickActions";
import RecentActivity, { type ActivityItem } from "@/components/product/home/RecentActivity";
import RelationshipOverview, {
  type RelationshipRecord,
  type RelationshipSummaryItem,
} from "@/components/product/home/RelationshipOverview";
import MetricsStrip, { type MetricItem } from "@/components/product/home/MetricsStrip";
import WelcomePanel from "@/components/product/home/WelcomePanel";
import WorkQueue, { type WorkQueueItem } from "@/components/product/home/WorkQueue";

export interface ProductHomeProps {
  readonly welcome?: {
    readonly greeting: string;
    readonly headline: string;
    readonly summary: string;
    readonly context: string;
    readonly chips?: readonly string[];
    readonly primaryActionLabel?: string;
    readonly secondaryActionLabel?: string;
  };
  readonly metrics?: readonly MetricItem[];
  readonly insights?: readonly AIInsightItem[];
  readonly relationshipSummary?: readonly RelationshipSummaryItem[];
  readonly relationships?: readonly RelationshipRecord[];
  readonly activities?: readonly ActivityItem[];
  readonly workQueue?: readonly WorkQueueItem[];
  readonly quickActions?: readonly HomeQuickAction[];
}

const defaultMetrics: readonly MetricItem[] = [
  { id: "metric-1", label: "Active Workflows", value: "124", delta: "+8 today", icon: "activity" },
  { id: "metric-2", label: "Pending Decisions", value: "21", delta: "4 critical", icon: "queue" },
  { id: "metric-3", label: "SLA Within Target", value: "97.2%", delta: "Last 24h", icon: "checks" },
  { id: "metric-4", label: "Portfolio Coverage", value: "86 entities", delta: "Across 12 sectors", icon: "coverage" },
  { id: "metric-5", label: "Risk Alerts", value: "6", delta: "2 newly surfaced", icon: "risk" },
  { id: "metric-6", label: "Execution Throughput", value: "38", delta: "+11 this week", icon: "trend" },
];

const defaultInsights: readonly AIInsightItem[] = [
  {
    id: "ai-1",
    title: "Prioritize Logistics Renewal Pack",
    summary: "Three facilities converge on renewal windows in the next 48 hours with high approval probability.",
    confidence: 92,
    tags: ["Renewal", "High Confidence"],
  },
  {
    id: "ai-2",
    title: "Document Drift Detected",
    summary: "Two counterparties show variance between legal schedules and latest submitted invoice metadata.",
    confidence: 81,
    tags: ["Documents", "Review Required"],
  },
  {
    id: "ai-3",
    title: "Rebalance Review Capacity",
    summary: "Current queue density suggests shifting one analyst to approvals can reduce pending time by 14%.",
    confidence: 76,
    tags: ["Operations", "Capacity"],
  },
];

const defaultRelationshipSummary: readonly RelationshipSummaryItem[] = [
  { id: "rel-sum-1", label: "Total Relationships", value: "218" },
  { id: "rel-sum-2", label: "On Watch", value: "19" },
  { id: "rel-sum-3", label: "Healthy Exposure", value: "AED 1.42B" },
];

const defaultRelationships: readonly RelationshipRecord[] = [
  { id: "rel-1", name: "Crescent Trade Holdings", segment: "Corporate Trade", exposure: "AED 96M", status: "stable" },
  { id: "rel-2", name: "Gulf Maritime Logistics", segment: "Logistics", exposure: "AED 74M", status: "watch" },
  { id: "rel-3", name: "Northern Infrastructure", segment: "Industrial", exposure: "AED 61M", status: "attention" },
];

const defaultActivities: readonly ActivityItem[] = [
  {
    id: "act-1",
    title: "Approval memo finalized",
    detail: "Credit committee package was published for DNX-2026-00124.",
    timestamp: "09:20",
  },
  {
    id: "act-2",
    title: "Relationship profile refreshed",
    detail: "Crescent Trade Holdings profile synchronized with latest legal validation.",
    timestamp: "10:45",
  },
  {
    id: "act-3",
    title: "Funding instruction queued",
    detail: "Treasury work item created for AED 8.2M scheduled disbursement.",
    timestamp: "12:15",
  },
  {
    id: "act-4",
    title: "Exception routed",
    detail: "Policy exception sent to compliance for managed review path.",
    timestamp: "14:05",
  },
];

const defaultWorkQueue: readonly WorkQueueItem[] = [
  {
    id: "queue-1",
    title: "Finalize committee note for DNX-2026-00124",
    owner: "Credit Desk",
    due: "Today",
    priority: "critical",
    status: "in_progress",
  },
  {
    id: "queue-2",
    title: "Validate covenant schedule for RF-2026-0088",
    owner: "Legal",
    due: "Tomorrow",
    priority: "high",
    status: "pending",
  },
  {
    id: "queue-3",
    title: "Resolve missing onboarding evidence",
    owner: "Operations",
    due: "Tomorrow",
    priority: "medium",
    status: "blocked",
  },
];

const defaultQuickActions: readonly HomeQuickAction[] = [
  { id: "qa-1", label: "Open New Opportunity", tone: "primary" },
  { id: "qa-2", label: "Create Relationship Note", tone: "secondary" },
  { id: "qa-3", label: "Launch Approval Workspace", tone: "ghost" },
  { id: "qa-4", label: "Review AI Recommendation Queue", tone: "ghost" },
];

export default function ProductHome({
  welcome,
  metrics = defaultMetrics,
  insights = defaultInsights,
  relationshipSummary = defaultRelationshipSummary,
  relationships = defaultRelationships,
  activities = defaultActivities,
  workQueue = defaultWorkQueue,
  quickActions = defaultQuickActions,
}: ProductHomeProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <WelcomePanel
        greeting={welcome?.greeting ?? "Welcome back"}
        headline={welcome?.headline ?? "Institutional Operations Command Center"}
        summary={
          welcome?.summary
          ?? "Monitor performance, focus execution, and coordinate decisions across relationships, risk, legal, and funding in one calm workspace."
        }
        context={welcome?.context ?? "Live workspace context: ATLAS / Relationship Management"}
        chips={welcome?.chips ?? ["Institutional", "Operational", "Decision-Ready"]}
        primaryActionLabel={welcome?.primaryActionLabel ?? "Resume Daily Workflow"}
        secondaryActionLabel={welcome?.secondaryActionLabel ?? "Open Briefing"}
      />

      <MetricsStrip metrics={metrics} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <AIInsightsPanel insights={insights} />
        <RelationshipOverview summary={relationshipSummary} topRelationships={relationships} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <RecentActivity items={activities} />
        <HomeQuickActions actions={quickActions} />
      </div>

      <WorkQueue items={workQueue} />
    </div>
  );
}
