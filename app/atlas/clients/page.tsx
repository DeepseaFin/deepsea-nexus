'use client';

import { Search, Users, Building2, Activity, ClipboardList, UserRound } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

const clientKpis = [
  { label: 'Total Active Clients', value: '146', note: 'Across all jurisdictions' },
  { label: 'Funding Exposure', value: 'AED 482.6M', note: 'Current outstanding portfolio' },
  { label: 'Avg. Collection Cycle', value: '34 Days', note: 'Weighted institutional average' },
  { label: 'High-Risk Clients', value: '11', note: 'Under enhanced monitoring' },
];

const clients = [
  {
    id: 'CL-000194',
    name: 'Apex Industrial Supplies LLC',
    country: 'UAE',
    product: 'Receivables Financing',
    status: 'Active',
    exposure: 'AED 18.4M',
    riskBand: 'Low',
  },
  {
    id: 'CL-000207',
    name: 'Falcon Maritime Services WLL',
    country: 'Qatar',
    product: 'Invoice Discounting',
    status: 'Watchlist',
    exposure: 'AED 9.1M',
    riskBand: 'Medium',
  },
  {
    id: 'CL-000173',
    name: 'Nexbridge Food Distribution SPC',
    country: 'Bahrain',
    product: 'Working Capital',
    status: 'Active',
    exposure: 'AED 6.7M',
    riskBand: 'Low',
  },
  {
    id: 'CL-000226',
    name: 'Summit Infrastructure Trading LLC',
    country: 'Saudi Arabia',
    product: 'Supply Chain Finance',
    status: 'Pending Review',
    exposure: 'AED 22.3M',
    riskBand: 'High',
  },
  {
    id: 'CL-000231',
    name: 'Crescent Health Procurement Ltd',
    country: 'UAE',
    product: 'Purchase Order Finance',
    status: 'Active',
    exposure: 'AED 11.9M',
    riskBand: 'Medium',
  },
];

const recentActivity = [
  {
    time: '09:20',
    title: 'Client KYC refresh completed',
    detail: 'Apex Industrial Supplies LLC annual review accepted.',
  },
  {
    time: '10:05',
    title: 'Exposure threshold alert',
    detail: 'Summit Infrastructure Trading LLC crossed internal watch threshold.',
  },
  {
    time: '11:10',
    title: 'Limit enhancement request',
    detail: 'Crescent Health Procurement Ltd requested AED 4M limit increase.',
  },
  {
    time: '12:40',
    title: 'Collections variance observed',
    detail: 'Falcon Maritime Services WLL payment cycle extended by 6 days.',
  },
];

const nextActions = [
  {
    title: 'Review watchlist client exposure',
    owner: 'Credit Risk Team',
    due: 'Today',
  },
  {
    title: 'Approve updated onboarding documents',
    owner: 'Compliance',
    due: 'Tomorrow',
  },
  {
    title: 'Schedule relationship review call',
    owner: 'Relationship Manager',
    due: 'Within 48 hours',
  },
];

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionCard title="Clients Header" icon={Users}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Workspace</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">ATLAS Clients Module</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Scope</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">Institutional Client Portfolio</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Jurisdictions</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">GCC + Select International</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Operational State</p>
              <p className="mt-2 text-sm font-semibold text-emerald-300">Monitoring Active</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Search Bar" icon={Search}>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
              <Search className="h-4 w-4 text-cyan-300" />
              <input
                type="text"
                placeholder="Search by client name, ID, country, product, or relationship manager"
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Client KPI Cards" icon={Building2}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {clientKpis.map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{kpi.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{kpi.value}</p>
                <p className="mt-1 text-xs text-slate-500">{kpi.note}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
          <SectionCard title="Client List Table" icon={Building2} className="h-full">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-3">Client</th>
                    <th className="px-3 py-3">Country</th>
                    <th className="px-3 py-3">Product</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Exposure</th>
                    <th className="px-3 py-3">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-900/60">
                      <td className="px-3 py-3">
                        <p className="font-medium text-slate-100">{client.name}</p>
                        <p className="text-xs text-slate-500">{client.id}</p>
                      </td>
                      <td className="px-3 py-3">{client.country}</td>
                      <td className="px-3 py-3">{client.product}</td>
                      <td className="px-3 py-3">{client.status}</td>
                      <td className="px-3 py-3">{client.exposure}</td>
                      <td className="px-3 py-3">{client.riskBand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <div className="space-y-6">
            <SectionCard title="Client Profile Preview" icon={UserRound}>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
                Profile engine placeholder.
                Select a client from the table to display institutional profile, relationship history, and exposure posture.
              </div>
            </SectionCard>

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

            <SectionCard title="Next Actions" icon={ClipboardList}>
              <div className="space-y-3">
                {nextActions.map((action) => (
                  <div key={action.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-sm font-semibold text-slate-100">{action.title}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                      <span>Owner: {action.owner}</span>
                      <span>Due: {action.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
