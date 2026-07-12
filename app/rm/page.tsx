const KPI_CARDS = [
  {
    label: "Active Clients",
    value: "42",
    detail: "+5 this week",
  },
  {
    label: "Awaiting First Contact",
    value: "9",
    detail: "Needs outreach",
  },
  {
    label: "Meetings Today",
    value: "7",
    detail: "3 confirmed",
  },
  {
    label: "Funding Pipeline",
    value: "AED 24.8M",
    detail: "18 live cases",
  },
  {
    label: "Today's Priority",
    value: "4",
    detail: "High-touch clients",
  },
];

const TASKS = [
  {
    label: "Follow Ups",
    value: "12",
    detail: "Awaiting response after initial review",
  },
  {
    label: "Pending Documents",
    value: "8",
    detail: "Outstanding confirmations and statements",
  },
  {
    label: "Book Meetings",
    value: "5",
    detail: "High-priority relationships ready for outreach",
  },
  {
    label: "Notes",
    value: "3",
    detail: "Recent executive context requiring attention",
  },
];

export default function RelationshipManagerPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-8">
          <p className="text-sm font-medium tracking-[0.22em] text-cyan-700 uppercase">Relationship Manager Workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Good Morning, Sarah.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Today&apos;s Portfolio
          </p>
        </header>

        <section aria-labelledby="rm-kpis" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <h2 id="rm-kpis" className="sr-only">
            Relationship manager KPIs
          </h2>
          {KPI_CARDS.map((card) => (
            <article
              key={card.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-1"
              aria-label={card.label}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{card.value}</p>
              <p className="mt-2 text-sm text-slate-600">{card.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]" aria-label="Relationship details and guidance">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-cyan-700 uppercase">Relationship Card</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  ABC Trading LLC
                </h2>
              </div>
              <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Ready for outreach
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Business Intelligence Score</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">82%</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Funding Goal</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">AED 5M</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">Awaiting first contact</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Next Best Action</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">Schedule intro meeting</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Last Activity</p>
              <p className="mt-2 text-base leading-relaxed text-slate-700 sm:text-lg">
                Business understanding completed today. Funding requirement recorded and ready for relationship follow-up.
              </p>
            </div>
          </article>

          <aside className="rounded-3xl border border-slate-950 bg-slate-950 p-6 text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)] sm:p-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-300 uppercase">AI Relationship Coach</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Engagement guidance</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              The customer is warm and financially qualified. Lead with a concise relationship call, confirm the funding goal, and anchor the conversation around their next operational milestone. Keep the tone advisory, then move quickly to a meeting invite once the customer responds.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Coach note</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                Placeholder narrative only. No live AI or external services are used on this page.
              </p>
            </div>
          </aside>
        </section>

        <section aria-labelledby="task-panel" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-8">
          <p className="text-sm font-semibold tracking-[0.2em] text-cyan-700 uppercase">Task Panel</p>
          <h2 id="task-panel" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Focus areas for today
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {TASKS.map((task) => (
              <article
                key={task.label}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition-transform duration-200 hover:-translate-y-1"
                aria-label={task.label}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{task.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{task.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{task.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
