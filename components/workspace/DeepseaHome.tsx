'use client';

import { CalendarDays, Check, FileText, FileUp, HandCoins, MessageCircle, Search, UserPlus } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

const quickActions = [
  {
    title: 'New Relationship',
    description: 'Start onboarding a new institutional client.',
    icon: UserPlus,
  },
  {
    title: 'New Financing',
    description: 'Create a new financing opportunity.',
    icon: HandCoins,
  },
  {
    title: 'Upload Documents',
    description: 'Add customer documents for review.',
    icon: FileUp,
  },
  {
    title: 'Search Platform',
    description: 'Find customers, facilities or documents.',
    icon: Search,
  },
] as const;

const recentWork = [
  {
    customer: 'Crescent Trade Holdings',
    workstream: 'Trade Finance Renewal',
    lastOpened: '2 hours ago',
    status: 'Awaiting Credit Approval',
  },
  {
    customer: 'Blue Ocean Limited',
    workstream: 'Document Review',
    lastOpened: 'Yesterday',
    status: 'In Progress',
  },
  {
    customer: 'ABC Manufacturing',
    workstream: 'Funding Release',
    lastOpened: 'Yesterday',
    status: 'Pending Release Confirmation',
  },
] as const;

const summaryCards = [
  { value: '3', title: 'Relationships', note: 'Need attention' },
  { value: '2', title: 'Credit Decisions', note: 'Awaiting approval' },
  { value: '1', title: 'Funding Release', note: 'Scheduled today' },
  { value: '4', title: 'Documents', note: 'Need review' },
] as const;

const whatsNewToday = [
  {
    icon: FileUp,
    title: 'New KYC documents received',
    detail: 'Crescent Trade Holdings uploaded two compliance documents.',
    time: '12 minutes ago',
  },
  {
    icon: Check,
    title: 'Credit approval requested',
    detail: 'Blue Ocean Limited is awaiting your decision.',
    time: '35 minutes ago',
  },
  {
    icon: MessageCircle,
    title: 'Client message',
    detail: 'ABC Manufacturing replied to your facility proposal.',
    time: '1 hour ago',
  },
  {
    icon: HandCoins,
    title: 'Funding scheduled',
    detail: 'USD 2.4 Million scheduled for release today.',
    time: 'Today 4:00 PM',
  },
  {
    icon: FileText,
    title: 'Legal review completed',
    detail: 'Trade Finance Agreement ready for signature.',
    time: 'Today',
  },
] as const;

export default function DeepseaHome() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 py-10 sm:px-8 lg:gap-12 lg:px-10">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Greeting</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Good Morning, Deepak</h1>
          <p className="mt-4 text-base text-slate-200">Welcome back.</p>
          <p className="mt-2 text-sm text-slate-400">Here is everything requiring your attention today.</p>

          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-800/80 pt-5">
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-300">
              Relationship Manager
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-300">
              <CalendarDays className="h-3.5 w-3.5 text-cyan-300" />
              Tuesday, August 3
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-300">
              Institutional Financing
            </span>
          </div>
        </section>

        <SectionCard title="Recommended Next Action" iconKey="sparkles">
          <div className="rounded-3xl border border-cyan-600/35 bg-[linear-gradient(180deg,rgba(8,47,73,0.92),rgba(2,6,23,0.98))] p-8 shadow-[0_26px_60px_rgba(8,47,73,0.42)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">Recommended Next Action</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Crescent Trade Holdings</h2>
            <p className="mt-2 text-lg text-slate-200">Trade Finance Renewal</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-700/70 bg-slate-950/50 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Relationship Status</p>
                <p className="mt-2 text-lg font-semibold text-emerald-200">Healthy</p>
              </div>
              <div className="rounded-xl border border-slate-700/70 bg-slate-950/50 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Facility</p>
                <p className="mt-2 text-lg font-semibold text-slate-100">USD 6.2 Million</p>
              </div>
              <div className="rounded-xl border border-slate-700/70 bg-slate-950/50 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Pending Items</p>
                <p className="mt-2 text-lg font-semibold text-slate-100">2</p>
              </div>
            </div>

            <button
              type="button"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-7 py-3 text-sm font-semibold text-cyan-50"
            >
              Continue Working &rarr;
            </button>
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-slate-400">Last activity 2 hours ago</p>
          </div>
        </SectionCard>

        <SectionCard title="What&apos;s New Today" iconKey="bell-ring">
          <p className="text-sm text-slate-400">Changes requiring your attention since your last session.</p>

          <div className="mt-5 divide-y divide-slate-800 border-t border-slate-800/80">
            {whatsNewToday.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="flex items-start gap-3 py-4">
                  <div className="mt-0.5 rounded-lg border border-slate-800 bg-slate-900/60 p-1.5">
                    <Icon className="h-4 w-4 text-slate-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                  </div>
                  <p className="whitespace-nowrap text-xs text-slate-500">{item.time}</p>
                </article>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Today&apos;s Summary" iconKey="bell-ring">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
                <p className="text-2xl font-semibold leading-none text-slate-100">{item.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.note}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions" iconKey="folder-kanban">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  type="button"
                  className="flex min-h-[136px] w-full flex-col items-start justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-5 text-left transition hover:border-cyan-700/45 hover:bg-slate-900/70"
                >
                  <Icon className="h-5 w-5 text-cyan-300" />
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Continue Where You Left Off" iconKey="folder-kanban">
          <div className="grid gap-4 lg:grid-cols-3">
            {recentWork.map((item) => (
              <article key={item.customer} className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                <h3 className="text-lg font-semibold text-slate-100">{item.customer}</h3>
                <p className="mt-1 text-sm text-slate-300">{item.workstream}</p>

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Last opened</p>
                    <p className="mt-1 text-sm text-slate-300">{item.lastOpened}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Status</p>
                    <p className="mt-1 text-sm text-slate-300">{item.status}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 inline-flex items-center justify-center rounded-full border border-cyan-700/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-500/60 hover:bg-cyan-500/15"
                >
                  Resume &rarr;
                </button>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
