'use client';

import {
  ArrowRight,
  Bookmark,
  FileText,
  Filter,
  MessageSquare,
  Mic,
  Sparkles,
  Users,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type SummaryCard = {
  label: string;
  value: string;
};

type FilterChip = {
  label: string;
};

type ConversationItem = {
  avatar: string;
  department: string;
  author: string;
  timestamp: string;
  linkedCustomer: string;
  linkedWorkspace: string;
  message: string;
  attachments: string[];
  tags: string[];
  aiSummary: string;
  primaryAction: string;
};

type PinnedConversation = {
  title: string;
  detail: string;
};

type MentionItem = {
  author: string;
  context: string;
  time: string;
};

type SharedDocument = {
  title: string;
  category: string;
  owner: string;
};

type MeetingSection = {
  title: string;
  items: readonly string[];
};

type KnowledgeItem = {
  title: string;
  detail: string;
};

const summaryCards: readonly SummaryCard[] = [
  { label: 'Open Conversations', value: '18' },
  { label: 'Unread', value: '7' },
  { label: "Today's Notes", value: '12' },
  { label: 'AI Summaries', value: '6' },
] as const;

const filters: readonly FilterChip[] = [
  { label: 'All' },
  { label: 'Relationship' },
  { label: 'Deal' },
  { label: 'Facility' },
  { label: 'Execution' },
  { label: 'Legal' },
  { label: 'Compliance' },
  { label: 'Treasury' },
  { label: 'Operations' },
  { label: 'ORACLE' },
] as const;

const conversationFeed: readonly ConversationItem[] = [
  {
    avatar: 'CT',
    department: 'Relationship',
    author: 'Deepak Singh',
    timestamp: '09:15',
    linkedCustomer: 'Crescent Trade Holdings FZ-LLC',
    linkedWorkspace: 'Relationship Workspace',
    message: 'Customer requested confirmation on the latest facility renewal timing and asked for a quick funding status update.',
    attachments: ['Call Note', 'Renewal Summary'],
    tags: ['Urgent', 'Customer', 'Renewal'],
    aiSummary: 'AI summary ready',
    primaryAction: 'Open Thread',
  },
  {
    avatar: 'DM',
    department: 'Deal',
    author: 'Maya Al-Hassan',
    timestamp: '10:05',
    linkedCustomer: 'Blue Ocean Limited',
    linkedWorkspace: 'Deal Workspace',
    message: 'Credit memo wording is aligned, and the committee comments have been incorporated into the latest draft.',
    attachments: ['Credit Memo v4', 'Committee Notes'],
    tags: ['Deal', 'Approval'],
    aiSummary: 'AI summary ready',
    primaryAction: 'Review Memo',
  },
  {
    avatar: 'LC',
    department: 'Compliance',
    author: 'Amina Farouk',
    timestamp: '11:20',
    linkedCustomer: 'Crescent Trade Holdings FZ-LLC',
    linkedWorkspace: 'Document Workspace',
    message: 'KYC refresh has been reviewed, but one insurance attachment still requires final confirmation before closure.',
    attachments: ['KYC Pack', 'Insurance Endorsement'],
    tags: ['Compliance', 'KYC'],
    aiSummary: 'AI summary ready',
    primaryAction: 'View Evidence',
  },
  {
    avatar: 'TR',
    department: 'Treasury',
    author: 'Omar Hassan',
    timestamp: '13:45',
    linkedCustomer: 'Crescent Trade Holdings FZ-LLC',
    linkedWorkspace: 'Execution Workspace',
    message: 'Funding instruction is prepared and waiting for final legal clearance before release scheduling.',
    attachments: ['Funding Note'],
    tags: ['Treasury', 'Funding'],
    aiSummary: 'AI summary ready',
    primaryAction: 'Open Funding',
  },
] as const;

const pinnedConversations: readonly PinnedConversation[] = [
  { title: 'Renewal approval thread', detail: 'Pinned by credit for quick access to the current facility renewal discussion.' },
  { title: 'Funding release coordination', detail: 'Pinned by treasury to track execution timing and release readiness.' },
  { title: 'Compliance evidence review', detail: 'Pinned by compliance for pending KYC and insurance clarification.' },
] as const;

const recentMentions: readonly MentionItem[] = [
  { author: '@Deepak Singh', context: 'mentioned in the renewal approval thread', time: '10 min ago' },
  { author: '@Amina Farouk', context: 'requested updated insurance evidence', time: '24 min ago' },
  { author: '@Omar Hassan', context: 'confirmed treasury readiness', time: '41 min ago' },
] as const;

const sharedDocuments: readonly SharedDocument[] = [
  { title: 'Credit Memo v4', category: 'Deal', owner: 'Credit Team' },
  { title: 'KYC Pack', category: 'Compliance', owner: 'Compliance Desk' },
  { title: 'Funding Note', category: 'Treasury', owner: 'Treasury Desk' },
  { title: 'Committee Notes', category: 'Governance', owner: 'Credit Committee' },
] as const;

const meetingSummarySections: readonly MeetingSection[] = [
  {
    title: 'Meeting Highlights',
    items: ['Customer confirmed renewal urgency', 'Credit memo draft is consistent', 'Treasury prepared release slot'],
  },
  {
    title: 'Action Items',
    items: ['Upload final insurance evidence', 'Confirm legal sign-off', 'Send customer status update'],
  },
  {
    title: 'Risks',
    items: ['Pending insurance evidence', 'Timing dependency on legal closure', 'Short funding runway on the current cycle'],
  },
  {
    title: 'Decisions',
    items: ['Proceed with current approval path', 'Continue monitoring before funding', 'Escalate only if evidence remains incomplete'],
  },
] as const;

const knowledgeItems: readonly KnowledgeItem[] = [
  { title: 'Institutional lessons', detail: 'Fast responses improve approval confidence and reduce execution delays.' },
  { title: 'Policies created', detail: 'Conversation outcomes inform renewal and evidence follow-up policy notes.' },
  { title: 'Templates created', detail: 'Reusable customer update and funding confirmation templates were generated.' },
  { title: 'Reusable knowledge', detail: 'Approved phrase patterns and escalation rules are now available for future threads.' },
] as const;

export default function ConversationsWorkspace() {
  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Institutional Conversations</h1>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              New Note
            </button>
            <button type="button" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              New Conversation
            </button>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-300">Centralized collaboration across every institutional workflow.</p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Conversation Summary</h2>
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
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Filters</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => (
            <span
              key={filter.label}
              className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                index === 0 ? 'border-cyan-700/40 bg-cyan-900/25 text-cyan-100' : 'border-slate-700 bg-slate-900/70 text-slate-300'
              }`}
            >
              {filter.label}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Users className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Conversation Feed</h2>
        </div>

        <div className="space-y-4">
          {conversationFeed.map((item) => (
            <article key={item.title + item.timestamp} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-100">
                    {item.avatar}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-100">{item.department}</p>
                      <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                        AI summary badge
                      </span>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                      {item.author} · {item.timestamp}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">{item.message}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-slate-500">
                      <span>{item.linkedCustomer}</span>
                      <span>{item.linkedWorkspace}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.attachments.map((attachment) => (
                        <span key={attachment} className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                          {attachment}
                        </span>
                      ))}
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-cyan-700/40 bg-cyan-900/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                    {item.department}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-50"
                  >
                    {item.primaryAction}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Bookmark className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Pinned Conversations</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pinnedConversations.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <MessageSquare className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Recent Mentions</h2>
        </div>

        <div className="space-y-3">
          {recentMentions.map((item) => (
            <article key={item.author + item.time} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.author}</p>
              <p className="mt-1 text-sm text-slate-300">{item.context}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">{item.time}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <FileText className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Shared Documents</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {sharedDocuments.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.category}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{item.owner}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Mic className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">AI Meeting Summary</h2>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {meetingSummarySections.map((section) => (
            <article key={section.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{section.title}</p>
              <ul className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Knowledge Captured</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {knowledgeItems.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ArrowRight className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Next Recommended Action</h2>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Institutional recommendation</p>
          <p className="mt-3 text-sm text-slate-300">
            Resolve the remaining compliance and legal items, then consolidate the approved conversation trail into the active task and
            execution workspaces so the institutional workflow remains aligned.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
          >
            Continue Collaboration
          </button>
        </article>
      </section>
    </WorkspaceShell>
  );
}
