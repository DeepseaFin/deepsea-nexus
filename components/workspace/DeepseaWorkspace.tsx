'use client';

import {
  BellRing,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  FolderKanban,
  Sparkles,
} from 'lucide-react';
import ActivityTimeline from '@/components/atlas/design-system/ActivityTimeline';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

const continueWorking = [
  {
    name: 'Relationship One',
    stage: 'Stage One',
    nextAction: 'Continue the current review',
  },
  {
    name: 'Relationship Two',
    stage: 'Stage Two',
    nextAction: 'Advance the next decision',
  },
  {
    name: 'Relationship Three',
    stage: 'Stage Three',
    nextAction: 'Resume the active follow-up',
  },
] as const;

const workQueue = [
  'Pending Documents',
  'Credit Reviews',
  'Funding Releases',
  'Customer Follow-ups',
] as const;

const recommendations = [
  {
    reason: 'A placeholder insight is available for the workspace review.',
    suggestedAction: 'Open the next placeholder action',
  },
  {
    reason: 'Another placeholder insight is ready for consideration.',
    suggestedAction: 'Review the second placeholder action',
  },
  {
    reason: 'A final placeholder insight rounds out the sandbox.',
    suggestedAction: 'Inspect the third placeholder action',
  },
] as const;

const activity = [
  { institution: 'Institution Alpha', action: 'Placeholder activity entered', time: '10 min ago' },
  { institution: 'Institution Beta', action: 'Placeholder activity entered', time: '25 min ago' },
  { institution: 'Institution Gamma', action: 'Placeholder activity entered', time: '42 min ago' },
  { institution: 'Institution Delta', action: 'Placeholder activity entered', time: '1 hr ago' },
  { institution: 'Institution Epsilon', action: 'Placeholder activity entered', time: '2 hrs ago' },
] as const;

function formatDate(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
}

export default function DeepseaWorkspace() {
  const currentDate = formatDate();

  const businessHealth = [
    { label: 'Portfolio', value: '12' },
    { label: 'Pipeline', value: '8' },
    { label: 'Funding Today', value: '$6.2M' },
    { label: 'Collections Due', value: '$1.1M' },
  ] as const;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.11),_transparent_28%),linear-gradient(180deg,#020617_0%,#07111f_42%,#020617_100%)] text-slate-100">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-6 py-6 sm:px-8 lg:px-10">
        <header className="rounded-3xl border border-slate-800/80 bg-slate-950/72 px-6 py-6 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-sm sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Welcome</p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Good Morning, Deepak</h1>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Relationship Manager</p>
              <p className="flex items-center gap-2 text-sm text-slate-400">
                <CalendarDays className="h-4 w-4 text-cyan-300" />
                {currentDate}
              </p>
              <p className="max-w-2xl text-sm leading-6 text-slate-400">
                Placeholder workspace composition for future visual review and sandbox layout exploration.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Where am I?</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">Deepsea Workspace</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">What should I do?</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">Review the placeholder mission</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">What needs attention?</p>
                <p className="mt-2 text-sm font-semibold text-amber-200">Three sample work items</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">How healthy is the business?</p>
                <p className="mt-2 text-sm font-semibold text-emerald-200">Placeholder metrics</p>
              </div>
            </div>
          </div>
        </header>

        <SectionCard title="Today&apos;s Mission" icon={BellRing} badge={{ label: 'Sandbox', variant: 'warning' }}>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200/80">Today&apos;s Mission</p>
            <p className="mt-3 max-w-3xl text-lg font-semibold text-slate-50">
              Placeholder mission for the future workspace experience.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This area is reserved for a single, prominent attention-setting panel.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Continue Working" icon={BriefcaseBusiness} badge={{ label: '3 cards', variant: 'success' }}>
          <div className="grid gap-4 xl:grid-cols-3">
            {continueWorking.map((item) => (
              <article key={item.name} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Relationship Name</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-100">{item.name}</h3>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">Current Stage</p>
                <p className="mt-1 text-sm font-medium text-slate-200">{item.stage}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">Next Recommended Action</p>
                <p className="mt-1 text-sm text-slate-300">{item.nextAction}</p>
                <div className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-700/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                  Continue
                  <Sparkles className="ml-2 h-4 w-4" />
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Business Health" icon={BriefcaseBusiness} badge={{ label: 'Live', variant: 'info' }}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {businessHealth.map((item) => (
              <article key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-100">{item.value}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="My Work" icon={FolderKanban} badge={{ label: 'Queue', variant: 'default' }}>
          <div className="grid gap-3 lg:grid-cols-2">
            {workQueue.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-5 py-4"
              >
                <p className="text-sm font-semibold text-slate-100">{item}</p>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Open</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="AI Recommendations" icon={BrainCircuit} badge={{ label: '3 suggestions', variant: 'info' }}>
          <div className="grid gap-4 xl:grid-cols-3">
            {recommendations.map((item) => (
              <article key={item.suggestedAction} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Reason</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.reason}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">Suggested Action</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{item.suggestedAction}</p>
                <div className="mt-5 inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100">
                  Action Button
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity" icon={Clock3} badge={{ label: 'Latest five', variant: 'default' }}>
          <ActivityTimeline
            title="Placeholder Activity"
            events={activity.map((item) => ({
              time: item.time,
              title: item.institution,
              detail: item.action,
            }))}
          />
        </SectionCard>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-5 py-4 text-xs uppercase tracking-[0.18em] text-slate-500">
          Placeholder sandbox only. No business logic, routing, or backend dependencies.
        </div>
      </div>
    </div>
  );
}
