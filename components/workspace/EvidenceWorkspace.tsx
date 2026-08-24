'use client';

import {
  ArrowRight,
  Building2,
  CheckSquare,
  FileCheck2,
  Files,
  Landmark,
  Link2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Timer,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type CategoryCard = {
  name: string;
  count: string;
  verified: string;
  pending: string;
};

type TimelineItem = {
  title: string;
  detail: string;
  time: string;
};

type VerificationMetric = {
  label: string;
  value: string;
};

type RelationshipItem = {
  label: string;
  value: string;
};

type RepositoryStatus = 'Verified' | 'Pending' | 'Rejected' | 'In Review';

type RepositoryRow = {
  evidenceId: string;
  category: string;
  description: string;
  source: string;
  owner: string;
  uploaded: string;
  verified: string;
  status: RepositoryStatus;
  confidence: string;
};

const headerMetrics = [
  { label: 'Facility', value: 'Invoice Discounting Programme' },
  { label: 'Deal', value: 'Crescent Receivables Growth Facility 2026' },
  { label: 'Evidence Collection Score', value: '84 / 100' },
  { label: 'Verified %', value: '72%' },
  { label: 'Pending %', value: '21%' },
  { label: 'Rejected %', value: '7%' },
] as const;

const evidenceCategories: readonly CategoryCard[] = [
  { name: 'Identity', count: '12', verified: '9', pending: '3' },
  { name: 'Corporate', count: '16', verified: '13', pending: '3' },
  { name: 'Financial', count: '18', verified: '12', pending: '6' },
  { name: 'Banking', count: '9', verified: '7', pending: '2' },
  { name: 'Trade', count: '14', verified: '10', pending: '4' },
  { name: 'Legal', count: '11', verified: '8', pending: '3' },
  { name: 'Collateral', count: '8', verified: '5', pending: '3' },
  { name: 'Insurance', count: '6', verified: '3', pending: '3' },
  { name: 'Compliance', count: '10', verified: '8', pending: '2' },
  { name: 'External Intelligence', count: '7', verified: '6', pending: '1' },
  { name: 'Operational', count: '13', verified: '10', pending: '3' },
] as const;

const evidenceTimeline: readonly TimelineItem[] = [
  {
    title: 'Uploaded',
    detail: 'New receivables schedule and obligor statements were added to the evidence room.',
    time: '08:10',
  },
  {
    title: 'Verified',
    detail: 'Operations validated invoice batch references and bank advice consistency.',
    time: '09:35',
  },
  {
    title: 'AI Tagged',
    detail: 'Classification engine tagged key parties, dates, amounts, and trade corridors.',
    time: '10:20',
  },
  {
    title: 'Cross Referenced',
    detail: 'Evidence set linked to supporting facility documents and historical submissions.',
    time: '11:40',
  },
  {
    title: 'Used in Decision',
    detail: 'Risk and credit teams referenced verified packs in approval commentary.',
    time: '13:05',
  },
  {
    title: 'Archived',
    detail: 'Superseded insurance attachment was moved into historical evidence storage.',
    time: '15:30',
  },
] as const;

const evidenceVerification: readonly VerificationMetric[] = [
  { label: 'Verifier', value: 'Amina Farouk' },
  { label: 'Verification Date', value: '07 Aug 2026' },
  { label: 'Confidence Score', value: '91%' },
  { label: 'AI Score', value: '88%' },
  { label: 'Source Reliability', value: 'High' },
  { label: 'Manual Review', value: 'Required for 3 items' },
] as const;

const evidenceRelationships: readonly RelationshipItem[] = [
  { label: 'Customer', value: 'Crescent Trade Holdings FZ-LLC' },
  { label: 'Facility', value: 'Invoice Discounting Programme' },
  { label: 'Deal', value: 'Crescent Receivables Growth Facility 2026' },
  { label: 'Collateral', value: 'Assigned receivables pool' },
  { label: 'Bank', value: 'Deepsea Treasury Desk' },
  { label: 'Document', value: 'Security and assignment pack' },
  { label: 'Risk Event', value: 'Insurance endorsement gap' },
] as const;

const intelligenceItems = [
  'Missing evidence',
  'Conflicts',
  'Duplicates',
  'Expired evidence',
  'Risk alerts',
] as const;

const repositoryRows: readonly RepositoryRow[] = [
  {
    evidenceId: 'EV-2026-0041',
    category: 'Financial',
    description: 'Audited FY2025 financial statements pack',
    source: 'Client CFO Office',
    owner: 'Credit Analytics',
    uploaded: '05 Aug 2026',
    verified: '06 Aug 2026',
    status: 'Verified',
    confidence: '94%',
  },
  {
    evidenceId: 'EV-2026-0048',
    category: 'Insurance',
    description: 'Marine cargo insurance endorsement',
    source: 'Broker Submission',
    owner: 'Operations Control',
    uploaded: '07 Aug 2026',
    verified: 'Pending',
    status: 'In Review',
    confidence: '77%',
  },
  {
    evidenceId: 'EV-2026-0052',
    category: 'KYC',
    description: 'Ultimate beneficial owner declaration bundle',
    source: 'Compliance Portal',
    owner: 'Compliance Desk',
    uploaded: '07 Aug 2026',
    verified: '07 Aug 2026',
    status: 'Pending',
    confidence: '82%',
  },
  {
    evidenceId: 'EV-2026-0059',
    category: 'Trade',
    description: 'Receivables ledger and buyer concentration report',
    source: 'ERP Export',
    owner: 'Relationship Team',
    uploaded: '06 Aug 2026',
    verified: '07 Aug 2026',
    status: 'Verified',
    confidence: '89%',
  },
  {
    evidenceId: 'EV-2026-0064',
    category: 'Corporate',
    description: 'Board resolution authorizing facility execution',
    source: 'Corporate Secretary',
    owner: 'Legal Review',
    uploaded: 'Pending',
    verified: 'Pending',
    status: 'Rejected',
    confidence: '42%',
  },
] as const;

const graphSummary = [
  { label: 'Total Evidence', value: '124' },
  { label: 'Verified', value: '89' },
  { label: 'Pending', value: '26' },
  { label: 'AI Generated Links', value: '214' },
  { label: 'Knowledge Nodes', value: '68' },
  { label: 'Institutional References', value: '47' },
] as const;

const repositoryToneMap: Record<RepositoryStatus, string> = {
  Verified: 'border-emerald-700/40 bg-emerald-900/25 text-emerald-100',
  Pending: 'border-cyan-700/40 bg-cyan-900/25 text-cyan-100',
  Rejected: 'border-amber-700/40 bg-amber-900/25 text-amber-100',
  'In Review': 'border-slate-700 bg-slate-900/70 text-slate-300',
};

export default function EvidenceWorkspace() {
  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Evidence Header</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Customer</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Crescent Trade Holdings FZ-LLC</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {headerMetrics.map((item) => (
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
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Collection Score</p>
                </div>
                <p className="text-sm font-semibold text-emerald-200">84 / 100</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Files className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Evidence Pack</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">Institutional Decision Set</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Review Window</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">Open</p>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
              >
                Upload Evidence
              </button>
              <button
                type="button"
                className="ml-3 inline-flex items-center justify-center rounded-full border border-slate-700/70 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-100"
              >
                Evidence Register
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <CheckSquare className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Evidence Categories</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {evidenceCategories.map((item) => (
            <article key={item.name} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.name}</p>
              <div className="mt-4 grid gap-2 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Count</span>
                  <span className="font-semibold text-slate-100">{item.count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Verified</span>
                  <span className="font-semibold text-slate-100">{item.verified}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Pending</span>
                  <span className="font-semibold text-slate-100">{item.pending}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Timer className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Evidence Timeline</h3>
        </div>

        <div className="space-y-3">
          {evidenceTimeline.map((item) => (
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
          <ShieldCheck className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Evidence Verification</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {evidenceVerification.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Link2 className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Evidence Relationships</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {evidenceRelationships.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Evidence linked to</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.label}</p>
              <p className="mt-2 text-sm text-slate-300">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Evidence Intelligence</h3>
        </div>

        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {intelligenceItems.map((item) => (
              <div key={item} className="rounded-lg border border-amber-700/40 bg-amber-900/20 p-3 text-sm font-semibold text-amber-100">
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <FileCheck2 className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Evidence Repository</h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900/70 text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Evidence ID</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Uploaded</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {repositoryRows.map((item) => (
                <tr key={item.evidenceId} className="hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-semibold text-slate-100">{item.evidenceId}</td>
                  <td className="px-4 py-3 text-slate-300">{item.category}</td>
                  <td className="px-4 py-3 text-slate-300">{item.description}</td>
                  <td className="px-4 py-3 text-slate-300">{item.source}</td>
                  <td className="px-4 py-3 text-slate-300">{item.owner}</td>
                  <td className="px-4 py-3 text-slate-300">{item.uploaded}</td>
                  <td className="px-4 py-3 text-slate-300">{item.verified}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${repositoryToneMap[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{item.confidence}</td>
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
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Evidence Graph Summary</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {graphSummary.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ShieldAlert className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Next Recommended Action</h3>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Institutional recommendation</p>
          <p className="mt-3 text-sm text-slate-300">
            Close the insurance evidence gap, replace the rejected board resolution pack, and complete manual verification on pending KYC
            submissions before continuing the investigation workflow.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
          >
            Continue Investigation
          </button>
        </article>
      </section>
    </WorkspaceShell>
  );
}
