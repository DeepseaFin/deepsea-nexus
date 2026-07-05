'use client';

import {
  Activity,
  CalendarClock,
  Download,
  FileBarChart2,
  FolderKanban,
  Globe2,
  Landmark,
  Layers3,
  ShieldAlert,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

const topKpis = [
  { label: 'Total Portfolio', value: 'AED 2.46B', note: 'Live financed and managed exposure' },
  { label: 'Assets Under Management', value: 'AED 1.92B', note: 'Institutional managed assets' },
  { label: 'Average DCI', value: '84', note: 'Weighted confidence index' },
  { label: 'Portfolio Yield', value: '16.8%', note: 'Net annualized portfolio return' },
  { label: 'Average Tenure', value: '78 Days', note: 'Weighted facility duration' },
  { label: 'Default Ratio', value: '1.9%', note: 'Trailing 12-month portfolio default' },
  { label: 'Collections Efficiency', value: '94.2%', note: 'On-time collections performance' },
];

const reportCards = [
  {
    name: 'Portfolio Report',
    description: 'Exposure, performance and utilization across all active facilities.',
    frequency: 'Daily',
    status: 'Available',
  },
  {
    name: 'Credit Report',
    description: 'Credit quality migration, risk rating movement and covenant posture.',
    frequency: 'Weekly',
    status: 'Scheduled',
  },
  {
    name: 'Collections Report',
    description: 'Due vs collected analysis, delay buckets and recovery trajectory.',
    frequency: 'Daily',
    status: 'Available',
  },
  {
    name: 'Investor Report',
    description: 'Investor capital deployment, return realization and distribution metrics.',
    frequency: 'Monthly',
    status: 'In Review',
  },
  {
    name: 'Bank Report',
    description: 'Bank partner utilization, settlement quality and exposure concentration.',
    frequency: 'Weekly',
    status: 'Available',
  },
  {
    name: 'Regulatory Report',
    description: 'Compliance and regulatory disclosure package by jurisdiction.',
    frequency: 'Monthly',
    status: 'Scheduled',
  },
  {
    name: 'Management MIS',
    description: 'Executive management dashboard covering performance and strategic KPIs.',
    frequency: 'Weekly',
    status: 'Available',
  },
  {
    name: 'AI Intelligence Report',
    description: 'Consolidated engine insights, anomalies and recommendation summaries.',
    frequency: 'Daily',
    status: 'In Review',
  },
];

const recentReports = [
  'Portfolio Report - 05 Jul 2026 08:30',
  'Collections Report - 05 Jul 2026 09:10',
  'Management MIS - 04 Jul 2026 18:00',
  'AI Intelligence Report - 04 Jul 2026 20:15',
];

const scheduledReports = [
  'Credit Report - Mon 07:00',
  'Regulatory Report - 01 Aug 2026',
  'Investor Report - 31 Jul 2026',
  'Bank Report - Tue 09:00',
];

const quickExports = ['PDF Pack', 'Excel Workbook', 'Board Deck Snapshot', 'CSV Extract'];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionCard title="Reports & Analytics" icon={FileBarChart2}>
          <p className="text-sm text-slate-300">
            Institutional reporting, portfolio intelligence and management dashboards.
          </p>
        </SectionCard>

        <SectionCard title="Top KPI Cards" icon={Landmark}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {topKpis.map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{kpi.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-100">{kpi.value}</p>
                <p className="mt-1 text-xs text-slate-500">{kpi.note}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
          <div className="space-y-6">
            <SectionCard title="Portfolio Overview" icon={FolderKanban}>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Active Deals</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-100">286</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Ready to Fund</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-300">92</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Under Review</p>
                  <p className="mt-2 text-2xl font-semibold text-amber-300">41</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Industry Distribution" icon={Layers3}>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Placeholder Panel</p>
                <p className="mt-2 text-sm text-slate-300">
                  Industry distribution chart placeholder. No chart library enabled in this sprint.
                </p>
              </div>
            </SectionCard>

            <SectionCard title="Country Distribution" icon={Globe2}>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Placeholder Panel</p>
                <p className="mt-2 text-sm text-slate-300">
                  Country distribution chart placeholder. Geographic concentration snapshot to be connected later.
                </p>
              </div>
            </SectionCard>

            <SectionCard title="Product Distribution" icon={FileBarChart2}>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Placeholder Panel</p>
                <p className="mt-2 text-sm text-slate-300">
                  Product mix chart placeholder for receivables financing, PO finance, and supply chain products.
                </p>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="Risk Heat Map" icon={ShieldAlert}>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Placeholder Panel</p>
                <p className="mt-2 text-sm text-slate-300">Risk concentration heat map placeholder.</p>
              </div>
            </SectionCard>

            <SectionCard title="Funding Pipeline" icon={Activity}>
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                <p>Pipeline Size: AED 418M</p>
                <p>Near-Term Funding: AED 126M (next 7 days)</p>
                <p>Conditional Cases: AED 83M</p>
              </div>
            </SectionCard>

            <SectionCard title="Upcoming Maturities" icon={CalendarClock}>
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                <p>0-7 Days: AED 72M</p>
                <p>8-15 Days: AED 109M</p>
                <p>16-30 Days: AED 186M</p>
              </div>
            </SectionCard>

            <SectionCard title="Collections Due" icon={Activity}>
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                <p>Due Today: AED 18.3M</p>
                <p>Due This Week: AED 64.5M</p>
                <p>Overdue Monitor: AED 7.9M</p>
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <SectionCard title="Available Reports" icon={FileBarChart2}>
            <div className="grid gap-4 md:grid-cols-2">
              {reportCards.map((report) => (
                <div key={report.name} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-100">{report.name}</p>
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300">
                      {report.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{report.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                    Frequency: {report.frequency}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="space-y-6">
            <SectionCard title="Recent Reports" icon={Activity}>
              <ul className="space-y-2 text-sm text-slate-300">
                {recentReports.map((item) => (
                  <li key={item} className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Scheduled Reports" icon={CalendarClock}>
              <ul className="space-y-2 text-sm text-slate-300">
                {scheduledReports.map((item) => (
                  <li key={item} className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Quick Export" icon={Download}>
              <div className="grid gap-2">
                {quickExports.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-left text-sm text-slate-200 transition hover:border-cyan-500/40 hover:bg-slate-900"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
