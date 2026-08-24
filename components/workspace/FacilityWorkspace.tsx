'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  FileCheck2,
  HandCoins,
  Landmark,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type FacilityTab = 'Overview' | 'Pipeline' | 'Approvals' | 'Monitoring' | 'Collateral' | 'Pricing' | 'Documents' | 'Audit';

type FacilityRow = {
  name: string;
  type: string;
  limit: string;
  outstanding: string;
  available: string;
  expiry: string;
  status: 'Active' | 'Review Due' | 'Pending Renewal';
};

const tabs: readonly FacilityTab[] = [
  'Overview',
  'Pipeline',
  'Approvals',
  'Monitoring',
  'Collateral',
  'Pricing',
  'Documents',
  'Audit',
];

const facilityHeaderMetrics = [
  { label: 'Total Approved Limit', value: 'USD 42.0 Million' },
  { label: 'Utilized Limit', value: 'USD 29.8 Million' },
  { label: 'Available Limit', value: 'USD 12.2 Million' },
  { label: 'No. of Facilities', value: '6' },
  { label: 'Relationship Health', value: 'Strong' },
] as const;

const portfolioOverview = [
  { label: 'Trade Finance', value: 'USD 11.2 Million' },
  { label: 'Invoice Discounting', value: 'USD 8.4 Million' },
  { label: 'Forfaiting', value: 'USD 3.1 Million' },
  { label: 'LC', value: 'USD 4.6 Million' },
  { label: 'BG', value: 'USD 2.5 Million' },
  { label: 'Total Exposure', value: 'USD 29.8 Million' },
] as const;

const facilityList: readonly FacilityRow[] = [
  {
    name: 'Crescent Trade Revolving Facility',
    type: 'Trade Finance',
    limit: 'USD 12.0 Million',
    outstanding: 'USD 9.6 Million',
    available: 'USD 2.4 Million',
    expiry: '31 Dec 2026',
    status: 'Active',
  },
  {
    name: 'Invoice Discounting Programme',
    type: 'Invoice Discounting',
    limit: 'USD 10.0 Million',
    outstanding: 'USD 8.4 Million',
    available: 'USD 1.6 Million',
    expiry: '30 Sep 2026',
    status: 'Pending Renewal',
  },
  {
    name: 'Export Forfaiting Window',
    type: 'Forfaiting',
    limit: 'USD 5.0 Million',
    outstanding: 'USD 3.1 Million',
    available: 'USD 1.9 Million',
    expiry: '15 Nov 2026',
    status: 'Active',
  },
  {
    name: 'Import LC Line',
    type: 'LC',
    limit: 'USD 8.0 Million',
    outstanding: 'USD 5.7 Million',
    available: 'USD 2.3 Million',
    expiry: '20 Oct 2026',
    status: 'Review Due',
  },
  {
    name: 'Performance BG Facility',
    type: 'BG',
    limit: 'USD 4.0 Million',
    outstanding: 'USD 2.5 Million',
    available: 'USD 1.5 Million',
    expiry: '10 Jan 2027',
    status: 'Active',
  },
  {
    name: 'Supply Chain Support Facility',
    type: 'Trade Finance',
    limit: 'USD 3.0 Million',
    outstanding: 'USD 0.5 Million',
    available: 'USD 2.5 Million',
    expiry: '28 Feb 2027',
    status: 'Active',
  },
] as const;

const riskMonitorItems = [
  { label: 'Expiring in 30 days', value: '2 Facilities' },
  { label: 'Over-utilized', value: '1 Facility' },
  { label: 'Pending renewal', value: '2 Facilities' },
  { label: 'Credit review due', value: '1 Facility' },
  { label: 'Collateral pending', value: '3 Items' },
] as const;

const statusClassMap: Record<FacilityRow['status'], string> = {
  Active: 'border-emerald-700/40 bg-emerald-900/30 text-emerald-200',
  'Review Due': 'border-amber-700/40 bg-amber-900/30 text-amber-200',
  'Pending Renewal': 'border-cyan-700/40 bg-cyan-900/30 text-cyan-200',
};

export default function FacilityWorkspace() {
  const [activeTab, setActiveTab] = useState<FacilityTab>('Overview');

  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Facility Header</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Customer</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Crescent Trade Holdings FZ-LLC</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {facilityHeaderMetrics.map((item) => (
                <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Portfolio Status</p>
                </div>
                <p className="text-sm font-semibold text-emerald-200">Operationally Stable</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HandCoins className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Avg Utilization</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">71%</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Credit Reviews Open</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">2</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
              >
                New Facility
              </button>
              <button
                type="button"
                className="ml-3 inline-flex items-center justify-center rounded-full border border-slate-700/70 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-100"
              >
                Credit Decision
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Portfolio Overview</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {portfolioOverview.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <TrendingUp className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Facility List</h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900/70 text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Facility Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Limit</th>
                <th className="px-4 py-3">Outstanding</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Primary Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {facilityList.map((item) => (
                <tr key={item.name} className="hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-semibold text-slate-100">{item.name}</td>
                  <td className="px-4 py-3 text-slate-300">{item.type}</td>
                  <td className="px-4 py-3 text-slate-300">{item.limit}</td>
                  <td className="px-4 py-3 text-slate-300">{item.outstanding}</td>
                  <td className="px-4 py-3 text-slate-300">{item.available}</td>
                  <td className="px-4 py-3 text-slate-300">{item.expiry}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusClassMap[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100"
                    >
                      Continue &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <AlertTriangle className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Facility Risk Monitor</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {riskMonitorItems.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <HandCoins className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Recommended Action</h3>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Invoice Discounting Programme</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Outstanding</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">USD 8.4 Million</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Limit</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">USD 10 Million</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Utilization</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">84%</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-300">Renew annual limit before 30 September.</p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
          >
            Continue Working &rarr;
          </button>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Building2 className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Tabs</h3>
        </div>

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
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Overview</p>
            <p className="mt-2 text-sm text-slate-300">Facility portfolio summary is displayed in the sections above for this sprint.</p>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}
