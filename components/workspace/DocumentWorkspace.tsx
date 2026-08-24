'use client';

import {
  ArrowRight,
  Building2,
  CheckSquare,
  FileCheck2,
  Files,
  Landmark,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Timer,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type CategoryStatus = 'On Track' | 'In Review' | 'Attention';
type MatrixStatus = 'Draft' | 'Uploaded' | 'Verified' | 'Legal Review' | 'Credit Review' | 'Approved';

type CategoryCard = {
  name: string;
  completion: string;
  status: CategoryStatus;
};

type MatrixRow = {
  document: string;
  category: string;
  owner: string;
  version: string;
  status: MatrixStatus;
  expiry: string;
  lastUpdated: string;
};

type TimelineItem = {
  title: string;
  detail: string;
  time: string;
};

const headerMetrics = [
  { label: 'Customer', value: 'Crescent Trade Holdings FZ-LLC' },
  { label: 'Facility', value: 'Invoice Discounting Programme' },
  { label: 'Deal', value: 'Crescent Receivables Growth Facility 2026' },
  { label: 'Document Set', value: 'Execution and Compliance Pack' },
  { label: 'Completion %', value: '83%' },
] as const;

const healthCards = [
  { label: 'Required', value: '24' },
  { label: 'Received', value: '20' },
  { label: 'Verified', value: '16' },
  { label: 'Pending Review', value: '4' },
  { label: 'Expired', value: '1' },
  { label: 'Rejected', value: '0' },
] as const;

const categories: readonly CategoryCard[] = [
  { name: 'Corporate Documents', completion: '100%', status: 'On Track' },
  { name: 'Financial Statements', completion: '75%', status: 'In Review' },
  { name: 'KYC', completion: '67%', status: 'Attention' },
  { name: 'Legal', completion: '88%', status: 'In Review' },
  { name: 'Security', completion: '72%', status: 'Attention' },
  { name: 'Insurance', completion: '50%', status: 'Attention' },
  { name: 'Facility Documents', completion: '92%', status: 'On Track' },
];

const matrixRows: readonly MatrixRow[] = [
  {
    document: 'Certificate of Incorporation',
    category: 'Corporate Documents',
    owner: 'RM Office',
    version: 'v3.0',
    status: 'Approved',
    expiry: 'N/A',
    lastUpdated: '04 Aug 2026',
  },
  {
    document: 'Board Resolution',
    category: 'Corporate Documents',
    owner: 'Client CFO',
    version: 'v1.2',
    status: 'Uploaded',
    expiry: '30 Sep 2026',
    lastUpdated: '06 Aug 2026',
  },
  {
    document: 'Audited Financial Statements FY2025',
    category: 'Financial Statements',
    owner: 'Finance Team',
    version: 'v2.1',
    status: 'Credit Review',
    expiry: '31 Dec 2026',
    lastUpdated: '05 Aug 2026',
  },
  {
    document: 'Ultimate Beneficial Owner Declaration',
    category: 'KYC',
    owner: 'Compliance Desk',
    version: 'v1.0',
    status: 'Legal Review',
    expiry: '15 Oct 2026',
    lastUpdated: '07 Aug 2026',
  },
  {
    document: 'Insurance Endorsement',
    category: 'Insurance',
    owner: 'Operations',
    version: 'v0.9',
    status: 'Draft',
    expiry: '18 Aug 2026',
    lastUpdated: '07 Aug 2026',
  },
  {
    document: 'Assignment Notice Pack',
    category: 'Security',
    owner: 'Legal',
    version: 'v2.4',
    status: 'Verified',
    expiry: 'N/A',
    lastUpdated: '03 Aug 2026',
  },
] as const;

const reviewStages = ['Draft', 'Uploaded', 'Verified', 'Legal Review', 'Credit Review', 'Approved', 'Archived'] as const;
const activeReviewStage = 'Credit Review';

const timeline: readonly TimelineItem[] = [
  {
    title: 'Financial pack uploaded',
    detail: 'Latest audited statements and management accounts were added to the deal room.',
    time: '08:20',
  },
  {
    title: 'KYC review initiated',
    detail: 'Compliance team began validation of refreshed shareholder and UBO documentation.',
    time: '09:45',
  },
  {
    title: 'Legal review completed for assignment pack',
    detail: 'Security document package passed legal review and moved to verified state.',
    time: '11:10',
  },
  {
    title: 'Insurance document flagged',
    detail: 'Insurance endorsement remains incomplete and requires updated coverage evidence.',
    time: '13:30',
  },
] as const;

const complianceSummary = [
  { label: 'Missing Documents', value: '4' },
  { label: 'Documents Expiring Soon', value: '2' },
  { label: 'Critical Items', value: '3' },
  { label: 'Compliance Score', value: '81 / 100' },
] as const;

const aiObservations = [
  'Missing KYC',
  'Expired Insurance',
  'Board Resolution Missing',
  'Latest Financials Required',
] as const;

const categoryToneMap: Record<CategoryStatus, string> = {
  'On Track': 'border-emerald-700/40 bg-emerald-900/25 text-emerald-100',
  'In Review': 'border-amber-700/40 bg-amber-900/25 text-amber-100',
  Attention: 'border-cyan-700/40 bg-cyan-900/25 text-cyan-100',
};

const matrixToneMap: Record<MatrixStatus, string> = {
  Draft: 'border-slate-700 bg-slate-900/70 text-slate-300',
  Uploaded: 'border-cyan-700/40 bg-cyan-900/25 text-cyan-100',
  Verified: 'border-emerald-700/40 bg-emerald-900/25 text-emerald-100',
  'Legal Review': 'border-amber-700/40 bg-amber-900/25 text-amber-100',
  'Credit Review': 'border-amber-700/40 bg-amber-900/25 text-amber-100',
  Approved: 'border-emerald-700/40 bg-emerald-900/25 text-emerald-100',
};

export default function DocumentWorkspace() {
  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Document Header</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Customer</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Crescent Trade Holdings FZ-LLC</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {headerMetrics.slice(1).map((item) => (
                <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Files className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Document Set</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">Execution and Compliance Pack</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Completion</p>
                </div>
                <p className="text-sm font-semibold text-emerald-200">83%</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Review Window</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">Active</p>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
              >
                Upload Documents
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Document Health</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {healthCards.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <CheckSquare className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Document Categories</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((item) => (
            <article key={item.name} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.name}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-slate-500">Completion %</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{item.completion}</p>
              <span className={`mt-4 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${categoryToneMap[item.status]}`}>
                {item.status}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <FileCheck2 className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Document Matrix</h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900/70 text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Last Updated</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {matrixRows.map((item) => (
                <tr key={item.document} className="hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-semibold text-slate-100">{item.document}</td>
                  <td className="px-4 py-3 text-slate-300">{item.category}</td>
                  <td className="px-4 py-3 text-slate-300">{item.owner}</td>
                  <td className="px-4 py-3 text-slate-300">{item.version}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${matrixToneMap[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{item.expiry}</td>
                  <td className="px-4 py-3 text-slate-300">{item.lastUpdated}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100"
                    >
                      Continue <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ArrowRight className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Review Pipeline</h3>
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-max items-center gap-2">
            {reviewStages.map((stage, index) => {
              const isActive = stage === activeReviewStage;
              const isLast = index === reviewStages.length - 1;
              const isComplete = reviewStages.indexOf(stage) < reviewStages.indexOf(activeReviewStage);

              return (
                <div key={stage} className="flex items-center gap-2">
                  <div
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                      isActive
                        ? 'border-cyan-600/60 bg-cyan-900/40 text-cyan-100'
                        : isComplete
                          ? 'border-emerald-700/40 bg-emerald-900/25 text-emerald-100'
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
          <Timer className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Document Timeline</h3>
        </div>

        <div className="space-y-3">
          {timeline.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.time}</p>
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ShieldAlert className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Compliance Summary</h3>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {complianceSummary.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">AI Observations</h3>
        </div>

        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {aiObservations.map((item) => (
              <div key={item} className="rounded-lg border border-amber-700/40 bg-amber-900/20 p-3 text-sm font-semibold text-amber-100">
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Next Action</h3>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Prioritize compliance closure</p>
          <p className="mt-3 text-sm text-slate-300">
            Upload refreshed insurance evidence, provide the signed board resolution, and complete UBO verification to lift the document
            pack into final approval readiness.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
          >
            Continue Review
          </button>
        </article>
      </section>
    </WorkspaceShell>
  );
}
