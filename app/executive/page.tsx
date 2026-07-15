import Link from "next/link";
import WorkflowTimelinePanel from "@/components/atlas/workflows/WorkflowTimelinePanel";
import type { BusinessDNA } from "@/lib/knowledge/businessDNA";
import type { KnowledgeAttribute } from "@/lib/knowledge/knowledgeAttribute";
import type { FundingAssessment } from "@/lib/business/fundingAssessmentService";
import type { RelationshipTimeline } from "@/lib/relationship/relationshipTimeline";
import {
  createBusinessContext,
  parseBusinessContext,
  serializeBusinessContext,
  transitionBusinessContext,
  workflowContextRepository,
} from "@/lib/workflows/WorkflowContext";
import { buildMockWorkflowEvents } from "@/lib/workflows/WorkflowTimeline";
import {
  OpportunityLifecycle,
  canTransitionOpportunityLifecycle,
  transitionOpportunityLifecycle,
} from "@/lib/workflows/WorkflowTransition";
import { getDemoScenario } from "@/lib/workflows/DemoScenario";
import { executiveWorkspaceAssembler } from "@/lib/workspaces/executiveWorkspaceAssembler";
import ExecutiveAlerts from "@/src/capabilities/executive/components/ExecutiveAlerts";
import ExecutiveDashboard from "@/src/capabilities/executive/components/ExecutiveDashboard";
import ExecutiveDecisions from "@/src/capabilities/executive/components/ExecutiveDecisions";
import type {
  ExecutiveAlertItem,
  ExecutiveDecisionItem,
  ExecutiveKpiItem,
} from "@/src/capabilities/executive/types/ExecutiveWorkspaceState";

function attribute<T>(value: T, source: string, confidence = 92, updatedAt = "2026-07-12T09:00:00Z"): KnowledgeAttribute<T> {
  return {
    value,
    source,
    confidence,
    updatedAt,
  };
}

