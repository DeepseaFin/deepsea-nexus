const EXECUTIVE_KPIS = [
  {
    label: "Businesses Onboarded",
    value: "128",
    detail: "+14 this week",
  },
  {
    label: "Funding Pipeline",
    value: "AED 86.4M",
    detail: "31 active opportunities",
  },
  {
    label: "Business Intelligence Score",
    value: "82%",
    detail: "Portfolio average",
  },
  {
    label: "Relationships Awaiting Contact",
    value: "19",
    detail: "Requires senior follow-up",
  },
  {
    label: "Today's Priority",
    value: "5",
    detail: "High-priority decisions",
  },
];

const QUICK_ACTIONS = [
  {
    title: "View New Businesses",
    description: "Review the latest onboarded businesses and their current readiness.",
  },
  {
    title: "Relationship Workspace",
    description: "Monitor relationship progress and upcoming engagement moments.",
  },
  {
    title: "Portfolio Overview",
    description: "Assess portfolio health, concentration, and opportunity distribution.",
  },
  {
    title: "Ask ATLAS",
    description: "Request an executive summary, risk note, or pipeline snapshot.",
  },
];

export default function ExecutivePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-8">
          <p className="text-sm font-medium tracking-[0.22em] text-cyan-700 uppercase">Executive Workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Good Morning, Deepak.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Today&apos;s Executive Brief
          </p>
        </header>

        <section aria-labelledby="executive-kpis" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <h2 id="executive-kpis" className="sr-only">
            Executive KPIs
          </h2>
          {EXECUTIVE_KPIS.map((item) => (
            <article
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1"
              aria-label={item.label}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]" aria-label="Executive briefing and quick actions">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-700 uppercase">AI Chief of Staff</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Executive Briefing
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-700 sm:text-lg">
              <p>
                The portfolio remains stable, with onboarding momentum above forecast and a healthy pipeline of funded opportunities moving through review.
              </p>
              <p>
                Three new businesses crossed the readiness threshold today, while the highest-value opportunity remains concentrated in the mid-market segment.
              </p>
              <p>
                Priority today is to contact the nineteen relationships awaiting outreach and convert the strongest funding cases before end-of-day review.
              </p>
            </div>
          </article>

          <aside className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)] sm:p-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-300 uppercase">Today&apos;s Priority</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Focus on relationship follow-up and funding conversion.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              Use the current intelligence score to guide which businesses receive immediate senior attention and which can progress through standard review.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Executive note</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                All figures on this page are placeholder data for the executive experience.
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
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.title}
                type="button"
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                aria-label={action.title}
              >
                <p className="text-lg font-semibold text-slate-950 sm:text-xl">{action.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{action.description}</p>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
