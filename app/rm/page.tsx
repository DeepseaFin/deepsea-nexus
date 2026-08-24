import type { BusinessDNA } from "@/lib/knowledge/businessDNA";
import type { KnowledgeAttribute } from "@/lib/knowledge/knowledgeAttribute";
import type { FundingAssessment } from "@/lib/business/fundingAssessmentService";
import type { RelationshipTimeline } from "@/lib/relationship/relationshipTimeline";
import { relationshipWorkspaceAssembler } from "@/lib/workspaces/relationshipWorkspaceAssembler";

function attribute<T>(value: T, source: string, confidence = 92, updatedAt = "2026-07-12T09:00:00Z"): KnowledgeAttribute<T> {
  return {
    value,
    source,
    confidence,
    updatedAt,
  };
}

const businessDNA: BusinessDNA = {
  identity: {
    legalName: attribute("ABC Trading LLC", "customer upload"),
    tradingName: attribute("ABC Trading", "customer upload", 88),
    entityType: attribute("Trading Company", "customer upload"),
    registrationNumber: attribute("CC-784512", "customer upload", 86),
    incorporationDate: attribute("2018-05-17", "customer upload", 84),
    jurisdiction: attribute("Dubai, UAE", "customer upload"),
    website: attribute("abctrading.ae", "customer upload", 78),
    headquartersLocation: attribute("Jebel Ali Free Zone", "customer upload", 83),
  },
  business: {
    industry: attribute("Wholesale Distribution", "document analysis"),
    businessModel: attribute("B2B trade distribution", "document analysis"),
    productsServices: attribute(["Consumer goods", "Import distribution", "Repeat wholesale supply"], "document analysis"),
    customerSegments: attribute(["Retail networks", "Hospitality operators", "Regional resellers"], "document analysis"),
    operatingMarkets: attribute(["UAE", "GCC"], "document analysis"),
    employeeCount: attribute(48, "document analysis", 90),
    operatingRegions: attribute(["Dubai", "Abu Dhabi", "Sharjah"], "document analysis"),
  },
  financial: {
    revenueRange: attribute("AED 20M - AED 30M", "financial review"),
    monthlyTurnover: attribute("AED 2.1M", "financial review"),
    profitability: attribute("Stable margin profile", "financial review"),
    fundingNeed: attribute("AED 5M", "customer discussion"),
    preferredFacility: attribute("Invoice Financing", "customer discussion"),
    bankAccountCountry: attribute("UAE", "financial review"),
    cashFlowProfile: attribute("Working capital gap during receivables cycle", "financial review"),
  },
  behaviour: {
    paymentBehaviour: attribute("Pays suppliers on standard terms", "historical banking data"),
    invoicingBehaviour: attribute("Invoices issued weekly with predictable settlement", "document analysis"),
    seasonality: attribute("Mild Q4 uplift", "seasonality model"),
    growthTrend: attribute("Moderate upward trend", "trend model"),
    riskSignals: attribute(["Concentrated receivables", "Short-term liquidity pressure"], "risk model"),
    operationalDiscipline: attribute("Well documented and repeatable", "relationship review"),
  },
  relationship: {
    relationshipOwner: attribute("Sarah Ahmed", "relationship team"),
    relationshipStage: attribute("Awaiting First Contact", "relationship team"),
    referralSource: attribute("Inbound business assessment", "relationship team"),
    engagementLevel: attribute("Warm", "relationship team"),
    responsiveness: attribute("Responsive", "relationship team"),
    trustLevel: attribute("Building", "relationship team"),
  },
  intelligence: {
    profileCompleteness: attribute(84, "atlas scoring"),
    documentCoverage: attribute(78, "atlas scoring"),
    dataFreshness: attribute("Today", "atlas scoring"),
    overallConfidence: attribute(82, "atlas scoring"),
    nextBestAction: attribute("Schedule intro meeting and confirm funding use case", "atlas scoring"),
    insightSummary: attribute("Strong distribution profile with a near-term funding opportunity and clear relationship follow-up path.", "atlas scoring"),
  },
};

const fundingAssessment: FundingAssessment = {
  recommendedFacility: "Invoice Financing",
  confidence: 82,
  advanceRate: "75%",
  riskLevel: "MEDIUM",
  turnaround: "3-5 business days",
  recommendation:
    "Proceed with Invoice Financing for AED 5M with phased utilization and invoice verification to maintain an indicative 75% advance rate.",
};

