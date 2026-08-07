'use client';

import {
  ArrowRight,
  Building2,
  CircleCheck,
  FileCheck2,
  Landmark,
  ShieldCheck,
  Timer,
  Users,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type PipelineStage = {
  label: string;
  active?: boolean;
  complete?: boolean;
};

type ConditionsItem = {
  label: string;
  status: 'Pending' | 'Completed' | 'In Review';
};

type TeamItem = {
  team: string;
  owner: string;
};

type TimelineItem = {
  time: string;
  title: string;
  detail: string;
};

const pipelineStages: readonly PipelineStage[] = [
  { label: 'Credit', complete: true },
  { label: 'Legal', complete: true },
  { label: 'Documentation', complete: true },
  { label: 'Conditions Precedent', active: true },
  { label: 'Treasury', complete: false },
  { label: 'Funding', complete: false },
  { label: 'Completed', complete: false },
];

const conditionsPrecedent: readonly ConditionsItem[] = [
  { label: 'Signed Agreement', status: 'Completed' },
  { label: 'Board Resolution', status: 'Completed' },
  { label: 'KYC Complete', status: 'Completed' },
  { label: 'Insurance', status: 'In Review' },
  { label: 'Security Creation', status: 'Pending' },
  { label: 'Legal Opinion', status: 'Pending' },
];

const responsibleTeams: readonly TeamItem[] = [
  { team: 'Credit', owner: 'Meera Nair' },
  { team: 'Legal', owner: 'Adeel Rahman' },
  { team: 'Operations', owner: 'Sofia Khan' },
  { team: 'Treasury', owner: 'Omar Hassan' },
  { team: 'Relationship Manager', owner: 'Deepak Singh' },
];

const executionTimeline: readonly TimelineItem[] = [
  {
    time: '08:30',
    title: 'Execution opened',
    detail: 'Deal entered execution queue after final approval and funding instruction release.',
  },
  {
    time: '10:15',
    title: 'Documentation review complete',
    detail: 'Legal and operations confirmed consistency across final agreement pack.',
  },
  {
    time: '12:00',
    title: 'Conditions precedent reviewed',
    detail: 'Security creation and external opinion remain under final validation.',
  },
  {
    time: '14:00',
    title: 'Treasury slot reserved',
    detail: 'Funding window booked subject to completion of remaining CP items.',
  },
] as const;

const fundingReadiness = [
  { label: 'Amount Ready', value: 'USD 10.0 Million' },
  { label: 'Conditions Remaining', value: '2' },
  { label: 'Expected Funding Date', value: '22 Aug 2026' },
  { label: 'Treasury Status', value: 'Queued' },
] as const;

const documentSummary = [
  { label: 'Required Documents', value: '18' },
  { label: 'Received', value: '15' },
  { label: 'Verified', value: '12' },
  { label: 'Missing', value: '3' },
  { label: 'Rejected', value: '0' },
] as const;

const statusToneMap: Record<ConditionsItem['status'], string> = {
  Pending: 'border-slate-700 bg-slate-900/70 text-slate-300',
  Completed: 'border-emerald-700/40 bg-emerald-900/25 text-emerald-100',
  'In Review': 'border-amber-700/40 bg-amber-900/25 text-amber-100',
};

export default function ExecutionWorkspace() {
  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Execution Header</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Customer</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Crescent Trade Holdings FZ-LLC</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Deal</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">Crescent Receivables Growth Facility 2026</p>
              </article>
              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Facility</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">Invoice Discounting Programme</p>
              </article>
              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Funding Amount</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">USD 10.0 Million</p>
              </article>
              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Current Stage</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">Conditions Precedent</p>
              </article>
              <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Execution Status</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">In Execution</p>
              </article>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Funding Amount</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">USD 10.0 Million</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Execution Status</p>
                </div>
                <p className="text-sm font-semibold text-emerald-200">On Track</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Treasury Window</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">Reserved</p>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
              >
                Continue Execution
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ArrowRight className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Execution Pipeline</h3>
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-max items-center gap-2">
            {pipelineStages.map((stage, index) => {
              const isActive = Boolean(stage.active);
              const isComplete = Boolean(stage.complete) || isActive;
              const isLast = index === pipelineStages.length - 1;

              return (
                <div key={stage.label} className="flex items-center gap-2">
                  <div
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                      isActive
                        ? 'border-cyan-600/60 bg-cyan-900/40 text-cyan-100'
                        : isComplete
                          ? 'border-emerald-700/40 bg-emerald-900/25 text-emerald-100'
                          : 'border-slate-700 bg-slate-900/70 text-slate-300'
                    }`}
                  >
                    {stage.label}
                  </div>
                  {!isLast ? <div className="h-px w-8 bg-slate-700" /> : null}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Credit</span>
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Legal</span>
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Documentation</span>
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Conditions Precedent</span>
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Treasury</span>
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Funding</span>
            <ArrowRight className="h-3.5 w-3.5" />
            <span>Completed</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <CircleCheck className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Conditions Precedent</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {conditionsPrecedent.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-100">{item.label}</p>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusToneMap[item.status]}`}>
                  {item.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <FileCheck2 className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Document Status</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {documentSummary.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Users className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Responsible Teams</h3>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {responsibleTeams.map((item) => (
            <article key={item.team} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.team}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.owner}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Building2 className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Execution Timeline</h3>
        </div>

        <div className="space-y-3">
          {executionTimeline.map((item) => (
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
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Funding Readiness</h3>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {fundingReadiness.map((item) => (
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
          <ShieldCheck className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Next Action</h3>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Funding readiness is close to completion</p>
          <p className="mt-3 text-sm text-slate-300">
            Finalize security creation, complete outstanding insurance evidence, and confirm treasury release instructions to proceed
            with funding.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
          >
            Continue Execution
          </button>
        </article>
      </section>
    </WorkspaceShell>
  );
}
