'use client';

import {
  Activity,
  Building2,
  Handshake,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserSquare2,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import TrustScore from '@/components/atlas/intelligence/TrustScore';
import ActionPanel from '@/components/atlas/intelligence/ActionPanel';

const portfolioKpis = [
  {
    label: 'Total Partners',
    value: '94',
    note: 'Banks, brokers, insurers, legal and strategic alliances',
  },
  {
    label: 'Active Banks',
    value: '27',
    note: 'Funding, collections and settlement counterparties',
  },
  {
    label: 'Active Brokers',
    value: '31',
    note: 'Origination and transaction facilitation network',
  },
  {
    label: 'Strategic Partners',
    value: '18',
    note: 'Long-term institutional ecosystem partners',
  },
];

const partners = [
  {
    name: 'Mashreq Bank PJSC',
    type: 'Bank',
    country: 'UAE',
    relationship: 'Strategic',
    dealsSupported: 124,
    trustScore: 94,
    status: 'Active',
  },
  {
    name: 'FinQy Financial Brokers LLC',
    type: 'Broker',
    country: 'UAE',
    relationship: 'Core Origination',
    dealsSupported: 86,
    trustScore: 88,
    status: 'Active',
  },
  {
    name: 'Gulf Trade Assurance Co.',
    type: 'Insurance',
    country: 'Saudi Arabia',
    relationship: 'Risk Mitigation',
    dealsSupported: 47,
    trustScore: 82,
    status: 'Active',
  },
  {
    name: 'Crescent Legal Advisors SPC',
    type: 'Legal',
    country: 'Bahrain',
    relationship: 'Panel Counsel',
    dealsSupported: 39,
    trustScore: 79,
    status: 'Watchlist',
  },
  {
    name: 'Blue Horizon Trade Facilitators',
    type: 'Broker',
    country: 'Qatar',
    relationship: 'Regional',
    dealsSupported: 28,
    trustScore: 73,
    status: 'Pending Review',
  },
  {
    name: 'Northern Settlement Services Ltd.',
    type: 'Strategic',
    country: 'Oman',
    relationship: 'Collections Infrastructure',
    dealsSupported: 52,
    trustScore: 76,
    status: 'Active',
  },
];

const profile = {
  partnerName: 'Mashreq Bank PJSC',
  overview:
    'Tier-1 institutional banking partner supporting assignment validation, collections routing, and settlement controls for multi-jurisdiction receivables financing programmes.',
  relationshipManager: 'Aisha Rahman (Institutional Partnerships)',
  productsSupported: [
    'Receivables Financing',
    'Supply Chain Finance',
    'Invoice Discounting',
    'Collections Infrastructure',
  ],
  currentExposure: 'AED 124.0M',
  recentDeals: [
    'DNX-2026-000188 | AED 11.2M | Closed',
    'DNX-2026-000173 | AED 9.4M | Funded',
    'DNX-2026-000161 | AED 13.8M | In Collections',
  ],
};

const intelligenceCards = [
  { title: 'Operational Rating', detail: 'Placeholder - operational stability model pending integration.' },
  { title: 'Legal Status', detail: 'Placeholder - legal registry and enforceability checks pending integration.' },
  { title: 'Compliance', detail: 'Placeholder - sanctions and regulatory compliance feed pending integration.' },
  { title: 'Performance', detail: 'Placeholder - deal delivery and SLA performance index pending integration.' },
  { title: 'Risk', detail: 'Placeholder - partner risk analytics and exposure model pending integration.' },
];

const recentActivity = [
  {
    time: '09:35',
    title: 'Bank SLA review completed',
    detail: 'Mashreq Bank PJSC settlement SLA renewed for Q3 operating cycle.',
  },
  {
    time: '11:10',
    title: 'Broker concentration alert generated',
    detail: 'Origination concentration threshold crossed for FinQy Financial Brokers LLC.',
  },
  {
    time: '12:45',
    title: 'Compliance refresh initiated',
    detail: 'Annual compliance validation opened for Gulf Trade Assurance Co.',
  },
  {
    time: '14:05',
    title: 'Relationship status moved to watchlist',
    detail: 'Crescent Legal Advisors SPC downgraded pending documentation closure.',
  },
];

const nextActions = [
  {
    id: 'p-act-001',
    title: 'Complete watchlist legal partner review',
    description: 'Finalize legal quality assessment and remediation pathway for watchlist entities.',
    owner: 'Legal Governance',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    priority: 'critical' as const,
    status: 'in-progress' as const,
  },
  {
    id: 'p-act-002',
    title: 'Rebalance broker origination concentration',
    description: 'Distribute new deal intake to maintain institutional concentration thresholds.',
    owner: 'Partnerships Office',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high' as const,
    status: 'pending' as const,
  },
  {
    id: 'p-act-003',
    title: 'Issue quarterly partner performance pack',
    description: 'Publish partner performance, trust and exposure scorecard for committee review.',
    owner: 'Portfolio Intelligence',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium' as const,
    status: 'pending' as const,
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionCard title="Partners Header" icon={Handshake}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Workspace</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">ATLAS Partners Module</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Institutional Scope</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">Banking, Brokerage, Legal, Strategic Ecosystem</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Coverage</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">GCC + Cross-Border Trade Corridors</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Operating State</p>
              <p className="mt-2 text-sm font-semibold text-emerald-300">Ecosystem Monitoring Active</p>
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
                  placeholder="Search by partner name, relationship, deal support"
                  className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                />
              </div>
            </div>
            <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
              <option>Partner Type</option>
              <option>Bank</option>
              <option>Broker</option>
              <option>Insurance</option>
              <option>Legal</option>
              <option>Strategic</option>
            </select>
            <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
              <option>Country</option>
              <option>UAE</option>
              <option>Saudi Arabia</option>
              <option>Qatar</option>
              <option>Bahrain</option>
              <option>Oman</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
                <option>Status</option>
                <option>Active</option>
                <option>Watchlist</option>
                <option>Pending Review</option>
              </select>
              <select className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none">
                <option>Rating</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Review</option>
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
          <SectionCard title="Partner Directory Table" icon={Building2} className="h-full">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-3">Partner Name</th>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Country</th>
                    <th className="px-3 py-3">Relationship</th>
                    <th className="px-3 py-3">Deals Supported</th>
                    <th className="px-3 py-3">Trust Score</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {partners.map((partner) => (
                    <tr key={partner.name} className="hover:bg-slate-900/60">
                      <td className="px-3 py-3 font-medium text-slate-100">{partner.name}</td>
                      <td className="px-3 py-3">{partner.type}</td>
                      <td className="px-3 py-3">{partner.country}</td>
                      <td className="px-3 py-3">{partner.relationship}</td>
                      <td className="px-3 py-3">{partner.dealsSupported}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-xs">
                          {partner.trustScore}
                        </span>
                      </td>
                      <td className="px-3 py-3">{partner.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Partner Profile Panel" icon={UserSquare2}>
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Overview</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{profile.partnerName}</p>
                <p className="mt-2 text-sm text-slate-300">{profile.overview}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Relationship Manager</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{profile.relationshipManager}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Products Supported</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {profile.productsSupported.map((product) => (
                    <li key={product}>{product}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Current Exposure</p>
                <p className="mt-2 text-lg font-semibold text-slate-100">{profile.currentExposure}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Recent Deals</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {profile.recentDeals.map((deal) => (
                    <li key={deal}>{deal}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <TrustScore score={90} label="Partner Trust" size="sm" />
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Partner Intelligence" icon={ShieldCheck}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {intelligenceCards.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                <p className="mt-2 text-xs text-slate-500">{item.detail}</p>
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
