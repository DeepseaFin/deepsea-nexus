'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Search,
  ShieldAlert,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import TrustScore from '@/components/atlas/intelligence/TrustScore';

const positiveFactors = [
  'Strong obligor payment behavior over the last 12 months.',
  'Healthy sector tailwinds and stable trade corridor demand.',
  'Document package quality above baseline institutional threshold.',
];

const conditions = [
  'Complete final legal enforceability wording for assignment notice.',
  'Obtain updated board resolution reflecting latest facility limit.',
  'Confirm controlled account waterfall sequencing with bank partner.',
];

const criticalRisks = [
  'Counterparty concentration nearing portfolio policy threshold.',
  'One invoice batch has delayed acknowledgement from buyer.',
];

const outstandingItems = [
  { title: 'Missing Documents', items: ['Audited financial statements', 'Board resolution copy'] },
  { title: 'Legal Conditions', items: ['Assignment enforceability confirmation', 'Jurisdiction rider alignment'] },
  { title: 'Commercial Conditions', items: ['Final pricing sign-off', 'Treasury allocation confirmation'] },
];

const explanationSections = [
  {
    title: 'Commercial',
    score: 82,
    summary: 'Commercial structure is viable with acceptable margin profile.',
    reason: 'Pricing, tenor, and utilization assumptions align with current desk benchmarks.',
  },
  {
    title: 'Credit',
    score: 79,
    summary: 'Credit quality is stable with manageable obligor concentration.',
    reason: 'Payment history is consistent, but concentration risk requires conditional controls.',
  },
  {
    title: 'Documents',
    score: 74,
    summary: 'Documentation is near-complete with limited critical gaps.',
    reason: 'Core facility documents are present; final board and legal artifacts remain pending.',
  },
  {
    title: 'Legal',
    score: 71,
    summary: 'Legal posture is acceptable subject to clause closure.',
    reason: 'Primary enforceability checks passed; rider harmonization is not yet final.',
  },
  {
    title: 'Fraud',
    score: 84,
    summary: 'Low fraud anomaly risk under current review state.',
    reason: 'No material duplicate or sequence manipulation identified in current invoice sample.',
  },
  {
    title: 'Policy Compliance',
    score: 77,
    summary: 'Policy alignment is within tolerance with conditional approvals.',
    reason: 'All major policy controls pass except concentration warning requiring committee note.',
  },
];

const similarTransactions = [
  {
    deal: 'DNX-2026-000188',
    sector: 'Industrial Trading',
    country: 'UAE',
    amount: 'AED 12.5M',
    dci: 81,
    outcome: 'Approved with Conditions',
  },
  {
    deal: 'DNX-2026-000173',
    sector: 'Healthcare Procurement',
    country: 'Saudi Arabia',
    amount: 'AED 9.4M',
    dci: 78,
    outcome: 'Approved',
  },
  {
    deal: 'DNX-2026-000161',
    sector: 'Logistics',
    country: 'Qatar',
    amount: 'AED 7.9M',
    dci: 73,
    outcome: 'Approved with Conditions',
  },
  {
    deal: 'DNX-2026-000149',
    sector: 'Commodities',
    country: 'Bahrain',
    amount: 'AED 6.8M',
    dci: 66,
    outcome: 'Rejected',
  },
];

const exposureCards = [
  { label: 'Client Exposure', value: 'AED 24.6M', note: 'Current + pending ABC Ltd aggregate' },
  { label: 'Sector Exposure', value: '27.8%', note: 'Industrial trading portfolio share' },
  { label: 'Country Exposure', value: '39.4%', note: 'UAE concentration in active portfolio' },
  { label: 'Remaining Headroom', value: 'AED 18.2M', note: 'Before policy concentration trigger' },
];

