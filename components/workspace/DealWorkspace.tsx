'use client';

import {
  Building2,
  CheckSquare,
  CircleDollarSign,
  Gauge,
  Landmark,
  Timer,
  TrendingUp,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type Stage = 'Origination' | 'Credit Review' | 'Committee' | 'Documentation' | 'Funding' | 'Monitoring';

type TimelineItem = {
  title: string;
  detail: string;
  date: string;
};

const currentStage: Stage = 'Committee';

const stages: readonly Stage[] = ['Origination', 'Credit Review', 'Committee', 'Documentation', 'Funding', 'Monitoring'];

const headerDetails = [
  { label: 'Customer', value: 'Crescent Trade Holdings FZ-LLC' },
  { label: 'Facility', value: 'Invoice Discounting Programme' },
  { label: 'Product Type', value: 'Receivables Finance' },
  { label: 'Deal Owner', value: 'Deepak Singh' },
  { label: 'Current Stage', value: 'Committee' },
  { label: 'Status', value: 'In Progress' },
] as const;

const headerKpis = [
  { label: 'Requested Amount', value: 'USD 12.0 Million' },
  { label: 'Approved Amount', value: 'USD 10.0 Million' },
  { label: 'Outstanding', value: 'USD 8.4 Million' },
  { label: 'Expected Yield', value: '6.2% p.a.' },
] as const;

const dealSummary = [
  { label: 'Requested Amount', value: 'USD 12.0 Million' },
  { label: 'Approved Amount', value: 'USD 10.0 Million' },
  { label: 'Tenor', value: '12 Months' },
  { label: 'Pricing', value: 'SOFR + 390 bps' },
  { label: 'Security Value', value: 'USD 15.4 Million' },
  { label: 'Expected Yield', value: '6.2% p.a.' },
] as const;

const creditSnapshot = [
  { label: 'Internal Rating', value: 'A-' },
  { label: 'Probability of Default', value: '2.1%' },
  { label: 'LGD', value: '34%' },
  { label: 'Risk Grade', value: 'RG-3' },
  { label: 'Committee Date', value: '18 Aug 2026' },
] as const;

const timeline: readonly TimelineItem[] = [
  {
    title: 'Relationship Approved',
    detail: 'Relationship sponsorship and initial mandate completed by coverage team.',
    date: '03 Aug 2026',
  },
  {
    title: 'Financial Analysis Completed',
    detail: 'Cash flow, obligor concentration, and receivables aging checks completed.',
    date: '05 Aug 2026',
  },
  {
    title: 'Credit Memo Generated',
    detail: 'Draft memo prepared with risk recommendation and structuring terms.',
    date: '06 Aug 2026',
  },
  {
    title: 'Committee Scheduled',
    detail: 'Credit committee session confirmed with voting members.',
    date: '18 Aug 2026',
  },
  {
    title: 'Legal Documentation',
    detail: 'Facility agreement and assignment notices in legal finalization queue.',
    date: '19 Aug 2026',
  },
  {
    title: 'Funding Release',
    detail: 'Treasury release planned upon document execution and condition precedent closure.',
    date: '21 Aug 2026',
  },
] as const;

const documentChecklist = {
  required: [
    'Audited financial statements (FY2025)',
    'Receivables aging report (latest quarter)',
    'Trade contracts and invoices sample set',
    'Board resolution for facility authorization',
  ],
  pending: [
    'Final insurance endorsement copy',
    'Updated legal opinion for assignment structure',
    'Sanctions screening refresh certificate',
  ],
  signed: [
    'Term sheet',
    'KYC and onboarding declaration',
    'Pricing acceptance letter',
  ],
} as const;

export default function DealWorkspace() {
  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Deal Header</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Deal Name</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Crescent Receivables Growth Facility 2026</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {headerDetails.map((item) => (
                <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            {headerKpis.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
                <p className="text-sm font-semibold text-slate-100">{item.value}</p>
              </div>
            ))}

            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
              >
                Continue Deal
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <CircleDollarSign className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Deal Summary</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {dealSummary.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <TrendingUp className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Workflow Progress</h3>
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-max items-center gap-2">
            {stages.map((stage, index) => {
              const isCurrent = stage === currentStage;
              const isLast = index === stages.length - 1;
              return (
                <div key={stage} className="flex items-center gap-2">
                  <div
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                      isCurrent
                        ? 'border-cyan-600/60 bg-cyan-900/40 text-cyan-100'
                        : 'border-slate-700 bg-slate-900/70 text-slate-300'
                    }`}
                  >
                    {stage}
                  </div>
                  {!isLast ? <div className="h-px w-8 bg-slate-700" /> : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Gauge className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Credit Snapshot</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {creditSnapshot.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Timer className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Deal Timeline</h3>
        </div>

        <div className="space-y-3">
          {timeline.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.date}</p>
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <CheckSquare className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Document Checklist</h3>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Required Documents</p>
            <ul className="mt-3 space-y-2">
              {documentChecklist.required.map((doc) => (
                <li key={doc} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-200">
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Pending Documents</p>
            <ul className="mt-3 space-y-2">
              {documentChecklist.pending.map((doc) => (
                <li key={doc} className="rounded-lg border border-amber-700/40 bg-amber-900/20 px-3 py-2 text-sm text-amber-100">
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Signed Documents</p>
            <ul className="mt-3 space-y-2">
              {documentChecklist.signed.map((doc) => (
                <li key={doc} className="rounded-lg border border-emerald-700/40 bg-emerald-900/20 px-3 py-2 text-sm text-emerald-100">
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Next Action</h3>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Finalize Credit Memo</p>
          <p className="mt-3 text-sm text-slate-300">
            Committee review is scheduled and the draft memo is 80% complete. Finalize covenant language and stress-case commentary before
            submission cutoff.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
          >
            Continue Credit Review
          </button>
        </article>
      </section>
    </WorkspaceShell>
  );
}