const businesses: BusinessDNA[] = [
  {
    identity: {
      legalName: attribute("Alpine Logistics LLC", "executive portfolio"),
      tradingName: attribute("Alpine Logistics", "executive portfolio", 88),
      entityType: attribute("Logistics Company", "executive portfolio"),
      registrationNumber: attribute("TRN-10294", "executive portfolio", 86),
      incorporationDate: attribute("2019-03-14", "executive portfolio", 84),
      jurisdiction: attribute("Dubai, UAE", "executive portfolio"),
      website: attribute("alpinelogistics.ae", "executive portfolio", 80),
      headquartersLocation: attribute("Dubai South", "executive portfolio", 84),
    },
    business: {
      industry: attribute("Logistics and Freight", "portfolio data"),
      businessModel: attribute("B2B logistics services", "portfolio data"),
      productsServices: attribute(["Freight forwarding", "Warehousing", "Last-mile delivery"], "portfolio data"),
      customerSegments: attribute(["Importers", "Regional distributors", "Retailers"], "portfolio data"),
      operatingMarkets: attribute(["UAE", "GCC"], "portfolio data"),
      employeeCount: attribute(126, "portfolio data", 90),
      operatingRegions: attribute(["Dubai", "Abu Dhabi", "Sharjah"], "portfolio data"),
    },
    financial: {
      revenueRange: attribute("AED 40M - AED 50M", "portfolio data"),
      monthlyTurnover: attribute("AED 3.8M", "portfolio data"),
      profitability: attribute("Healthy operating margin", "portfolio data"),
      fundingNeed: attribute("AED 10M", "portfolio data"),
      preferredFacility: attribute("Working Capital Line", "portfolio data"),
      bankAccountCountry: attribute("UAE", "portfolio data"),
      cashFlowProfile: attribute("Receivables-backed cash flow with seasonal peaks", "portfolio data"),
    },
    behaviour: {
      paymentBehaviour: attribute("Strong payment discipline", "portfolio data"),
      invoicingBehaviour: attribute("Invoices issued weekly", "portfolio data"),
      seasonality: attribute("Q4 demand surge", "portfolio data"),
      growthTrend: attribute("Accelerating", "portfolio data"),
      riskSignals: attribute(["Long receivables cycle"], "portfolio data"),
      operationalDiscipline: attribute("Well documented and repeatable", "portfolio data"),
    },
    relationship: {
      relationshipOwner: attribute("Executive Coverage Team", "portfolio data"),
      relationshipStage: attribute("Discovery", "portfolio data"),
      referralSource: attribute("Inbound pipeline", "portfolio data"),
      engagementLevel: attribute("Warm", "portfolio data"),
      responsiveness: attribute("Responsive", "portfolio data"),
      trustLevel: attribute("Building", "portfolio data"),
    },
    intelligence: {
      profileCompleteness: attribute(91, "portfolio scoring"),
      documentCoverage: attribute(87, "portfolio scoring"),
      dataFreshness: attribute("Today", "portfolio scoring"),
      overallConfidence: attribute(91, "portfolio scoring"),
      nextBestAction: attribute("Approve senior review and schedule an outreach sequence", "portfolio scoring"),
      insightSummary: attribute("Large logistics relationship with strong operating discipline and active funding demand.", "portfolio scoring"),
    },
  },
  {
    identity: {
      legalName: attribute("Northstar Foods Trading", "executive portfolio"),
      entityType: attribute("Trading Company", "executive portfolio"),
      jurisdiction: attribute("Abu Dhabi, UAE", "executive portfolio"),
    },
    business: {
      industry: attribute("Food Distribution", "portfolio data"),
      businessModel: attribute("B2B food wholesale", "portfolio data"),
    },
    financial: {
      fundingNeed: attribute("AED 5M", "portfolio data"),
      preferredFacility: attribute("Invoice Financing", "portfolio data"),
    },
    behaviour: {},
    relationship: {},
    intelligence: {
      overallConfidence: attribute(84, "portfolio scoring"),
    },
  },
  {
    identity: {
      legalName: attribute("Summit Industrial Supplies", "executive portfolio"),
      entityType: attribute("Industrial Supplier", "executive portfolio"),
      jurisdiction: attribute("Sharjah, UAE", "executive portfolio"),
    },
    business: {
      industry: attribute("Industrial Supplies", "portfolio data"),
      businessModel: attribute("B2B supply chain", "portfolio data"),
    },
    financial: {
      fundingNeed: attribute("AED 2.5M", "portfolio data"),
      preferredFacility: attribute("Business Expansion Facility", "portfolio data"),
    },
    behaviour: {},
    relationship: {},
    intelligence: {
      overallConfidence: attribute(79, "portfolio scoring"),
    },
  },
];

const fundingAssessments: FundingAssessment[] = [
  {
    recommendedFacility: "Working Capital Line",
    confidence: 91,
    advanceRate: "32.4",
    riskLevel: "MEDIUM",
    turnaround: "3-5 business days",
    recommendation: "Proceed with a working capital line subject to standard portfolio review.",
  },
  {
    recommendedFacility: "Invoice Financing",
    confidence: 84,
    advanceRate: "27.8",
    riskLevel: "LOW",
    turnaround: "24-48 hours",
    recommendation: "Proceed with invoice financing for the food distribution relationship.",
  },
  {
    recommendedFacility: "Business Expansion Facility",
    confidence: 79,
    advanceRate: "24.1",
    riskLevel: "MEDIUM",
    turnaround: "3-5 business days",
    recommendation: "Advance to senior review for the industrial supply opportunity.",
  },
];

