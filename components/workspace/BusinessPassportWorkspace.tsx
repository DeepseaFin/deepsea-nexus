'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BriefcaseBusiness,
  Building2,
  FileText,
  Landmark,
  Scale,
  ShieldCheck,
  UserCircle2,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type PassportTab =
  | 'Overview'
  | 'Ownership'
  | 'Licences'
  | 'Banking'
  | 'Financials'
  | 'Facilities'
  | 'Compliance'
  | 'Documents'
  | 'Timeline';

const tabs: readonly PassportTab[] = [
  'Overview',
  'Ownership',
  'Licences',
  'Banking',
  'Financials',
  'Facilities',
  'Compliance',
  'Documents',
  'Timeline',
];

const healthIndicators = [
  { label: 'Compliance', value: 'Strong' },
  { label: 'Financial Strength', value: 'Stable' },
  { label: 'KYC Status', value: 'Current' },
  { label: 'AML Status', value: 'Clear' },
  { label: 'Risk Rating', value: 'Moderate' },
  { label: 'ESG', value: 'Aligned' },
  { label: 'Overall Passport Score', value: '89 / 100' },
] as const;

const companyProfile = [
  { label: 'Business Activities', value: 'Trade finance origination, commodity distribution, and cross-border settlement services.' },
  { label: 'Products', value: 'Structured trade facilities, receivables-backed financing, and supply chain programs.' },
  { label: 'Markets Served', value: 'GCC, North Africa, and South Asia corridors.' },
  { label: 'Corporate Structure Summary', value: 'Privately held group with regulated operating entities and centralized treasury governance.' },
] as const;

const passportSnapshot = [
  { label: 'Registered Office', value: 'Dubai International Financial Centre, Dubai, UAE' },
  { label: 'Website', value: 'www.crescenttradeholdings.ae' },
  { label: 'Email', value: 'compliance@crescenttradeholdings.ae' },
  { label: 'Phone', value: '+971 4 555 0142' },
  { label: 'Auditor', value: 'Al Majid & Partners Audit' },
  { label: 'Legal Advisor', value: 'Sultan & Hayek Legal Consultants' },
  { label: 'External Rating', value: 'BBB (Regional)' },
  { label: 'Review Cycle', value: 'Quarterly' },
] as const;

export default function BusinessPassportWorkspace() {
  const [activeTab, setActiveTab] = useState<PassportTab>('Overview');

  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">Executive Identity Header</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Company Name</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Crescent Trade Holdings FZ-LLC</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Legal Entity</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">Crescent Trade Holdings FZ-LLC</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Registration Number</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">DIFC-CTH-2023-1148</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Jurisdiction</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">DIFC, United Arab Emirates</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Incorporation Date</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">14 Feb 2023</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Industry</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">International Trade Finance</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Country</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">United Arab Emirates</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Operating Status</p>
              </div>
              <p className="text-sm font-semibold text-emerald-200">Active</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-2">
                <UserCircle2 className="h-4 w-4 text-cyan-300" />
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Relationship Manager</p>
              </div>
              <p className="text-sm font-semibold text-slate-100">Deepak Singh</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-cyan-300" />
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Business Passport Score</p>
              </div>
              <p className="text-sm font-semibold text-slate-100">89 / 100</p>
            </div>

            <div className="pt-2">
              <Link
                href="/atlas/relationship-workspace-v2"
                className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
              >
                Relationship Workspace
              </Link>
              <button
                type="button"
                className="ml-3 inline-flex items-center justify-center rounded-full border border-slate-700/70 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-100"
              >
                Documents
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <BriefcaseBusiness className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Executive Summary</h3>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
          <p className="text-sm text-slate-300">
            Crescent Trade Holdings FZ-LLC is a regional institutional trade platform focused on structured receivables finance and
            cross-border settlement support for commodity and industrial supply chains.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Core Activities</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">Trade finance, receivables programs, settlement support</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Years in Operation</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">3</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Countries Served</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">11</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Employees</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">420</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 sm:col-span-2 xl:col-span-2">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Annual Turnover</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">USD 148 Million</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 sm:col-span-2 xl:col-span-2">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">AI Executive Summary</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                This institution has maintained a strong banking relationship with satisfactory compliance and stable financial
                performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Business Health Indicators</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {healthIndicators.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <FileText className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Navigation Tabs</h3>
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
          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Company Profile</p>
              <div className="mt-4 space-y-3">
                {companyProfile.map((item) => (
                  <article key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-100">{item.value}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Passport Snapshot</p>
              <div className="mt-4 divide-y divide-slate-800 border-t border-slate-800/80">
                {passportSnapshot.map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-100">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}
