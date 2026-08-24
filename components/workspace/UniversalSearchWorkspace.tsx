'use client';

import type { ComponentType } from 'react';
import {
  BriefcaseBusiness,
  Building2,
  Clock3,
  FileSearch,
  FileSearch2,
  FileText,
  Filter,
  FolderKanban,
  GraduationCap,
  Landmark,
  LibraryBig,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type SearchCategory = {
  label: string;
  count: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

type ResultGroup = {
  title: string;
  items: readonly string[];
};

const recentSearches = ['Crescent Trade Holdings', 'Invoice Discounting', 'LC Renewal', 'Blue Ocean', 'KYC Documents'] as const;

const searchCategories: readonly SearchCategory[] = [
  { label: 'Customers', count: '128', description: 'Institutional customer records and relationship files.', icon: BriefcaseBusiness },
  { label: 'Business Passport', count: '76', description: 'Identity and corporate profile records.', icon: Building2 },
  { label: 'Facilities', count: '64', description: 'Active facilities and banking limits.', icon: FolderKanban },
  { label: 'Deals', count: '212', description: 'Structured transactions and approvals.', icon: LineChart },
  { label: 'Execution', count: '31', description: 'Approved execution workflows.', icon: ShieldCheck },
  { label: 'Documents', count: '1,428', description: 'Operational and compliance documents.', icon: FileText },
  { label: 'Evidence', count: '896', description: 'Verified evidence and source material.', icon: FileSearch2 },
  { label: 'Knowledge', count: '342', description: 'Institutional patterns and references.', icon: LibraryBig },
  { label: 'ORACLE', count: '93', description: 'Decision intelligence and recommendations.', icon: GraduationCap },
] as const;

const resultGroups: readonly ResultGroup[] = [
  { title: 'CUSTOMERS', items: ['Crescent Trade Holdings', 'Blue Ocean Limited'] },
  { title: 'BUSINESS PASSPORT', items: ['Crescent Passport'] },
  { title: 'FACILITIES', items: ['Trade Finance Facility', 'Invoice Discounting Facility'] },
  { title: 'DEALS', items: ['Receivable Growth 2026'] },
  { title: 'DOCUMENTS', items: ['KYC Certificate', 'Board Resolution', 'Financial Statements'] },
  { title: 'EVIDENCE', items: ['Shipment Invoice', 'Inspection Report'] },
  { title: 'KNOWLEDGE', items: ['High Utilization Pattern', 'Late Renewal Behaviour'] },
  { title: 'ORACLE', items: ['Funding Recommendation', 'Risk Escalation'] },
] as const;

const filterChips = ['All', 'Customers', 'Facilities', 'Deals', 'Documents', 'Evidence', 'Knowledge', 'ORACLE'] as const;

const aiSuggestions = [
  'Customers with expiring KYC',
  'Facilities above 80% utilization',
  'Deals awaiting approval',
  'Funding scheduled today',
  'Documents missing signatures',
  'Evidence requiring verification',
] as const;

const searchTips = [
  'Search by customer, passport, facility, deal, execution, document, evidence, knowledge, or ORACLE record.',
  'Use short keywords or full institutional names for faster retrieval.',
  'Filter chips narrow the result set instantly without leaving the page.',
  'Grouped results are optimized for executive review and rapid triage.',
] as const;

export default function UniversalSearchWorkspace() {
  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Search className="h-5 w-5 text-cyan-300" />
          <h1 className="text-lg font-semibold tracking-tight text-slate-100">Institutional Search</h1>
        </div>

        <p className="max-w-3xl text-sm leading-6 text-slate-300">
          Search customers, business passports, facilities, deals, executions, documents, evidence, knowledge and ORACLE.
        </p>

        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-slate-500" />
            <input
              type="text"
              value=""
              readOnly
              placeholder="Search everything..."
              className="w-full bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Recent Searches</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            {recentSearches.map((item) => (
              <li key={item} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm font-semibold text-slate-100">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Quick Search Categories</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {searchCategories.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
                  <item.icon className="h-4 w-4 text-cyan-300" />
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                  {item.count}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-100">{item.label}</p>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Filter className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Smart Filters</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterChips.map((chip, index) => (
            <span
              key={chip}
              className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                index === 0
                  ? 'border-cyan-700/40 bg-cyan-900/25 text-cyan-100'
                  : 'border-slate-700 bg-slate-900/70 text-slate-300'
              }`}
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <FileSearch className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Search Results</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {resultGroups.map((group) => (
            <article key={group.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{group.title}</p>
              <div className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <div key={item} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm font-semibold text-slate-100">
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">AI Suggestions</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {aiSuggestions.map((item) => (
            <article key={item} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Clock3 className="h-5 w-5 text-cyan-300" />
          <h2 className="text-lg font-semibold tracking-tight text-slate-100">Search Tips</h2>
        </div>

        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
          <p className="text-sm leading-6 text-slate-300">
            Supported searches include customers, business passports, facilities, deals, executions, documents, evidence, knowledge,
            and ORACLE insights. Search by names, categories, or institutional phrases to locate records quickly.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {searchTips.map((item) => (
              <div key={item} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </WorkspaceShell>
  );
}
