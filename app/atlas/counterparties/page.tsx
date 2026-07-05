'use client';

import { Building2, Search, SlidersHorizontal, Activity, FileStack, ShieldCheck } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import TrustScore from '@/components/atlas/intelligence/TrustScore';
import ActionPanel from '@/components/atlas/intelligence/ActionPanel';

const portfolioKpis = [
  {
    label: 'Total Counterparties',
    value: '218',
    note: 'Active and monitored relationships',
  },
  {
    label: 'Active Exposure',
    value: 'AED 1.12B',
    note: 'Outstanding funded and committed lines',
  },
  {
    label: 'Average Risk Rating',
    value: 'A-',
    note: 'Weighted internal credit assessment',
  },
  {
    label: 'Watchlist',
    value: '23',
    note: 'Enhanced monitoring required',
  },
];

const counterparties = [
  {
    name: 'Mashreq Bank PJSC',
    country: 'UAE',
    industry: 'Banking',
    exposure: 'AED 124.0M',
    internalRating: 'AAA',
    trustScore: 95,
    status: 'Active',
  },
  {
    name: 'Gulf Maritime Logistics LLC',
    country: 'Qatar',
    industry: 'Logistics',
    exposure: 'AED 47.3M',
    internalRating: 'A',
    trustScore: 83,
    status: 'Active',
  },
  {
    name: 'Summit Industrial Procurement Co.',
    country: 'Saudi Arabia',
    industry: 'Industrial Trading',
    exposure: 'AED 61.8M',
    internalRating: 'BBB+',
    trustScore: 71,
    status: 'Watchlist',
  },
  {
    name: 'Crescent Healthcare Distribution SPC',
    country: 'Bahrain',
    industry: 'Healthcare',
    exposure: 'AED 32.6M',
    internalRating: 'A-',
    trustScore: 79,
    status: 'Active',
  },
  {
    name: 'Blue Horizon Commodities DMCC',
    country: 'UAE',
    industry: 'Commodities',
    exposure: 'AED 88.9M',
    internalRating: 'BBB',
    trustScore: 68,
    status: 'Pending Review',
  },
  {
    name: 'Northern Infrastructure Buyers Ltd.',
    country: 'Oman',
    industry: 'Construction',
    exposure: 'AED 41.5M',
    internalRating: 'BB+',
    trustScore: 62,
    status: 'Watchlist',
  },
];

const profilePreview = {
  companyName: 'Mashreq Bank PJSC',
  relationshipType: 'Primary Obligor',
  relationshipSince: '2019',
  summary:
    'Institutional banking counterparty with consistent payment discipline, strong legal enforceability profile, and stable multi-product exposure history across GCC jurisdictions.',
  financialSnapshot: [
    { label: 'Annual Revenue', value: 'AED 5.8B' },
    { label: 'Net Worth', value: 'AED 12.4B' },
    { label: 'Avg. Payment Cycle', value: '26 Days' },
    { label: 'Default Incidents (5Y)', value: '0' },
  ],
  latestTransactions: [
    'Receivables assignment validated – AED 12.0M (Jun 2026)',
    'Facility rollover completed – AED 18.5M (May 2026)',
    'Disbursement settled within SLA – AED 7.2M (Apr 2026)',
  ],
  openFacilities: [
    'RF-2026-0084 | Receivables Financing | AED 34.0M | Active',
    'SCF-2026-0021 | Supply Chain Finance | AED 22.5M | Active',
    'POF-2025-0193 | Purchase Order Finance | AED 11.0M | Active',
  ],
};

const intelligencePlaceholders = [
  'Credit Intelligence',
  'Legal Intelligence',
  'Fraud Intelligence',
  'Promoter Intelligence',
  'Document Intelligence',
];

const recentActivity = [
  {
    time: '09:15',
    title: 'Counterparty limit renewal approved',
    detail: 'Mashreq Bank PJSC annual line validation completed by credit committee.',
  },
  {
    time: '10:40',
    title: 'Watchlist escalation triggered',
    detail: 'Northern Infrastructure Buyers Ltd. moved to enhanced legal monitoring.',
  },
  {
    time: '12:05',
    title: 'Trust score recalibration published',
    detail: 'Blue Horizon Commodities DMCC trust score adjusted after variance review.',
  },
  {
    time: '14:20',
    title: 'Open facility covenant review',
    detail: 'Summit Industrial Procurement Co. covenant exception submitted for approval.',
  },
];

