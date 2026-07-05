'use client';

import {
  Activity,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  FilePlus2,
  FolderPlus,
  Radar,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import ActionPanel from '@/components/atlas/intelligence/ActionPanel';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import TrustScore from '@/components/atlas/intelligence/TrustScore';

const executiveKpis = [
  { label: 'Active Financing Transactions', value: '286', note: 'Across all active desks' },
  { label: 'Funding Pipeline', value: 'AED 418M', note: 'In credit, legal, and approval stages' },
  { label: 'Pending Approvals', value: '41', note: 'Committee and legal sign-off pending' },
  { label: 'Collections Due Today', value: 'AED 18.3M', note: 'Expected collection obligations' },
  { label: 'Average Deal Confidence Index', value: '84', note: 'Weighted portfolio DCI signal' },
  { label: 'Portfolio Yield', value: '16.8%', note: 'Net annualized yield' },
  { label: 'Portfolio Outstanding', value: 'AED 1.92B', note: 'Current deployed and revolving base' },
];

const todayPriorities = [
  { label: 'Deals awaiting approval', value: '17', note: 'Priority committee stack' },
  { label: 'Missing documentation', value: '23', note: 'Checklist exceptions open' },
  { label: 'Legal review pending', value: '12', note: 'Awaiting final legal markups' },
  { label: 'Funding scheduled today', value: '9', note: 'Treasury slots reserved' },
  { label: 'High-risk transactions', value: '8', note: 'Escalated for management review' },
];

const livePipeline = [
  { stage: 'Lead', count: 84, progress: 35, status: 'New opportunities intake' },
  { stage: 'Client Onboarding', count: 56, progress: 48, status: 'KYC and setup in progress' },
  { stage: 'Credit Review', count: 43, progress: 58, status: 'Risk and credit scoring review' },
  { stage: 'Legal', count: 31, progress: 66, status: 'Documentation and enforceability checks' },
  { stage: 'Approval', count: 24, progress: 74, status: 'Committee decision pipeline' },
  { stage: 'Funding', count: 19, progress: 83, status: 'Treasury release and disbursement' },
  { stage: 'Monitoring', count: 118, progress: 92, status: 'Live post-funding portfolio supervision' },
];

const portfolioIntelligence = [
  { title: 'Industry Exposure', value: 'Trading 28% | Logistics 24% | Healthcare 17%', note: 'Placeholder exposure card' },
  { title: 'Country Exposure', value: 'UAE 39% | KSA 21% | Qatar 16%', note: 'Placeholder exposure card' },
  { title: 'Product Mix', value: 'RF 44% | SCF 25% | POF 19%', note: 'Placeholder product concentration card' },
  { title: 'Largest Counterparties', value: 'Mashreq, Gulf Maritime, Northern Infrastructure', note: 'Placeholder concentration card' },
  { title: 'Largest Clients', value: 'Apex, Crescent, Summit, Falcon', note: 'Placeholder concentration card' },
];

const intelligenceCentre = [
  { title: 'Latest AI Findings', detail: 'Two facilities flagged for covenant drift based on repayment cadence changes.' },
  { title: 'Fraud Alerts', detail: '1 counterparty submitted invoice sequence with duplicate metadata markers.' },
  { title: 'Credit Alerts', detail: '5 obligors moved from stable to watch posture after recent aging variance.' },
  { title: 'Legal Alerts', detail: '3 term sheets pending enforceability clause reconciliation across jurisdictions.' },
  { title: 'Portfolio Warnings', detail: 'Concentration threshold nearing limit in logistics corridor exposures.' },
  { title: 'Upcoming Maturities', detail: 'AED 72M maturing in the next 7 days across 14 financed facilities.' },
];

const recentActivity = [
  { time: '09:05', event: 'Client onboarded: Crescent Health Procurement Ltd completed KYC refresh.' },
  { time: '10:10', event: 'Documents uploaded: 8-file legal and invoice pack added to DNX-2026-000173.' },
  { time: '11:25', event: 'Term sheet generated: TS-2026-0048 prepared for committee review.' },
  { time: '13:05', event: 'Funding approved: AED 9.4M allocation cleared by treasury.' },
  { time: '14:45', event: 'Payment received: AED 2.1M settled into controlled collection account.' },
];

const assignedToMe = [
  {
    id: 'me-001',
    title: 'Review high-risk approval memo for DNX-2026-000188',
    description: 'Finalize recommendation notes before committee briefing.',
    owner: 'Deepak',
    dueDate: '2026-07-05T16:00:00.000Z',
    priority: 'critical' as const,
    status: 'in-progress' as const,
  },
  {
    id: 'me-002',
    title: 'Confirm legal exception closure for TS-2026-0047',
    description: 'Validate final enforceability clause wording with legal desk.',
    owner: 'Deepak',
    dueDate: '2026-07-06T10:00:00.000Z',
    priority: 'high' as const,
    status: 'pending' as const,
  },
];

const assignedToTeam = [
  {
    id: 'team-001',
    title: 'Collect missing onboarding documents for 6 active clients',
    description: 'Operations to complete mandatory document checklist.',
    owner: 'Operations Team',
    dueDate: '2026-07-05T12:00:00.000Z',
    priority: 'high' as const,
    status: 'in-progress' as const,
  },
  {
    id: 'team-002',
    title: 'Run portfolio warning review for logistics corridor concentration',
    description: 'Credit and risk teams to prepare mitigation options.',
    owner: 'Credit + Risk Team',
    dueDate: '2026-07-07T11:00:00.000Z',
    priority: 'medium' as const,
    status: 'pending' as const,
  },
];

const taskSummary = [
  { label: 'Assigned to Me', value: '7', note: 'Personal execution queue' },
  { label: 'Assigned to Team', value: '22', note: 'Cross-functional ownership' },
  { label: 'Overdue', value: '4', note: 'Immediate management attention required' },
  { label: 'Upcoming', value: '18', note: 'Due in next 72 hours' },
];

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionCard title="Executive Header" icon={Building2}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Greeting</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">Good Morning, Deepak</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Current Date</p>
              <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-100">
                <CalendarDays className="h-4 w-4 text-cyan-300" />
                {currentDate}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Business Health Indicator</p>
              <p className="mt-2 text-sm font-semibold text-emerald-300">Healthy with Monitored Exceptions</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Quick Actions</p>
              <div className="mt-2 grid gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-left text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/40"
                >
                  <FilePlus2 className="h-4 w-4" />
                  + New Financing Transaction
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                >
                  <FolderPlus className="h-4 w-4" />
                  + New Client
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                >
                  <ClipboardList className="h-4 w-4" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Executive KPIs" icon={TrendingUp}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {executiveKpis.map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{kpi.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{kpi.value}</p>
                <p className="mt-1 text-xs text-slate-500">{kpi.note}</p>
              </div>
            ))}

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Average Trust Score</p>
              <div className="mt-2">
                <TrustScore score={82} label="Portfolio Trust" size="sm" />
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <SectionCard title="Today's Priorities" icon={Briefcase}>
            <div className="grid gap-3 sm:grid-cols-2">
              {todayPriorities.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-100">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="ATLAS Intelligence Centre" icon={Sparkles}>
            <div className="space-y-3">
              {intelligenceCentre.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Live Deal Pipeline" icon={Radar}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {livePipeline.map((item) => (
              <div key={item.stage} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{item.stage}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{item.count}</p>
                <p className="mt-1 text-xs text-slate-500">{item.status}</p>
                <div className="mt-3 h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-cyan-500/70" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Portfolio Intelligence" icon={CircleDollarSign}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {portfolioIntelligence.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{item.title}</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
                <p className="mt-1 text-xs text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity" icon={Activity}>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={`${item.time}-${item.event}`} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                    <p className="text-sm font-semibold text-slate-100">{item.event}</p>
                  </div>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Tasks" icon={ShieldCheck}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {taskSummary.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{item.value}</p>
                <p className="mt-1 text-xs text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-6 xl:grid-cols-2">
            <ActionPanel actions={assignedToMe} title="Assigned to Me" />
            <ActionPanel actions={assignedToTeam} title="Assigned to Team" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}