const relationshipTimeline: RelationshipTimeline = {
  businessId: "abc-trading-llc",
  events: [
    {
      id: "profile-created",
      occurredAt: "2026-07-12T08:30:00Z",
      category: "Intake",
      title: "Business Profile Created",
      description: "Core business identity and operating details have been captured.",
      confidence: 92,
      source: "business understanding",
    },
    {
      id: "funding-recorded",
      occurredAt: "2026-07-12T08:45:00Z",
      category: "Funding",
      title: "Funding Requirement Recorded",
      description: "A funding goal of AED 5M has been recorded with a matched facility recommendation.",
      confidence: 90,
      source: "funding assessment",
    },
    {
      id: "relationship-review",
      occurredAt: "2026-07-12T09:00:00Z",
      category: "Relationship",
      title: "Relationship Manager Review",
      description: "The customer is ready for a relationship-led follow-up and meeting invitation.",
      confidence: 88,
      source: "relationship workspace",
    },
  ],
};

const relationshipWorkspaceViewModel = relationshipWorkspaceAssembler.build(businessDNA, fundingAssessment, relationshipTimeline);

export default function RelationshipManagerPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-8">
          <p className="text-sm font-medium tracking-[0.22em] text-cyan-700 uppercase">Relationship Manager Workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {relationshipWorkspaceViewModel.greeting}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            {relationshipWorkspaceViewModel.title}
          </p>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {relationshipWorkspaceViewModel.subtitle}
          </p>
        </header>

        <section aria-labelledby="rm-portfolio" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <h2 id="rm-portfolio" className="sr-only">
            Relationship manager portfolio summary
          </h2>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1" aria-label="Active Clients">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Active Clients</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {relationshipWorkspaceViewModel.portfolioSummary.activeClients}
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1" aria-label="Awaiting First Contact">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Awaiting First Contact</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {relationshipWorkspaceViewModel.portfolioSummary.awaitingFirstContact}
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1" aria-label="Meetings Today">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Meetings Today</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {relationshipWorkspaceViewModel.portfolioSummary.meetingsToday}
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1" aria-label="Funding Pipeline">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Funding Pipeline</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {relationshipWorkspaceViewModel.portfolioSummary.fundingPipeline}
            </p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1" aria-label="Today's Priority">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Today&apos;s Priority</p>
            <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
              {relationshipWorkspaceViewModel.portfolioSummary.todaysPriority}
            </p>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]" aria-label="Relationship details and guidance">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-cyan-700 uppercase">Relationship Cards</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {relationshipWorkspaceViewModel.relationshipCard.companyName}
                </h2>
              </div>
              <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                {relationshipWorkspaceViewModel.relationshipCard.status}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Business Intelligence Score</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {relationshipWorkspaceViewModel.relationshipCard.businessIntelligenceScore}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Funding Goal</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {relationshipWorkspaceViewModel.relationshipCard.fundingGoal}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Next Best Action</p>
                <p className="mt-2 text-base font-semibold leading-relaxed text-slate-950">
                  {relationshipWorkspaceViewModel.relationshipCard.nextBestAction}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Last Activity</p>
                <p className="mt-2 text-base font-semibold leading-relaxed text-slate-950">
                  {relationshipWorkspaceViewModel.relationshipCard.lastActivity}
                </p>
              </div>
            </div>
          </article>

          <aside className="rounded-3xl border border-slate-950 bg-slate-950 p-6 text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)] sm:p-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-300 uppercase">
              {relationshipWorkspaceViewModel.aiRelationshipCoach.title}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Engagement guidance</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              {relationshipWorkspaceViewModel.aiRelationshipCoach.narrative}
            </p>
          </aside>
        </section>

        <section aria-labelledby="task-panel" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
          <p className="text-sm font-semibold tracking-[0.2em] text-cyan-700 uppercase">Task Panel</p>
          <h2 id="task-panel" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {relationshipWorkspaceViewModel.taskPanel.title}
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relationshipWorkspaceViewModel.taskPanel.tasks.map((task) => (
              <article
                key={task.label}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-transform duration-200 hover:-translate-y-1"
                aria-label={task.label}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{task.label}</p>
                {typeof task.value === "string" && <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{task.value}</p>}
                {task.status && <p className="mt-3 text-sm font-semibold text-cyan-700">{task.status}</p>}
                {task.detail && <p className="mt-2 text-sm leading-relaxed text-slate-600">{task.detail}</p>}
              </article>
            ))}
          </div>

          {relationshipWorkspaceViewModel.actions && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {relationshipWorkspaceViewModel.actions.map((action) => (
                <article
                  key={action.label}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  aria-label={action.label}
                >
                  <p className="text-sm font-semibold text-slate-950 sm:text-base">{action.label}</p>
                  {action.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{action.description}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}