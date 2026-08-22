import Link from "next/link";
import { cookies, headers } from "next/headers";
import WorkflowTimelinePanel from "@/components/atlas/workflows/WorkflowTimelinePanel";
import { InstitutionStatus } from "@/lib/institution/constants/InstitutionStatus";
import { InstitutionType } from "@/lib/institution/constants/InstitutionType";
import { createInstitutionRuntimeComposition } from "@/lib/application/InstitutionRuntimeComposition";
import { createInstitutionalDigitalTwin, type InstitutionalDigitalTwin } from "@/lib/runtime/InstitutionalDigitalTwin";
import { resolveServerRuntimeAuthContext, type RuntimeAuthCookieAdapter } from "@/lib/supabase/runtimeAuth";
import ExecutiveAlerts from "@/src/capabilities/executive/components/ExecutiveAlerts";
import ExecutiveDashboard from "@/src/capabilities/executive/components/ExecutiveDashboard";
import ExecutiveDecisions from "@/src/capabilities/executive/components/ExecutiveDecisions";
import { createLiveExecutiveWorkspaceViewModel } from "@/src/capabilities/executive/services/ExecutiveWorkspaceAssembler";
import type {
  ExecutiveAlertItem,
  ExecutiveDecisionItem,
  ExecutiveKpiItem,
} from "@/src/capabilities/executive/types/ExecutiveWorkspaceState";
import {
  createBusinessContext,
  parseBusinessContext,
  serializeBusinessContext,
  transitionBusinessContext,
  type BusinessContext,
  type CustomerOnboardingWorkflowInput,
  type WorkflowContext,
  type WorkflowContextRepository,
  type WorkflowContextServices,
} from "@/lib/workflows/WorkflowContext";
import { buildMockWorkflowEvents } from "@/lib/workflows/WorkflowTimeline";
import {
  OpportunityLifecycle,
  canTransitionOpportunityLifecycle,
  transitionOpportunityLifecycle,
} from "@/lib/workflows/WorkflowTransition";
import { createInstitutionContextProvider } from "@/lib/workspaces/InstitutionContextProvider";
import { createInstitutionContextSummaryBuilder } from "@/lib/workspaces/InstitutionContextSummary";
import { WorkflowRunState } from "@/lib/workflows/WorkflowExecutionState";
import { WorkflowStep } from "@/lib/workflows/WorkflowStep";

function toOpportunityLifecycleLabel(value: OpportunityLifecycle): string {
  return value.replaceAll("_", " ");
}

async function createCookieAdapter(): Promise<RuntimeAuthCookieAdapter> {
  const cookieStore = await cookies();

  return {
    get(name: string): string | undefined {
      return cookieStore.get(name)?.value;
    },
  };
}

function resolveBusinessContext(
  workflowContextRepository: WorkflowContextRepository,
  workflowId: string | undefined,
): BusinessContext | undefined {
  if (workflowId) {
    const byWorkflowId = workflowContextRepository.findByWorkflowId(workflowId);
    if (byWorkflowId) {
      return byWorkflowId;
    }
  }

  const [latest] = workflowContextRepository.list();
  return latest;
}

function createLiveWorkflowContext(input: { readonly workflowId: string }): WorkflowContext {
  return {
    workflowId: input.workflowId,
    executionId: `exec-${input.workflowId}`,
    currentStep: WorkflowStep.InstitutionIntelligence,
    services: {} as WorkflowContextServices,
    input: {} as CustomerOnboardingWorkflowInput,
  } as WorkflowContext;
}