const relationshipTimelines: RelationshipTimeline[] = [
  {
    businessId: "alpine-logistics-llc",
    events: [
      {
        id: "alpine-intake",
        occurredAt: "2026-07-12T07:30:00Z",
        category: "Intake",
        title: "Business Profile Created",
        description: "Logistics relationship captured and qualified for executive review.",
        confidence: 92,
        source: "portfolio intake",
      },
      {
        id: "alpine-contact",
        occurredAt: "2026-07-12T08:10:00Z",
        category: "Relationship",
        title: "Senior Outreach Required",
        description: "Customer is warm and ready for a direct executive contact sequence.",
        confidence: 90,
        source: "relationship management",
      },
    ],
  },
  {
    businessId: "northstar-foods-trading",
    events: [
      {
        id: "northstar-intake",
        occurredAt: "2026-07-12T08:25:00Z",
        category: "Funding",
        title: "Funding Need Recorded",
        description: "Invoice financing appetite captured for the food distribution business.",
        confidence: 88,
        source: "portfolio intake",
      },
    ],
  },
  {
    businessId: "summit-industrial-supplies",
    events: [
      {
        id: "summit-review",
        occurredAt: "2026-07-12T08:50:00Z",
        category: "Review",
        title: "Executive Review Pending",
        description: "Industrial supply case is ready for prioritization and follow-up.",
        confidence: 79,
        source: "portfolio review",
      },
    ],
  },
];

const executiveWorkspaceViewModel = executiveWorkspaceAssembler.build(businesses, fundingAssessments, relationshipTimelines);

