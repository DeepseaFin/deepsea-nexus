'use client';

import {
  useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  FileCheck2,
  Globe2,
  HandCoins,
  HeartPulse,
  Landmark,
  Upload,
  UserCircle2,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

type FocusStatus = 'pending' | 'new' | 'scheduled';

type FocusItem = {
  title: string;
  detail: string;
  statusLabel: string;
  status: FocusStatus;
  icon: React.ComponentType<{ className?: string }>;
};

type JourneyStage = 'Relationship' | 'Onboarding' | 'Facilities' | 'Monitoring' | 'Renewal';

type WorkspaceTab = 'Overview' | 'Business Passport' | 'Facilities' | 'Documents' | 'Communication' | 'Timeline' | 'Insights' | 'Audit';

const focusItems: readonly FocusItem[] = [
  {
    title: 'Credit Memo awaiting approval',
    detail: 'Final memo is prepared and waiting for approval confirmation.',
    statusLabel: 'Pending',
    status: 'pending',
    icon: FileCheck2,
  },
  {
    title: 'Customer uploaded KYC documents',
    detail: 'New compliance artifacts are ready for verification.',
    statusLabel: 'New',
    status: 'new',
    icon: Upload,
  },
  {
    title: 'Funding release scheduled today',
    detail: 'Treasury execution is planned for today\'s release window.',
    statusLabel: 'Scheduled',
    status: 'scheduled',
    icon: HandCoins,
  },
];

const statusClasses: Record<FocusStatus, string> = {
  pending: 'border-amber-700/40 bg-amber-900/30 text-amber-200',
  new: 'border-cyan-700/40 bg-cyan-900/30 text-cyan-200',
  scheduled: 'border-emerald-700/40 bg-emerald-900/30 text-emerald-200',
};

const journeyStages: readonly JourneyStage[] = ['Relationship', 'Onboarding', 'Facilities', 'Monitoring', 'Renewal'];
const activeStage: JourneyStage = 'Facilities';

const tabs: readonly WorkspaceTab[] = [
  'Overview',
  'Business Passport',
  'Facilities',
  'Documents',
  'Communication',
  'Timeline',
  'Insights',
  'Audit',
];

const relationshipTimeline = [
  { day: 'Yesterday', event: 'Meeting completed' },
  { day: 'Today', event: 'KYC received' },
  { day: 'Today', event: 'Credit memo generated' },
  { day: 'Tomorrow', event: 'Funding release' },
] as const;

const relationshipSnapshot = [
  { label: 'Country', value: 'United Arab Emirates' },
  { label: 'Industry', value: 'International Trading' },
  { label: 'Risk Rating', value: 'Moderate' },
  { label: 'Compliance', value: 'In Review' },
  { label: 'Last Review', value: 'Jul 22, 2026' },
  { label: 'Next Review', value: 'Aug 14, 2026' },
  { label: 'Relationship Score', value: '87 / 100' },
] as const;

export default function RelationshipWorkspace() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('Overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 py-10 sm:px-8 lg:gap-12 lg:px-10">
        <section className="rounded-2xl border border-slate-800/90 bg-slate-900/40 p-7 shadow-[0_14px_32px_rgba(2,6,23,0.28)] sm:p-8">
          <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-cyan-300" />
              <h2 className="text-lg font-semibold tracking-tight text-slate-100">Relationship Header</h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Customer Name</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Crescent Trade Holdings</h1>
              <p className="mt-3 text-base font-medium text-slate-300">Crescent Trade Holdings FZ-LLC</p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Country</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">United Arab Emirates</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Industry</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">International Trading</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Relationship Since</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">2023</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Legal Entity</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">Crescent Trade Holdings FZ-LLC</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-emerald-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Relationship Health</p>
                </div>
                <p className="text-sm font-semibold text-emerald-200">Excellent</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Exposure</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">USD 12.4 Million</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Active Facilities</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">4</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="flex items-center gap-2">
                  <UserCircle2 className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">RM Name</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">Deepak Singh</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Relationship Score</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">87 / 100</p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
                >
                  Continue Working &rarr;
                </button>
                <Link
                  href="/atlas/business-passport"
                  className="ml-3 inline-flex items-center justify-center rounded-full border border-slate-700/70 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-cyan-700/50 hover:text-cyan-100"
                >
                  Business Passport
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SectionCard title="Today&apos;s Focus" iconKey="target">
          <div className="grid gap-3 lg:grid-cols-3">
            {focusItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
                        <Icon className="h-4 w-4 text-cyan-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
                      </div>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusClasses[item.status]}`}>
                      {item.statusLabel}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Relationship Journey" iconKey="route">
          <div className="overflow-x-auto">
            <div className="flex min-w-max items-center gap-2">
              {journeyStages.map((stage, index) => {
                const isActive = stage === activeStage;
                const isLast = index === journeyStages.length - 1;
                return (
                  <div key={stage} className="flex items-center gap-2">
                    <div
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${
                        isActive
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
        </SectionCard>

        <SectionCard title="Relationship Tabs" iconKey="panels-top-left">
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 p-1">
            <div className="flex min-w-max items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    activeTab === tab
                      ? 'bg-cyan-600/20 text-cyan-200'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab !== 'Overview' ? (
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
              {activeTab} content will be added in a future sprint.
            </div>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Relationship Timeline</p>
                <div className="mt-4 space-y-3">
                  {relationshipTimeline.map((item, idx) => (
                    <article key={`${item.day}-${idx + 1}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{item.day}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-100">{item.event}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Relationship Snapshot</p>
                <div className="mt-4 divide-y divide-slate-800 border-t border-slate-800/80">
                  {relationshipSnapshot.map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-100">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
