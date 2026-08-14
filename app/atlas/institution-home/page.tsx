import Link from "next/link";
import ProductHome from "@/components/product/home/ProductHome";
import UICard from "@/components/ui/Card";
import {
  toInstitutionHomeInsightViewModel,
  type InstitutionHomeIntelligenceSurface,
} from "@/lib/application/InstitutionHomeIntelligenceSurface";
import { dedupeLatestOpportunityContexts, formatOpportunityLifecycle } from "@/lib/workflows/OpportunityWorkspaceHelpers";
import { getOperationsCenterContexts } from "@/lib/workflows/DemoScenario";
import { OpportunityLifecycle } from "@/lib/workflows/WorkflowTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institution Home | Deepsea Nexus",
  description: "Institution command home focused on immediate priorities, next actions, and journey progression.",
};

type WorkQueueStatus = "pending" | "in_progress" | "blocked";

function toQueueStatus(lifecycle: OpportunityLifecycle): WorkQueueStatus {
  if (lifecycle === OpportunityLifecycle.UNDER_REVIEW || lifecycle === OpportunityLifecycle.FUNDING_ALLOCATED) {
    return "in_progress";
  }

  if (lifecycle === OpportunityLifecycle.SUBMITTED || lifecycle === OpportunityLifecycle.APPROVED) {
    return "pending";
  }

  return "blocked";
}

export default function AtlasInstitutionHomePage() {
  const contexts = dedupeLatestOpportunityContexts(getOperationsCenterContexts());
  const activeContexts = contexts.filter((context) => context.opportunityLifecycle !== OpportunityLifecycle.CLOSED);

  const journeyContext = activeContexts.find(
    (context) =>
      context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW
      || context.opportunityLifecycle === OpportunityLifecycle.SUBMITTED,
  ) ?? activeContexts[0];

  const journeyHref = journeyContext
    ? `/atlas/journey?opportunityId=${journeyContext.opportunityId}`
    : "/atlas/journey";
  const opportunityHref = journeyContext
    ? `/atlas/opportunity?opportunityId=${journeyContext.opportunityId}`
    : "/atlas/opportunity";

  const workQueue = activeContexts.slice(0, 4).map((context) => ({
    id: context.workflowId,
    title: `Progress ${context.opportunityId}`,
    owner: context.currentOwner,
    due: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "Today" : "This week",
    priority: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "critical" as const : "high" as const,
    status: toQueueStatus(context.opportunityLifecycle),
  }));

  const intelligenceSurface: InstitutionHomeIntelligenceSurface = {
    userContext: {
      actorId: "institution-home-user",
      experienceContext: "employee",
      roleLabel: "Relationship Manager",
      workspace: "institution-home",
    },
    intelligenceContext: {
      route: "/atlas/institution-home",
      generatedAt: new Date().toISOString(),
      activeOpportunityCount: activeContexts.length,
      opportunityId: journeyContext?.opportunityId,
      lifecycle: journeyContext?.opportunityLifecycle,
    },
    results: journeyContext
      ? [
          {
            id: "home-guidance",
            type: "guidance",
            title: "Seeded guidance: proceed with the current journey",
            explanation: `Prioritize ${journeyContext.opportunityId} and complete the next stage in Journey Workspace.`,
            priority: "high",
            source: {
              type: "workflow",
              label: "Current workflow context",
            },
            recommendedAction: {
              label: "Open Journey Workspace",
              target: journeyHref,
            },
          },
          {
            id: "home-summary",
            type: "summary",
            title: "Seeded guidance: keep operations synchronized",
            explanation: "Use Work Queue for immediate execution and Opportunity Workspace for full context.",
            priority: "medium",
            source: {
              type: "operations",
              label: "Operational queue context",
            },
            recommendedAction: {
              label: "Open Work Queue",
              target: "/atlas/work-queue",
            },
          },
        ]
      : [
          {
            id: "home-empty-guidance",
            type: "guidance",
            title: "Seeded guidance: no active opportunities are loaded",
            explanation: "Open Work Queue or Opportunity Workspace to start the next path.",
            priority: "low",
            source: {
              type: "system",
              label: "Institution home context",
            },
            recommendedAction: {
              label: "Open Work Queue",
              target: "/atlas/work-queue",
            },
          },
        ],
  };

  const intelligence = toInstitutionHomeInsightViewModel(intelligenceSurface);

  return (
    <div className="space-y-4">
      <UICard variant="accent" className="p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Institution Home</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">What matters right now</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Focus on the next institutional action and move from context to completion.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Current Context</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">{journeyContext?.opportunityId ?? "No active context"}</p>
            <p className="mt-1 text-xs text-slate-400">
              {journeyContext ? formatOpportunityLifecycle(journeyContext.opportunityLifecycle) : "Unavailable"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Next Action</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">
              {journeyContext ? `Open Journey for ${journeyContext.currentOwner}` : "Start an opportunity workflow"}
            </p>
            <p className="mt-1 text-xs text-slate-400">Guided execution path from context to completion.</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={journeyHref}
            className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 ds-motion hover:bg-cyan-300"
          >
            Open Journey Workspace
          </Link>
          <Link
            href="/atlas/work-queue"
            className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-100 ds-motion hover:border-cyan-400/60 hover:text-cyan-200"
          >
            Open Work Queue
          </Link>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Need full context for the current opportunity? Open{" "}
          <Link href={opportunityHref} className="text-cyan-300 hover:text-cyan-200">
            Opportunity Workspace
          </Link>
          .
        </p>
      </UICard>

      <ProductHome
        welcome={{
          greeting: "Welcome",
          headline: "Institution Operating Home",
          summary: "See what matters, decide quickly, and complete the next institutional action.",
          context: "Institution Home / Employee Shell",
          chips: ["Context First", "Decision Ready", "Action Guided"],
          primaryActionLabel: "Continue Journey",
          secondaryActionLabel: "Open Work Queue",
        }}
        insights={intelligence}
        workQueue={workQueue}
        quickActions={[
          { id: "home-quick-journey", label: "Open Journey Workspace", tone: "primary" },
          { id: "home-quick-work-queue", label: "Open Work Queue", tone: "secondary" },
        ]}
      />
    </div>
  );
}