type ExecutivePageProps = {
  searchParams?: Promise<{
    demoScenario?: string;
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
  readonly businessContext: ReturnType<typeof createBusinessContext>;
  readonly institutionName: string;
  readonly opportunityReference: string;
  readonly requestedAmount: string;
  readonly requestedTenor: string;
  readonly currentStatus: OpportunityLifecycle;
  readonly submittedBy: string;
  readonly submissionDate: string;
  readonly product: string;
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

function toOpportunityLifecycleLabel(value: OpportunityLifecycle): string {
  return value.replaceAll("_", " ");
}

export default async function ExecutivePage({ searchParams }: ExecutivePageProps) {
  const params = (await searchParams) ?? {};
  const demoScenario = getDemoScenario(params.demoScenario);
  const parsedBusinessContext = parseBusinessContext(params.businessContext);
  const workflowId = parsedBusinessContext?.workflowId
    ?? demoScenario?.contexts.executive.workflowId
    ?? params.workflowId
    ?? "COM-ORIG-9001";

  if (demoScenario) {
    workflowContextRepository.save(demoScenario.contexts.executive);
  }

  const repositoryBusinessContext = workflowContextRepository.findByWorkflowId(workflowId);
  const resolvedBusinessContext = repositoryBusinessContext ?? parsedBusinessContext;

  if (!repositoryBusinessContext && parsedBusinessContext) {
    workflowContextRepository.save(parsedBusinessContext);
  }

  const hasSubmission = Boolean(resolvedBusinessContext?.opportunityId ?? params.opportunityId);
  const submittedInstitution = params.institutionName ?? resolvedBusinessContext?.institutionId ?? "Al Noor Trading LLC";
  const submittedOpportunityId = resolvedBusinessContext?.opportunityId ?? params.opportunityId ?? "OPP-7712";
  const submittedProduct = params.product ?? "Receivables Finance";
  const submittedTargetAmount = params.targetAmount ?? "USD 6,200,000";
  const submittedTenor = params.tenor ?? "180 days";
  const submittedStatus = resolvedBusinessContext?.opportunityLifecycle
    ?? toOpportunityLifecycle(params.currentStatus, OpportunityLifecycle.SUBMITTED);
  const submittedBy = resolvedBusinessContext?.currentOwner ?? params.submittedBy ?? "Relationship Manager";
  const submittedAt = params.submissionDate ?? "2026-07-15T10:30:00Z";

  const defaultBusinessContext = createBusinessContext({
    institutionId: "INS-AL-NOOR",
    opportunityId: submittedOpportunityId,
    workflowId,
    opportunityLifecycle: OpportunityLifecycle.UNDER_REVIEW,
    currentOwner: submittedBy,
    currentWorkspace: "executive",
  });

  const mockApprovalQueue: ApprovalQueueItem[] = [
    {
      id: "queue-op-7712",
      businessContext: createBusinessContext({
        institutionId: "INS-AL-NOOR",
        opportunityId: "OPP-7712",
        workflowId: "COM-ORIG-9001",
        opportunityLifecycle: OpportunityLifecycle.UNDER_REVIEW,
        currentOwner: "Layla Rahman",
        currentWorkspace: "executive",
      }),
      institutionName: "Al Noor Trading LLC",
      opportunityReference: "OPP-7712",
      requestedAmount: "USD 6,200,000",
      requestedTenor: "180 days",
      currentStatus: OpportunityLifecycle.UNDER_REVIEW,
      submittedBy: "Layla Rahman",
      submissionDate: "2026-07-14T16:00:00Z",
      product: "Receivables Finance",
    },
    {
      id: "queue-op-6640",
      businessContext: createBusinessContext({
        institutionId: "INS-NORTHSTAR",
        opportunityId: "OPP-6640",
        workflowId: "COM-ORIG-9002",
        opportunityLifecycle: OpportunityLifecycle.UNDER_REVIEW,
        currentOwner: "Executive Coverage Team",
        currentWorkspace: "executive",
      }),
      institutionName: "Northstar Foods Trading",
      opportunityReference: "OPP-6640",
      requestedAmount: "USD 3,900,000",
      requestedTenor: "120 days",
      currentStatus: OpportunityLifecycle.UNDER_REVIEW,
      submittedBy: "Executive Coverage Team",
      submissionDate: "2026-07-13T09:15:00Z",
      product: "Invoice Financing",
    },
  ];

  const approvalQueue: ApprovalQueueItem[] = hasSubmission
    ? [
        {
          id: `queue-${submittedOpportunityId.toLowerCase()}`,
          businessContext: resolvedBusinessContext
            ? canTransitionOpportunityLifecycle(
                resolvedBusinessContext.opportunityLifecycle,
                OpportunityLifecycle.UNDER_REVIEW,
              )
              ? transitionBusinessContext({
                  context: resolvedBusinessContext,
                  toLifecycle: OpportunityLifecycle.UNDER_REVIEW,
                  toWorkspace: "executive",
                  nextOwner: submittedBy,
                })
              : createBusinessContext({
                  ...resolvedBusinessContext,
                  currentWorkspace: "executive",
                  currentOwner: submittedBy,
                })
            : defaultBusinessContext,
          institutionName: submittedInstitution,
          opportunityReference: submittedOpportunityId,
          requestedAmount: submittedTargetAmount,
          requestedTenor: submittedTenor,
          currentStatus: submittedStatus,
          submittedBy,
          submissionDate: submittedAt,
          product: submittedProduct,
        },
        ...mockApprovalQueue.filter((item) => item.opportunityReference !== submittedOpportunityId),
      ]
    : mockApprovalQueue;

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

  const approvalQueueKpis: ExecutiveKpiItem[] = [
    {
      id: "queue-count",
      label: "Approval Queue",
      value: String(approvalQueue.length),
      note: hasSubmission ? "New submission received from Commercial Workspace" : "Using temporary mock queue",
    },
    {
      id: "queue-institution",
      label: "Institution",
      value: selectedQueueItem.institutionName,
      note: "Originated from Relationship Manager workflow",
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
      outcome: "pending",
      decidedAt: `Submitted ${selectedQueueItem.submissionDate}`,
      lifecycleStatus: selectedQueueItem.currentStatus,
    },
  ];

  const approvalQueueAlerts: ExecutiveAlertItem[] = [
    {
      id: "alert-new-commercial-submission",
      category: "Approval Queue",
      message: `Submission ${selectedQueueItem.opportunityReference} is awaiting executive approval.`,
      severity: "medium",
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