const nextActions = [
  {
    id: 'cp-act-001',
    title: 'Review watchlist counterparties with legal team',
    description: 'Validate enforceability posture and update mitigation pathways for all watchlist entries.',
    owner: 'Risk & Legal',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    priority: 'critical' as const,
    status: 'in-progress' as const,
  },
  {
    id: 'cp-act-002',
    title: 'Approve revised counterparty trust thresholds',
    description: 'Finalize institutional thresholds for low-confidence counterparties before next committee cycle.',
    owner: 'Credit Committee Secretariat',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high' as const,
    status: 'pending' as const,
  },
  {
    id: 'cp-act-003',
    title: 'Prepare quarterly obligor concentration report',
    description: 'Issue concentration, diversification and exposure movement snapshot for executive review.',
    owner: 'Portfolio Analytics',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium' as const,
    status: 'pending' as const,
  },
];

export default function CounterpartiesPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionCard title="Counterparties Header" icon={Building2}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Workspace</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">ATLAS Counterparties Module</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Institutional Scope</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">Obligors, Buyers, Guarantors, Sellers</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Coverage</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">GCC + Regional Trade Corridors</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Operational State</p>
              <p className="mt-2 text-sm font-semibold text-emerald-300">Continuous Monitoring</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Search & Filters" icon={SlidersHorizontal}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                <Search className="h-4 w-4 text-cyan-300" />
                <input
                  type="text"
                  placeholder="Search by name, facility, obligor type"
                  className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                />
              </div>
            </div>
            <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
              <option>Country</option>
              <option>UAE</option>
              <option>Saudi Arabia</option>
              <option>Qatar</option>
              <option>Bahrain</option>
              <option>Oman</option>
            </select>
            <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
              <option>Industry</option>
              <option>Banking</option>
              <option>Logistics</option>
              <option>Healthcare</option>
              <option>Commodities</option>
              <option>Construction</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
                <option>Rating</option>
                <option>AAA</option>
                <option>AA</option>
                <option>A</option>
                <option>BBB</option>
                <option>BB</option>
              </select>
              <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
                <option>Status</option>
                <option>Active</option>
                <option>Watchlist</option>
                <option>Pending Review</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Portfolio KPIs" icon={ShieldCheck}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {portfolioKpis.map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{kpi.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{kpi.value}</p>
                <p className="mt-1 text-xs text-slate-500">{kpi.note}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,1fr)]">
          <SectionCard title="Counterparty Table" icon={Building2} className="h-full">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">Country</th>
                    <th className="px-3 py-3">Industry</th>
                    <th className="px-3 py-3">Exposure</th>
                    <th className="px-3 py-3">Internal Rating</th>
                    <th className="px-3 py-3">Trust Score</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {counterparties.map((counterparty) => (
                    <tr key={counterparty.name} className="hover:bg-slate-900/60">
                      <td className="px-3 py-3 font-medium text-slate-100">{counterparty.name}</td>
                      <td className="px-3 py-3">{counterparty.country}</td>
                      <td className="px-3 py-3">{counterparty.industry}</td>
                      <td className="px-3 py-3">{counterparty.exposure}</td>
                      <td className="px-3 py-3">{counterparty.internalRating}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs">
                          {counterparty.trustScore}
                        </span>
                      </td>
                      <td className="px-3 py-3">{counterparty.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <div className="space-y-6">
            <SectionCard title="Profile Preview Panel" icon={FileStack}>
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Company Summary</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">{profilePreview.companyName}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {profilePreview.relationshipType} | Relationship Since {profilePreview.relationshipSince}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{profilePreview.summary}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Financial Snapshot</p>
                  <div className="mt-3 grid gap-2">
                    {profilePreview.financialSnapshot.map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="font-semibold text-slate-100">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Latest Transactions</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {profilePreview.latestTransactions.map((transaction) => (
                      <li key={transaction}>{transaction}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Open Facilities</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {profilePreview.openFacilities.map((facility) => (
                      <li key={facility}>{facility}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <TrustScore score={profilePreview.companyName ? 95 : 0} label="Counterparty Trust" size="sm" />
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <SectionCard title="AI Intelligence Summary" icon={ShieldCheck}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {intelligencePlaceholders.map((engine) => (
              <div key={engine} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm font-semibold text-slate-100">{engine}</p>
                <p className="mt-2 text-xs text-slate-500">Placeholder – engine integration pending orchestration enablement.</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <SectionCard title="Recent Activity" icon={Activity}>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={`${item.time}-${item.title}`} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                    <span className="text-xs text-slate-500">{item.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <ActionPanel actions={nextActions} title="Next Recommended Actions" />
        </div>
      </div>
    </div>
  );
}