function createLiveInstitutionContext(input: {
  readonly runtime: Awaited<ReturnType<typeof resolveServerRuntimeAuthContext>>;
  readonly businessContext: BusinessContext;
  readonly workflowId: string;
  readonly timestamp: string;
}) {
  const institutionContextProvider = createInstitutionContextProvider();

  return institutionContextProvider.provide({
    institution: {
      identity: {
        institutionId: input.businessContext.institutionId,
        legalName: input.runtime.identity.identity.displayName ?? input.runtime.identity.identity.email ?? input.businessContext.institutionId,
        displayName: input.runtime.identity.identity.displayName ?? input.runtime.identity.identity.email ?? input.businessContext.institutionId,
        institutionType: InstitutionType.Corporate,
        jurisdiction: (input.runtime.identity.identity.metadata.jurisdiction as string | undefined) ?? "Live Runtime",
        registrationNumber: input.workflowId,
      },
      status: input.runtime.session.isAuthenticated ? InstitutionStatus.Active : InstitutionStatus.Draft,
      profile: {
        legalForm: input.runtime.identity.identity.memberships[0] ?? "Executive Runtime",
        businessActivity: `Live executive cockpit for ${input.businessContext.opportunityId}`,
        establishedOn: input.runtime.session.snapshot.metadata.issuedAt ?? input.timestamp,
        references: {
          businessPassportId: input.businessContext.opportunityId,
          timelineId: input.businessContext.workflowId,
          journeyId: input.businessContext.workflowId,
          evidenceIds: [input.businessContext.opportunityId],
          knowledgeIds: [input.businessContext.workflowId],
        },
      },
      metadata: {
        createdAt: input.runtime.session.snapshot.metadata.issuedAt ?? input.timestamp,
        createdBy: input.runtime.identity.identity.identityId,
        updatedAt: input.timestamp,
        updatedBy: input.runtime.identity.identity.identityId,
        source: "runtime-auth",
      },
    },
    passport: undefined,
    journey: undefined,
    health: undefined,
    intelligence: undefined,
    commercialSummary: {
      opportunityId: input.businessContext.opportunityId,
      product: input.businessContext.currentWorkspace === "executive" ? "Executive Review" : undefined,
      indicativeAmount: input.businessContext.receivableId ? `Linked receivable ${input.businessContext.receivableId}` : undefined,
      indicativeTenor: input.businessContext.opportunityLifecycle === OpportunityLifecycle.FUNDING_ALLOCATED ? "Live funding allocation" : "Live workflow review",
      stage: input.businessContext.opportunityLifecycle,
      readyForApproval: input.businessContext.opportunityLifecycle === OpportunityLifecycle.APPROVED,
    },
    workflowExecutionState: {
      workflowId: input.workflowId,
      executionId: `exec-${input.workflowId}`,
      runState: WorkflowRunState.Completed,
      currentStep: WorkflowStep.InstitutionIntelligence,
      completedSteps: [WorkflowStep.InstitutionIntelligence],
      pendingSteps: [],
      startedAt: input.runtime.session.snapshot.metadata.issuedAt ?? input.timestamp,
      completedAt: input.timestamp,
      lastEventAt: input.timestamp,
    },
    totalWorkflowSteps: 1,
    assembledAt: input.timestamp,
  });
}

function buildApprovalQueueItem(input: {
  readonly context: BusinessContext;
  readonly institutionName: string;
  readonly timestamp: string;
}): ApprovalQueueItem {
  return {
    id: `queue-${input.context.workflowId}`,
    businessContext: input.context,
    institutionName: input.institutionName,
    opportunityReference: input.context.opportunityId,
    requestedAmount: input.context.receivableId ? `Receivable ${input.context.receivableId}` : `Opportunity ${input.context.opportunityId}`,
    requestedTenor: input.context.opportunityLifecycle === OpportunityLifecycle.FUNDING_ALLOCATED ? "Allocated funding" : "Live runtime review",
    currentStatus: input.context.opportunityLifecycle,
    submittedBy: input.context.currentOwner,
    submissionDate: input.timestamp,
    product: input.context.currentWorkspace === "executive" ? "Executive Review" : "Live Opportunity",
  };
}

type ExecutivePageProps = {
  searchParams?: Promise<{
    businessContext?: string;
    workflowId?: string;
    queueId?: string;
    institutionName?: string;
    opportunityId?: string;
    product?: string;
    targetAmount?: string;
    tenor?: string;
    currentStatus?: string;
    submittedBy?: string;
    submissionDate?: string;
  }>;
};

type ApprovalQueueItem = {
  readonly id: string;
  readonly businessContext: BusinessContext;
  readonly institutionName: string;
  readonly opportunityReference: string;
  readonly requestedAmount: string;
  readonly requestedTenor: string;
  readonly currentStatus: OpportunityLifecycle;
  readonly submittedBy: string;
  readonly submissionDate: string;
  readonly product: string;
};

