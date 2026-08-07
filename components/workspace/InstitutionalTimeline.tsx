'use client';

import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  FileCheck2,
  Filter,
  Landmark,
  ShieldAlert,
  Sparkles,
  Timer,
  Users,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type TimelineFilter =
  | 'All'
  | 'Relationship'
  | 'Business Passport'
  | 'Facility'
  | 'Deal'
  | 'Execution'
  | 'Documents'
  | 'Evidence'
  | 'ORACLE'
  | 'Compliance'
  | 'Funding';

type TimelineEvent = {
  title: string;
  description: string;
  user: string;
  timestamp: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  linkedWorkspace: string;
  icon: typeof Building2;
};

type KPI = {
  label: string;
  value: string;
};

type Milestone = {
  title: string;
  detail: string;
};

type Insight = {
  title: string;
  detail: string;
};

type CollaborationItem = {
  team: string;
  activity: string;
};

const summaryCards: readonly KPI[] = [
  { label: 'Events Today', value: '14' },
  { label: 'Events This Week', value: '86' },
  { label: 'Pending Actions', value: '9' },
  { label: 'Completed Milestones', value: '31' },
] as const;

const timelineFilters: readonly TimelineFilter[] = [
  'All',
  'Relationship',
  'Business Passport',
  'Facility',
  'Deal',
  'Execution',
  'Documents',
  'Evidence',
  'ORACLE',
  'Compliance',
  'Funding',
] as const;

const groupedTimeline: readonly { date: string; events: readonly TimelineEvent[] }[] = [
  {
    date: 'Today',
    events: [
      {
        title: 'Treasury funded',
        description: 'Treasury executed the approved release instruction for the financing transaction.',
        user: 'Treasury Desk',
        timestamp: '09:10',
        priority: 'High',
        linkedWorkspace: 'Funding Workspace',
        icon: Landmark,
      },
      {
        title: 'Funding released',
        description: 'Funds were released after final execution and approval checks were completed.',
        user: 'Operations',
        timestamp: '09:45',
        priority: 'Critical',
        linkedWorkspace: 'Execution Workspace',
        icon: CheckCircle2,
      },
      {
        title: 'ORACLE recommendation generated',
        description: 'Institutional recommendation was refreshed against the latest evidence set.',
        user: 'ORACLE',
        timestamp: '11:20',
        priority: 'Medium',
        linkedWorkspace: 'Oracle Workspace',
        icon: Sparkles,
      },
      {
        title: 'Evidence attached',
        description: 'Shipment evidence and supporting references were linked to the timeline record.',
        user: 'Compliance',
        timestamp: '13:05',
        priority: 'Low',
        linkedWorkspace: 'Evidence Workspace',
        icon: FileCheck2,
      },
    ],
  },
  {
    date: 'Yesterday',
    events: [
      {
        title: 'Credit memo approved',
        description: 'Credit memo moved through committee approval and was recorded in the deal timeline.',
        user: 'Credit',
        timestamp: '15:30',
        priority: 'Critical',
        linkedWorkspace: 'Deal Workspace',
        icon: BookOpen,
      },
      {
        title: 'Facility sanctioned',
        description: 'Facility sanction was captured after credit and legal confirmation.',
        user: 'Credit',
        timestamp: '14:50',
        priority: 'High',
        linkedWorkspace: 'Facility Workspace',
        icon: Building2,
      },
      {
        title: 'Legal completed',
        description: 'Legal documentation review and execution notes were marked complete.',
        user: 'Legal',
        timestamp: '13:15',
        priority: 'Medium',
        linkedWorkspace: 'Execution Workspace',
        icon: FileCheck2,
      },
      {
        title: 'Insurance verified',
        description: 'Insurance endorsement was verified and associated with the facility pack.',
        user: 'Compliance',
        timestamp: '11:55',
        priority: 'Low',
        linkedWorkspace: 'Document Workspace',
        icon: ShieldAlert,
      },
    ],
  },
  {
    date: 'Earlier',
    events: [
      {
        title: 'Relationship created',
        description: 'Customer relationship entry was created for Crescent Trade Holdings FZ-LLC.',
        user: 'Relationship Manager',
        timestamp: '07 Aug 08:20',
        priority: 'Low',
        linkedWorkspace: 'Relationship Workspace',
        icon: Users,
      },
      {
        title: 'Business Passport generated',
        description: 'Institutional passport record was created for the customer profile.',
        user: 'Business Passport Team',
        timestamp: '07 Aug 09:05',
        priority: 'Medium',
        linkedWorkspace: 'Business Passport Workspace',
        icon: Building2,
      },
      {
        title: 'KYC uploaded',
        description: 'KYC documentation was uploaded to the institutional record set.',
        user: 'Compliance Desk',
        timestamp: '07 Aug 10:10',
        priority: 'Critical',
        linkedWorkspace: 'Document Workspace',
        icon: FileCheck2,
      },
      {
        title: 'Audit completed',
        description: 'Audit activity was completed and referenced in the control timeline.',
        user: 'Audit',
        timestamp: '06 Aug 16:35',
        priority: 'Low',
        linkedWorkspace: 'Document Workspace',
        icon: CheckCircle2,
      },
    ],
  },
] as const;