export default function AskAtlasWorkspace() {
  return (
    <div className="space-y-6">
      <SectionCard title="Ask ATLAS" iconKey="search">
        <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
          <Search className="h-4 w-4 text-cyan-300" />
          <input
            type="text"
            defaultValue="Can we finance ABC Ltd?"
            className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Executive Recommendation"
        iconKey="sparkles"
        className="relative overflow-hidden border-cyan-900/40 bg-slate-950/70"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_40%)]" />

        <div className="relative space-y-5">
          <div className="rounded-xl border border-cyan-700/30 bg-slate-900/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">Recommendation</p>
            <p className="mt-2 text-2xl font-semibold text-slate-100 sm:text-3xl">APPROVE WITH CONDITIONS</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Deal Confidence Index" value="78" />
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <TrustScore score={82} label="Trust Score" size="sm" />
            </div>
            <MetricCard label="Expected Return" value="16.4%" />
            <MetricCard label="Decision Confidence" value="High" />
            <MetricCard label="Recommendation Type" value="Conditional" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Key Reasons" iconKey="file-search">
        <div className="grid gap-4 md:grid-cols-3">
          <ReasonList title="Positive Factors" items={positiveFactors} tone="positive" />
          <ReasonList title="Conditions" items={conditions} tone="warning" />
          <ReasonList title="Critical Risks" items={criticalRisks} tone="critical" />
        </div>
      </SectionCard>

      <SectionCard title="Outstanding Items" iconKey="alert-triangle">
        <div className="grid gap-4 md:grid-cols-3">
          {outstandingItems.map((block) => (
            <div key={block.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">{block.title}</p>
              <ul className="mt-3 space-y-2">
                {block.items.map((item) => (
                  <li key={item} className="inline-flex w-full items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-900" readOnly />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recommended Next Action" iconKey="trending-up">
        <div className="rounded-xl border border-cyan-800/40 bg-cyan-950/20 p-5">
          <p className="text-sm font-semibold text-cyan-100">
            Close legal rider confirmation and board resolution, then submit for conditional approval in the next committee window.
          </p>
          <p className="mt-2 text-xs text-slate-400">Owner: Deal Manager | Target: Within 24 hours</p>
        </div>
      </SectionCard>

      <SectionCard title="Explain Recommendation" iconKey="scale">
        <div className="space-y-3">
          {explanationSections.map((section) => (
            <details key={section.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-slate-100">
                <span className="inline-flex items-center justify-between w-full">
                  <span>{section.title}</span>
                  <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs text-slate-300">
                    Score {section.score}
                  </span>
                </span>
              </summary>
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                <p>
                  <span className="text-slate-400">Summary: </span>
                  {section.summary}
                </p>
                <p>
                  <span className="text-slate-400">Reason: </span>
                  {section.reason}
                </p>
              </div>
            </details>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Similar Transactions" iconKey="circle-dollar-sign">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-3">Deal</th>
                <th className="px-3 py-3">Sector</th>
                <th className="px-3 py-3">Country</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">DCI</th>
                <th className="px-3 py-3">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {similarTransactions.map((row) => (
                <tr key={row.deal} className="hover:bg-slate-900/60">
                  <td className="px-3 py-3 font-medium text-slate-100">{row.deal}</td>
                  <td className="px-3 py-3">{row.sector}</td>
                  <td className="px-3 py-3">{row.country}</td>
                  <td className="px-3 py-3">{row.amount}</td>
                  <td className="px-3 py-3">{row.dci}</td>
                  <td className="px-3 py-3">{row.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Exposure" iconKey="globe-2">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {exposureCards.map((card) => (
            <div key={card.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">{card.value}</p>
              <p className="mt-1 text-xs text-slate-500">{card.note}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function ReasonList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'positive' | 'warning' | 'critical';
}) {
  const config = {
    positive: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-300" />,
      card: 'border-emerald-900/40 bg-emerald-950/20',
      marker: 'text-emerald-300',
      symbol: '✓',
    },
    warning: {
      icon: <AlertTriangle className="h-4 w-4 text-amber-300" />,
      card: 'border-amber-900/40 bg-amber-950/20',
      marker: 'text-amber-300',
      symbol: '⚠',
    },
    critical: {
      icon: <ShieldAlert className="h-4 w-4 text-rose-300" />,
      card: 'border-rose-900/40 bg-rose-950/20',
      marker: 'text-rose-300',
      symbol: '✖',
    },
  };

  return (
    <div className={`rounded-xl border p-4 ${config[tone].card}`}>
      <div className="inline-flex items-center gap-2">
        {config[tone].icon}
        <p className="text-sm font-semibold text-slate-100">{title}</p>
      </div>
      <ul className="mt-3 space-y-2 text-sm text-slate-200">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className={config[tone].marker}>{config[tone].symbol}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