export default async function ExecutivePage({ searchParams }: ExecutivePageProps) {
  const params = (await searchParams) ?? {};
  const requestHeaders = await headers();
  const requestCookies = await createCookieAdapter();
  const runtimeComposition = createInstitutionRuntimeComposition();
  const workflowContextRepository = runtimeComposition.workflowContextRepository;
  const runtime = await resolveServerRuntimeAuthContext({
    url: "http://localhost/executive",
    method: "GET",
    pathname: "/executive",
    headers: requestHeaders,
    searchParams: new URLSearchParams(params.workflowId ? { workflowId: params.workflowId } : {}),
    cookies: requestCookies,
  });

  const parsedBusinessContext = parseBusinessContext(params.businessContext);
  const repositoryBusinessContext = resolveBusinessContext(
    workflowContextRepository,
    params.workflowId,
  );
  const businessContext = repositoryBusinessContext ?? parsedBusinessContext ?? createBusinessContext({
    institutionId: runtime.identity.identity.identityId,
    opportunityId: params.opportunityId ?? `OPP-${runtime.identity.identity.identityId}`,
    workflowId: params.workflowId ?? `EXEC-${runtime.identity.identity.identityId}`,
    opportunityLifecycle: OpportunityLifecycle.UNDER_REVIEW,
    currentOwner: runtime.identity.identity.displayName ?? runtime.identity.identity.identityId,
    currentWorkspace: "executive",
  });

  if (parsedBusinessContext && !repositoryBusinessContext) {
    workflowContextRepository.save(parsedBusinessContext);
  }

  if (!repositoryBusinessContext) {
    workflowContextRepository.save(businessContext);
  }

  const timestamp = runtime.session.snapshot.metadata.lastRefreshedAt
    ?? runtime.session.snapshot.metadata.issuedAt
    ?? new Date().toISOString();
  const workflowId = businessContext.workflowId;
  const institutionContext = createLiveInstitutionContext({
    runtime,
    businessContext,
    workflowId,
    timestamp,
  });
  const summary = createInstitutionContextSummaryBuilder().build(institutionContext);
  const workflow = createLiveWorkflowContext({
    workflowId,
  });
  const digitalTwin: InstitutionalDigitalTwin = createInstitutionalDigitalTwin({
    authentication: runtime,
    workflow,
    institutionContext,
  });

  const liveQueueContexts = workflowContextRepository.list();
  const approvalQueue: ApprovalQueueItem[] = liveQueueContexts.length > 0
    ? liveQueueContexts.map((context) => buildApprovalQueueItem({
        context,
        institutionName: context.institutionId === institutionContext.institution.identity.institutionId
          ? institutionContext.institution.identity.legalName
          : `Institution ${context.institutionId}`,
        timestamp,
      }))
    : [buildApprovalQueueItem({
        context: businessContext,
        institutionName: institutionContext.institution.identity.legalName,
        timestamp,
      })];

  const selectedQueueId = params.queueId ?? approvalQueue[0]?.id;
  const selectedQueueItem = approvalQueue.find((item) => item.id === selectedQueueId) ?? approvalQueue[0];
  const statusLabel = selectedQueueItem.currentStatus === OpportunityLifecycle.UNDER_REVIEW
    ? "Pending Executive Decision"
    : toOpportunityLifecycleLabel(selectedQueueItem.currentStatus);

  let treasuryLifecycle = selectedQueueItem.currentStatus;

  if (canTransitionOpportunityLifecycle(treasuryLifecycle, OpportunityLifecycle.UNDER_REVIEW)) {
    treasuryLifecycle = transitionOpportunityLifecycle(treasuryLifecycle, OpportunityLifecycle.UNDER_REVIEW);
  }

  if (canTransitionOpportunityLifecycle(treasuryLifecycle, OpportunityLifecycle.APPROVED)) {
    treasuryLifecycle = transitionOpportunityLifecycle(treasuryLifecycle, OpportunityLifecycle.APPROVED);
  }

  if (canTransitionOpportunityLifecycle(treasuryLifecycle, OpportunityLifecycle.FUNDING_ALLOCATED)) {
    treasuryLifecycle = transitionOpportunityLifecycle(treasuryLifecycle, OpportunityLifecycle.FUNDING_ALLOCATED);
  }

  let treasuryBusinessContext = selectedQueueItem.businessContext;

  if (canTransitionOpportunityLifecycle(treasuryBusinessContext.opportunityLifecycle, OpportunityLifecycle.APPROVED)) {
    treasuryBusinessContext = transitionBusinessContext({
      context: treasuryBusinessContext,
      toLifecycle: OpportunityLifecycle.APPROVED,
      toWorkspace: "executive",
      nextOwner: selectedQueueItem.submittedBy,
    });
  }

  if (canTransitionOpportunityLifecycle(treasuryBusinessContext.opportunityLifecycle, OpportunityLifecycle.FUNDING_ALLOCATED)) {
    treasuryBusinessContext = transitionBusinessContext({
      context: treasuryBusinessContext,
      toLifecycle: OpportunityLifecycle.FUNDING_ALLOCATED,
      toWorkspace: "treasury",
      nextOwner: "Treasury Desk",
    });
  }

  workflowContextRepository.save(treasuryBusinessContext);

  const executiveWorkspaceViewModel = createLiveExecutiveWorkspaceViewModel({
    institutionContext,
    digitalTwin,
    summary,
    approvalQueueSize: approvalQueue.length,
  });

  const approvalQueueKpis: ExecutiveKpiItem[] = [
    {
      id: "queue-count",
      label: "Approval Queue",
      value: String(approvalQueue.length),
      note: "Live workflow repository contexts",
    },
    {
      id: "queue-institution",
      label: "Institution",
      value: selectedQueueItem.institutionName,
      note: "Derived from the current runtime institution context",
    },
    {
      id: "queue-opportunity",
      label: "Opportunity",
      value: selectedQueueItem.opportunityReference,
      note: `${selectedQueueItem.product} · ${selectedQueueItem.requestedAmount}`,
    },
    {
      id: "queue-tenor",
      label: "Requested Tenor",
      value: selectedQueueItem.requestedTenor,
      note: `${statusLabel} · Submitted by ${selectedQueueItem.submittedBy}`,
    },
  ];

  const approvalQueueDecisions: ExecutiveDecisionItem[] = [
    {
      id: "decision-pending-submission",
      title: `${selectedQueueItem.institutionName} · ${selectedQueueItem.product}`,
      committee: "Executive Credit Committee",
      outcome: selectedQueueItem.currentStatus === OpportunityLifecycle.APPROVED ? "approved" : "pending",
      decidedAt: `Submitted ${selectedQueueItem.submissionDate}`,
      lifecycleStatus: selectedQueueItem.currentStatus,
    },
  ];

  const approvalQueueAlerts: ExecutiveAlertItem[] = [
    {
      id: "alert-new-commercial-submission",
      category: "Approval Queue",
      message: `Submission ${selectedQueueItem.opportunityReference} is awaiting executive approval.`,
      severity: selectedQueueItem.currentStatus === OpportunityLifecycle.UNDER_REVIEW ? "medium" : "low",
      updatedAt: selectedQueueItem.submissionDate,
    },
  ];

  const workflowEvents = buildMockWorkflowEvents({
    institutionName: selectedQueueItem.institutionName,
    opportunityReference: selectedQueueItem.opportunityReference,
    fundingAmount: selectedQueueItem.requestedAmount,
    submittedBy: selectedQueueItem.submittedBy,
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-8">
          <p className="text-sm font-medium tracking-[0.22em] text-cyan-700 uppercase">Executive Workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {executiveWorkspaceViewModel.greeting}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            {executiveWorkspaceViewModel.title}
          </p>
        </header>

        <section aria-labelledby="executive-kpis" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <h2 id="executive-kpis" className="sr-only">
            Executive KPIs
          </h2>
          {executiveWorkspaceViewModel.kpis.map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1"
              aria-label={item.label}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{item.value}</p>
              {item.detail && <p className="mt-2 text-sm text-slate-600">{item.detail}</p>}
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]" aria-label="Executive briefing and priority">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-700 uppercase">AI Chief of Staff</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {executiveWorkspaceViewModel.aiChiefOfStaff.title}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              <p>{executiveWorkspaceViewModel.executiveBrief}</p>
              <p>{executiveWorkspaceViewModel.aiChiefOfStaff.narrative}</p>
            </div>
          </article>

          <aside className="rounded-3xl border border-slate-950 bg-slate-950 p-6 text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)] sm:p-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-300 uppercase">
              {executiveWorkspaceViewModel.todayPriority.title}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {executiveWorkspaceViewModel.todayPriority.detail}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              Use the current intelligence score to guide which businesses receive immediate senior attention and which can progress through standard review.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Executive note</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                All content on this page is assembled from institutional models and rendered read-only.
              </p>
            </div>
          </aside>
        </section>

        <section aria-labelledby="quick-actions" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-cyan-700 uppercase">Quick Actions</p>
              <h2 id="quick-actions" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Move the business forward
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {executiveWorkspaceViewModel.actions.map((action) => (
              <article
                key={action.label}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50"
                aria-label={action.label}
              >
                <p className="text-lg font-semibold text-slate-950 sm:text-xl">{action.label}</p>
                {action.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{action.description}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3" aria-label="Approval queue">
          <article className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-700 uppercase">Approval Queue</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Submitted Opportunities
            </h2>
            <div className="mt-3">
              <Link
                href={`/atlas/treasury?${new URLSearchParams({
                  businessContext: serializeBusinessContext(treasuryBusinessContext),
                  workflowId: treasuryBusinessContext.workflowId,
                  fundingId: selectedQueueItem.id,
                  institutionName: selectedQueueItem.institutionName,
                  opportunityId: selectedQueueItem.opportunityReference,
                  fundingAmount: selectedQueueItem.requestedAmount,
                  fundingDate: selectedQueueItem.submissionDate,
                  currency: "USD",
                  priority: "high",
                  status: treasuryLifecycle,
                }).toString()}`}
                className="inline-flex items-center rounded border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-100"
              >
                Approve Funding →
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    <th className="px-3 py-2">Institution Name</th>
                    <th className="px-3 py-2">Opportunity Reference</th>
                    <th className="px-3 py-2">Requested Amount</th>
                    <th className="px-3 py-2">Requested Tenor</th>
                    <th className="px-3 py-2">Current Status</th>
                    <th className="px-3 py-2">Submitted By</th>
                    <th className="px-3 py-2">Submission Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {approvalQueue.map((item) => {
                    const itemParams = new URLSearchParams({
                      businessContext: serializeBusinessContext(item.businessContext),
                      workflowId: item.businessContext.workflowId,
                      queueId: item.id,
                      institutionName: item.institutionName,
                      opportunityId: item.opportunityReference,
                      product: item.product,
                      targetAmount: item.requestedAmount,
                      tenor: item.requestedTenor,
                      currentStatus: item.currentStatus,
                      submittedBy: item.submittedBy,
                      submissionDate: item.submissionDate,
                    });

                    const isSelected = item.id === selectedQueueItem.id;

                    return (
                      <tr key={item.id} className={isSelected ? "bg-cyan-50/70" : "bg-white"}>
                        <td className="px-3 py-3">
                          <Link href={`/executive?${itemParams.toString()}`} className="font-semibold text-cyan-700 hover:text-cyan-600">
                            {item.institutionName}
                          </Link>
                        </td>
                        <td className="px-3 py-3">{item.opportunityReference}</td>
                        <td className="px-3 py-3">{item.requestedAmount}</td>
                        <td className="px-3 py-3">{item.requestedTenor}</td>
                        <td className="px-3 py-3 uppercase tracking-[0.08em] text-slate-600">{toOpportunityLifecycleLabel(item.currentStatus)}</td>
                        <td className="px-3 py-3">{item.submittedBy}</td>
                        <td className="px-3 py-3">{item.submissionDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>

          <div className="lg:col-span-3">
            <ExecutiveDashboard items={approvalQueueKpis} />
          </div>
          <ExecutiveDecisions items={approvalQueueDecisions} />
          <div className="lg:col-span-2">
            <ExecutiveAlerts items={approvalQueueAlerts} />
          </div>
        </section>

        <WorkflowTimelinePanel
          events={workflowEvents}
          title="Workflow Timeline"
          compact
          variant="light"
        />
      </main>
    </div>
  );
}