const milestones: readonly Milestone[] = [
  { title: 'Customer Onboarded', detail: 'Initial customer record and relationship profile completed.' },
  { title: 'First Facility Approved', detail: 'First sanctioned facility recorded in the institutional workflow.' },
  { title: 'Funding Released', detail: 'First funding release completed through treasury.' },
  { title: 'Renewal Completed', detail: 'Renewal cycle closed with supporting documentation finalized.' },
] as const;

const insights: readonly Insight[] = [
  { title: 'Fast approvals', detail: 'The customer shows a strong approval cadence compared with similar institutional profiles.' },
  { title: 'Funding delays', detail: 'Minor funding delays were detected where final document confirmation lagged by one cycle.' },
  { title: 'High activity customer', detail: 'Activity volume remains above average across the observed period.' },
  { title: 'Dormant relationship', detail: 'A short dormant window was observed before reactivation of execution activity.' },
  { title: 'Compliance improvements', detail: 'Control quality improved after repeated evidence and document verification.' },
] as const;

const collaborationItems: readonly CollaborationItem[] = [
  { team: 'Relationship Manager', activity: 'Initiated customer onboarding event chain.' },
  { team: 'Credit', activity: 'Recorded memo approval and facility sanction milestones.' },
  { team: 'Legal', activity: 'Closed execution and contract confirmation steps.' },
  { team: 'Compliance', activity: 'Verified KYC, evidence, and audit references.' },
  { team: 'Treasury', activity: 'Captured funding release and settlement updates.' },
  { team: 'ORACLE', activity: 'Generated recommendation and timeline observations.' },
] as const;

const statistics = [
  { label: 'Documents Created', value: '18' },
  { label: 'Facilities Approved', value: '6' },
  { label: 'Funding Released', value: '3' },
  { label: 'Evidence Linked', value: '27' },
  { label: 'ORACLE Decisions', value: '9' },
] as const;

const priorityTone: Record<TimelineEvent['priority'], string> = {
  Critical: 'border-amber-700/40 bg-amber-900/25 text-amber-100',
  High: 'border-cyan-700/40 bg-cyan-900/25 text-cyan-100',
  Medium: 'border-slate-700 bg-slate-900/70 text-slate-300',
  Low: 'border-emerald-700/40 bg-emerald-900/25 text-emerald-100',
};

export default function InstitutionalTimeline() {
  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <Timer className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Institutional Activity Timeline</h1>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              Export Timeline
            </button>
            <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              Filter Events
            </button>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-300">Chronological history of every important institutional event.</p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Timeline Summary</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{card.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{card.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Filter className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Timeline Filters</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {timelineFilters.map((filter, index) => (
            <span
              key={filter}
              className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                index === 0 ? 'border-cyan-700/40 bg-cyan-900/25 text-cyan-100' : 'border-slate-700 bg-slate-900/70 text-slate-300'
              }`}
            >
              {filter}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Main Timeline</h2>
        </div>

        <div className="space-y-6">
          {groupedTimeline.map((group, groupIndex) => (
            <div key={group.date} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{group.date}</p>
              <div className="relative pl-4">
                <div className="absolute left-[7px] top-0 h-full w-px bg-slate-800" />
                <div className="space-y-4">
                  {group.events.map((event) => {
                    const EventIcon = event.icon;
                    return (
                      <article key={event.title + event.timestamp} className="relative rounded-xl border border-slate-800 bg-slate-950/70 p-4 pl-5">
                        <div className="absolute -left-[1px] top-5 h-3 w-3 rounded-full border border-cyan-400 bg-slate-950" />
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
                              <EventIcon className="h-4 w-4 text-cyan-300" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-100">{event.title}</p>
                              <p className="mt-1 text-sm text-slate-300">{event.description}</p>
                              <div className="mt-2 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-slate-500">
                                <span>{event.user}</span>
                                <span>{event.timestamp}</span>
                                <span>{event.linkedWorkspace}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${priorityTone[event.priority]}`}>
                              {event.priority}
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
              {groupIndex < groupedTimeline.length - 1 ? <div className="h-px bg-slate-800" /> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <CheckCircle2 className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Major Milestones</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {milestones.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <BookOpen className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Institutional Insights</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {insights.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Users className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Recent Collaboration</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {collaborationItems.map((item) => (
            <article key={item.team} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.team}</p>
              <p className="mt-2 text-sm text-slate-300">{item.activity}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <FileCheck2 className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Timeline Statistics</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {statistics.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ArrowRight className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Next Institutional Action</h2>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Institutional recommendation</p>
          <p className="mt-3 text-sm text-slate-300">
            Continue building the institutional timeline by linking the latest evidence, approval, and funding events to the active
            workspace history so executives can review the full operating sequence without switching context.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
          >
            Continue Timeline Review
          </button>
        </article>
      </section>
    </WorkspaceShell>
  );
}
