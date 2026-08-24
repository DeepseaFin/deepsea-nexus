'use client';

import {
  ArrowRight,
  Building2,
  FolderKanban,
  History,
  Landmark,
  Search,
  Sparkles,
  Star,
  Target,
  Timer,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type CategoryCard = {
  label: string;
  description: string;
};

type VisitCard = {
  workspace: string;
  lastOpened: string;
  customer: string;
};

type MapCard = {
  title: string;
  description: string;
  action: string;
};

type Shortcut = {
  label: string;
};

type RecommendationCard = {
  title: string;
  detail: string;
};

type RuleItem = {
  title: string;
  detail: string;
};

const categoryCards: readonly CategoryCard[] = [
  { label: 'Customer', description: 'Access customer records and relationship context.' },
  { label: 'Relationship', description: 'Move into relationship views and interaction history.' },
  { label: 'Business Passport', description: 'Review corporate identity and institutional profile.' },
  { label: 'Facility', description: 'Open facility limits, utilization, and renewals.' },
  { label: 'Deal', description: 'Navigate active financing transactions and approvals.' },
  { label: 'Execution', description: 'Track execution, funding, and fulfillment status.' },
  { label: 'Documents', description: 'Reach document control and supporting files.' },
  { label: 'Evidence', description: 'Review evidence packs and source materials.' },
  { label: 'ORACLE', description: 'Enter decision intelligence and recommendations.' },
  { label: 'Search', description: 'Use institutional search across DNOS.' },
  { label: 'Timeline', description: 'Open chronological event history.' },
  { label: 'Tasks', description: 'Jump to responsibilities and work queues.' },
  { label: 'Conversations', description: 'Review notes, mentions, and threads.' },
  { label: 'Notifications', description: 'Open alerts, approvals, and operational events.' },
] as const;

const recentlyVisited: readonly VisitCard[] = [
  { workspace: 'Deal Workspace', lastOpened: '8 min ago', customer: 'Crescent Trade Holdings' },
  { workspace: 'Facility Workspace', lastOpened: '21 min ago', customer: 'Blue Ocean Limited' },
  { workspace: 'Document Workspace', lastOpened: '37 min ago', customer: 'Crescent Trade Holdings' },
  { workspace: 'Oracle Workspace', lastOpened: '52 min ago', customer: 'Blue Ocean Limited' },
] as const;

const favorites = [
  'Relationship Workspace',
  'Business Passport Workspace',
  'Execution Workspace',
  'Task Center',
] as const;

const crossNavigationMap: readonly MapCard[] = [
  { title: 'Customer', description: 'Primary identity and relationship entry point.', action: 'Open Customer' },
  { title: 'Relationship', description: 'Navigate customer engagement and ownership context.', action: 'Open Relationship' },
  { title: 'Business Passport', description: 'View institutional passport and corporate profile.', action: 'Open Passport' },
  { title: 'Facilities', description: 'Move into limits, renewals, and utilization.', action: 'Open Facility' },
  { title: 'Deals', description: 'Access structured financing transactions.', action: 'Open Deal' },
  { title: 'Execution', description: 'Continue through execution and funding controls.', action: 'Open Execution' },
  { title: 'Documents', description: 'Jump into document control and verification.', action: 'Open Documents' },
  { title: 'Evidence', description: 'Review evidence and source validation.', action: 'Open Evidence' },
  { title: 'ORACLE', description: 'Open decision intelligence and recommendations.', action: 'Open ORACLE' },
] as const;

const shortcuts: readonly Shortcut[] = [
  { label: 'New Customer' },
  { label: 'New Facility' },
  { label: 'New Deal' },
  { label: 'Upload Documents' },
  { label: 'Open ORACLE' },
  { label: 'Search' },
  { label: 'Tasks' },
  { label: 'Notifications' },
] as const;

const stats = [
  { label: 'Most visited', value: 'Deal Workspace' },
  { label: 'Recent', value: 'Oracle Workspace' },
  { label: 'Pinned', value: '4 workspaces' },
  { label: 'Institutional usage', value: 'High continuity' },
] as const;

const aiRecommendations: readonly RecommendationCard[] = [
  { title: 'Frequently used together', detail: 'Relationship, Facility, and Documents are frequently visited in one session.' },
  { title: 'Suggested next workspace', detail: 'Open Execution after Deal to preserve workflow continuity.' },
  { title: 'Workflow optimization', detail: 'Pin Customer, ORACLE, and Task Center for faster navigation cycles.' },
] as const;

const navigationRules: readonly RuleItem[] = [
  { title: 'Context preservation', detail: 'Keep customer context visible when moving between related workspaces.' },
  { title: 'Shared state', detail: 'Reuse identity, facility, and deal context across the hub.' },
  { title: 'Breadcrumb logic', detail: 'Track the full institutional path from customer to execution.' },
  { title: 'Workspace continuity', detail: 'Allow navigation without losing approval or review state.' },
] as const;

export default function NavigationFramework() {
  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Institutional Navigation</h1>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              Customize
            </button>
            <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              Recent
            </button>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-300">Navigate every institutional workspace from one unified framework.</p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <FolderKanban className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Workspace Categories</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categoryCards.map((card) => (
            <article key={card.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{card.label}</p>
              <p className="mt-2 text-sm text-slate-300">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <History className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Recently Visited</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {recentlyVisited.map((item) => (
            <article key={item.workspace} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.workspace}</p>
              <p className="mt-2 text-sm text-slate-300">Customer: {item.customer}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">Last opened {item.lastOpened}</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-50"
              >
                Continue
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Star className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Favorites</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {favorites.map((item) => (
            <span key={item} className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ArrowRight className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Cross Navigation Map</h2>
        </div>

        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {crossNavigationMap.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-50"
              >
                {item.action}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Search className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Institutional Shortcuts</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {shortcuts.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm font-semibold text-slate-100">
              {item.label}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Building2 className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Workspace Statistics</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">AI Recommendations</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {aiRecommendations.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Target className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Institutional Navigation Rules</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {navigationRules.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Timer className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Next Recommended Action</h2>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Institutional recommendation</p>
          <p className="mt-3 text-sm text-slate-300">
            Use the navigation hub to continue from the current customer context into the next most relevant workspace without losing
            the active institutional thread.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
          >
            Continue Navigation
          </button>
        </article>
      </section>
    </WorkspaceShell>
  );
}
