import type { BusinessDNA } from "@/lib/knowledge/businessDNA";
import type { KnowledgeAttribute } from "@/lib/knowledge/knowledgeAttribute";
import type { FundingAssessment } from "@/lib/business/fundingAssessmentService";
import type { RelationshipTimeline } from "@/lib/relationship/relationshipTimeline";
import { executiveWorkspaceAssembler } from "@/lib/workspaces/executiveWorkspaceAssembler";

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

export default function ExecutivePage() {
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
      </main>
    </div>
  );
}