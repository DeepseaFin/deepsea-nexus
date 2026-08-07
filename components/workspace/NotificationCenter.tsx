'use client';

import {
  BellRing,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Filter,
  Landmark,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type SummaryCard = {
  label: string;
  value: string;
};

type NotificationFilter = {
  label: string;
};

type NotificationItem = {
  title: string;
  description: string;
  timestamp: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  read: boolean;
  icon: typeof BellRing;
};

type NotificationGroup = {
  title: 'Today' | 'Yesterday' | 'Earlier';
  items: readonly NotificationItem[];
};

type ApprovalCard = {
  title: string;
  detail: string;
};

type HighlightCard = {
  label: string;
  value: string;
};

type AttentionCard = {
  title: string;
  detail: string;
};

const summaryCards: readonly SummaryCard[] = [
  { label: 'Unread', value: '12' },
  { label: 'Critical', value: '4' },
  { label: 'Approvals', value: '7' },
  { label: 'Completed Today', value: '18' },
] as const;

const notificationFilters: readonly NotificationFilter[] = [
  { label: 'All' },
  { label: 'Critical' },
  { label: 'Approvals' },
  { label: 'Funding' },
  { label: 'Documents' },
  { label: 'Compliance' },
  { label: 'ORACLE' },
  { label: 'System' },
] as const;

const notificationGroups: readonly NotificationGroup[] = [
  {
    title: 'Today',
    items: [
      {
        title: 'Funding released',
        description: 'USD 10.0 Million moved to execution and treasury release has been completed.',
        timestamp: '09:10',
        priority: 'High',
        read: false,
        icon: Landmark,
      },
      {
        title: 'Document uploaded',
        description: 'Insurance endorsement and board resolution pack were uploaded to the document room.',
        timestamp: '10:25',
        priority: 'Medium',
        read: false,
        icon: FileCheck2,
      },
      {
        title: 'Evidence verified',
        description: 'Shipment invoice evidence and source references passed verification checks.',
        timestamp: '11:40',
        priority: 'Low',
        read: true,
        icon: CheckCircle2,
      },
      {
        title: 'Credit approved',
        description: 'Committee approval confirmed for the Crescent Receivables Growth Facility.',
        timestamp: '12:15',
        priority: 'Critical',
        read: false,
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: 'Yesterday',
    items: [
      {
        title: 'Relationship updated',
        description: 'Customer relationship profile was refreshed with the latest executive review.',
        timestamp: 'Yesterday 15:20',
        priority: 'Low',
        read: true,
        icon: BriefcaseBusiness,
      },
      {
        title: 'Business Passport changed',
        description: 'Business passport record received an updated company structure and ownership map.',
        timestamp: 'Yesterday 14:05',
        priority: 'Medium',
        read: false,
        icon: Building2,
      },
      {
        title: 'Facility nearing expiry',
        description: 'Invoice Discounting Facility requires renewal review within the next 30 days.',
        timestamp: 'Yesterday 13:30',
        priority: 'Critical',
        read: false,
        icon: TriangleAlert,
      },
    ],
  },
  {
    title: 'Earlier',
    items: [
      {
        title: 'ORACLE recommendation ready',
        description: 'ORACLE generated an institutional recommendation and evidence summary for review.',
        timestamp: '07 Aug 08:15',
        priority: 'High',
        read: true,
        icon: Sparkles,
      },
      {
        title: 'Audit completed',
        description: 'Operational audit workflow closed with no major exceptions flagged.',
        timestamp: '07 Aug 07:40',
        priority: 'Low',
        read: true,
        icon: ShieldAlert,
      },
      {
        title: 'KYC expiring',
        description: 'KYC renewal reminder triggered for the current customer onboarding cycle.',
        timestamp: '06 Aug 16:55',
        priority: 'Critical',
        read: false,
        icon: Clock3,
      },
    ],
  },
] as const;

const pendingApprovals: readonly ApprovalCard[] = [
  { title: 'Credit Memo', detail: 'Awaiting final review and sign-off from the credit owner.' },
  { title: 'Funding', detail: 'Treasury confirmation required for release scheduling.' },
  { title: 'Compliance', detail: 'KYC and sanctions review pending final clearance.' },
  { title: 'Legal', detail: 'Document execution and opinion note awaiting confirmation.' },
  { title: 'Treasury', detail: 'Cash movement instruction ready for approval.' },
] as const;

const institutionalHighlights: readonly HighlightCard[] = [
  { label: "Today's activity", value: '27 events' },
  { label: 'New relationships', value: '3' },
  { label: 'Facilities approved', value: '5' },
  { label: 'Funding released', value: '2' },
  { label: 'Documents received', value: '18' },
  { label: 'Evidence linked', value: '11' },
] as const;

const attentionCards: readonly AttentionCard[] = [
  { title: 'Customer requires review', detail: 'Relationship profile needs a fresh KYC and risk reassessment.' },
  { title: 'Funding delayed', detail: 'Treasury release timing slipped due to late document confirmation.' },
  { title: 'Document mismatch', detail: 'Signature date differs between legal pack and uploaded evidence.' },
  { title: 'Compliance warning', detail: 'Renewal reminder has entered a critical alert window.' },
  { title: 'Relationship deterioration', detail: 'Monitoring trend indicates elevated concentration pressure.' },
] as const;

const filterTone = 'border-slate-700 bg-slate-900/70 text-slate-300';
const priorityTone: Record<NotificationItem['priority'], string> = {
  Critical: 'border-amber-700/40 bg-amber-900/25 text-amber-100',
  High: 'border-cyan-700/40 bg-cyan-900/25 text-cyan-100',
  Medium: 'border-slate-700 bg-slate-900/70 text-slate-300',
  Low: 'border-emerald-700/40 bg-emerald-900/25 text-emerald-100',
};

const sectionIconMap: Record<NotificationItem['priority'], typeof BellRing> = {
  Critical: TriangleAlert,
  High: Landmark,
  Medium: FileCheck2,
  Low: CheckCircle2,
};

export default function NotificationCenter() {
  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <BellRing className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Notification Center</h1>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              Mark All Read
            </button>
            <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              Notification Settings
            </button>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-300">Institutional alerts, approvals and operational events.</p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Summary</h2>
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
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Notification Filters</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {notificationFilters.map((filter, index) => (
            <span
              key={filter.label}
              className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                index === 0 ? 'border-cyan-700/40 bg-cyan-900/25 text-cyan-100' : filterTone
              }`}
            >
              {filter.label}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <BellRing className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Notification Feed</h2>
        </div>

        <div className="space-y-5">
          {notificationGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{group.title}</p>
              <div className="space-y-3">
                {group.items.map((item) => {
                  const ItemIcon = sectionIconMap[item.priority];
                  return (
                    <article
                      key={item.title + item.timestamp}
                      className={`rounded-xl border p-4 ${item.read ? 'border-slate-800 bg-slate-950/70' : 'border-cyan-900/40 bg-cyan-950/20'}`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
                            <ItemIcon className="h-4 w-4 text-cyan-300" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                            <p className="mt-1 text-sm text-slate-300">{item.description}</p>
                            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">{item.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${priorityTone[item.priority]}`}>
                            {item.priority}
                          </span>
                          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${item.read ? 'border-slate-700 bg-slate-900/70 text-slate-300' : 'border-cyan-700/40 bg-cyan-900/25 text-cyan-100'}`}>
                            {item.read ? 'Read' : 'Unread'}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ShieldCheck className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Pending Approvals</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {pendingApprovals.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <FileCheck2 className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Institutional Highlights</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {institutionalHighlights.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <TriangleAlert className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">AI Attention Required</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {attentionCards.map((item) => (
            <article key={item.title} className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Clock3 className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Notification Preferences</h2>
        </div>

        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
          <p className="text-sm leading-6 text-slate-300">
            Institutional reminder: customize which alerts appear for approvals, funding, documents, compliance, ORACLE, and operational
            events. Notification preferences are designed to keep executive users focused on the most relevant institutional signals.
          </p>
        </article>
      </section>
    </WorkspaceShell>
  );
}
