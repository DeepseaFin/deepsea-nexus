'use client';

import {
  CalendarRange,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import { useDeal } from '@/components/atlas/common/DealContext';

type Tab =
  | 'Executive Dashboard'
  | 'Portfolio Analytics'
  | 'Funding Analytics'
  | 'Collections Analytics'
  | 'Risk Analytics'
  | 'Profitability'
  | 'Investor Reports'
  | 'Regulatory Reports'
  | 'Custom Reports';

type DealRecord = {
  id: string;
  client: string;
  buyer: string;
  country: string;
  industry: string;
  product: string;
  rm: string;
  bank: string;
  currency: string;
  risk: 'Low' | 'Medium' | 'High';
  exposure: number;
  funding: number;
  collections: number;
  yield: number;
  irr: number;
  status: 'Active' | 'Matured' | 'Watchlist';
  legalStatus: 'Cleared' | 'Pending' | 'Exception';
  fundingStatus: 'Completed' | 'Scheduled' | 'Pending';
  collectionStatus: 'Collected' | 'Expected' | 'Overdue';
  maturityBucket: '0-30' | '31-90' | '91-180' | '180+';
};

const TABS: Tab[] = [
  'Executive Dashboard',
  'Portfolio Analytics',
  'Funding Analytics',
  'Collections Analytics',
  'Risk Analytics',
  'Profitability',
  'Investor Reports',
  'Regulatory Reports',
  'Custom Reports',
];

const monthSeries = [
  { month: 'Jan', funding: 44, collections: 37, growth: 2.4, yield: 15.4 },
  { month: 'Feb', funding: 49, collections: 41, growth: 2.8, yield: 15.8 },
  { month: 'Mar', funding: 52, collections: 46, growth: 3.1, yield: 16.0 },
  { month: 'Apr', funding: 56, collections: 49, growth: 3.6, yield: 16.4 },
  { month: 'May', funding: 61, collections: 55, growth: 4.0, yield: 16.7 },
  { month: 'Jun', funding: 68, collections: 59, growth: 4.3, yield: 16.9 },
  { month: 'Jul', funding: 72, collections: 63, growth: 4.6, yield: 17.1 },
];

const topBuyers = [
  { name: 'Buyer ABC Logistics', exposure: 52, performance: 'Overdue' },
  { name: 'Northern Infrastructure Buyers', exposure: 44, performance: 'Watchlist' },
  { name: 'Crescent Procurement SPC', exposure: 31, performance: 'Stable' },
  { name: 'Blue Horizon Buyers Desk', exposure: 27, performance: 'Stable' },
  { name: 'Gulf Maritime Buyers Pool', exposure: 23, performance: 'Improving' },
];

const investorReports = [
  'Monthly Investor Pack',
  'Portfolio Summary',
  'Performance Report',
  'Risk Report',
  'Collections Report',
  'ESG Report',
];

const regulatoryReports = [
  'KYC',
  'AML',
  'Sanctions',
  'Exposure',
  'Large Exposure',
  'Audit',
  'Compliance',
];

function money(value: number, currency: string): string {
  return `${currency} ${Math.round(value).toLocaleString('en-US')}`;
}

function percent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function distribution(records: DealRecord[], field: keyof DealRecord) {
  const totals = new Map<string, number>();
  for (const row of records) {
    const key = String(row[field]);
    totals.set(key, (totals.get(key) ?? 0) + row.exposure);
  }
  const sum = Array.from(totals.values()).reduce((a, b) => a + b, 0);
  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, value, pct: sum ? (value / sum) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
}

function metricCard(label: string, value: string, note: string) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  );
}

export default function ReportsPage() {
  const { deal } = useDeal();
  const [activeTab, setActiveTab] = useState<Tab>('Executive Dashboard');
  const [search, setSearch] = useState('');
  const [draggingColumn, setDraggingColumn] = useState<string | null>(null);

  const [clientFilter, setClientFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [rmFilter, setRmFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [fundingFilter, setFundingFilter] = useState('All');
  const [collectionsFilter, setCollectionsFilter] = useState('All');
  const [legalFilter, setLegalFilter] = useState('All');

  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'Deal ID',
    'Client',
    'Country',
    'Exposure',
    'Yield',
    'Risk',
  ]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([
    'RM',
    'Bank',
    'Funding',
    'Collections',
    'IRR',
    'Legal Status',
    'Maturity Bucket',
  ]);
  const [selectedChart, setSelectedChart] = useState('Bar');

  const records = useMemo<DealRecord[]>(
    () => [
      {
        id: 'DNX-2026-001', client: deal.client.legalName, buyer: 'Buyer ABC Logistics', country: 'United Arab Emirates', industry: 'Trading', product: 'RF', rm: deal.client.relationshipManager, bank: 'ADCB', currency: deal.deal.currency, risk: 'Medium', exposure: 32_000_000, funding: 12_000_000, collections: 8_400_000, yield: 16.4, irr: 18.2, status: 'Active', legalStatus: 'Pending', fundingStatus: 'Scheduled', collectionStatus: 'Expected', maturityBucket: '31-90',
      },
      {
        id: 'DNX-2026-014', client: 'Apex Trade Group', buyer: 'Northern Infrastructure Buyers', country: 'Saudi Arabia', industry: 'Logistics', product: 'SCF', rm: 'R. Sinha', bank: 'ENBD', currency: 'AED', risk: 'High', exposure: 44_000_000, funding: 16_000_000, collections: 9_200_000, yield: 17.2, irr: 19.1, status: 'Watchlist', legalStatus: 'Exception', fundingStatus: 'Pending', collectionStatus: 'Overdue', maturityBucket: '0-30',
      },
      {
        id: 'DNX-2026-031', client: 'Crescent Healthcare Distribution', buyer: 'Crescent Procurement SPC', country: 'Qatar', industry: 'Healthcare', product: 'POF', rm: 'M. Patel', bank: 'FAB', currency: 'USD', risk: 'Low', exposure: 27_000_000, funding: 11_500_000, collections: 10_100_000, yield: 15.8, irr: 17.2, status: 'Active', legalStatus: 'Cleared', fundingStatus: 'Completed', collectionStatus: 'Collected', maturityBucket: '91-180',
      },
      {
        id: 'DNX-2026-047', client: 'Blue Horizon Procurement DMCC', buyer: 'Blue Horizon Buyers Desk', country: 'United Arab Emirates', industry: 'Infrastructure', product: 'RF', rm: deal.client.relationshipManager, bank: 'ADCB', currency: 'AED', risk: 'Medium', exposure: 36_000_000, funding: 15_000_000, collections: 11_000_000, yield: 16.9, irr: 18.7, status: 'Active', legalStatus: 'Pending', fundingStatus: 'Scheduled', collectionStatus: 'Expected', maturityBucket: '31-90',
      },
      {
        id: 'DNX-2026-062', client: 'Falcon Energy Trade LLC', buyer: 'Gulf Maritime Buyers Pool', country: 'Bahrain', industry: 'Energy', product: 'SCF', rm: 'A. Khan', bank: 'Mashreq', currency: 'AED', risk: 'Medium', exposure: 25_000_000, funding: 10_800_000, collections: 8_900_000, yield: 16.2, irr: 17.9, status: 'Active', legalStatus: 'Cleared', fundingStatus: 'Completed', collectionStatus: 'Collected', maturityBucket: '180+',
      },
      {
        id: 'DNX-2026-074', client: 'Summit Industrial Procurement', buyer: 'Industrial Buyer Ring', country: 'Saudi Arabia', industry: 'Manufacturing', product: 'RF', rm: 'S. Menon', bank: 'FAB', currency: 'USD', risk: 'High', exposure: 39_000_000, funding: 13_400_000, collections: 7_400_000, yield: 17.5, irr: 19.4, status: 'Watchlist', legalStatus: 'Pending', fundingStatus: 'Pending', collectionStatus: 'Overdue', maturityBucket: '0-30',
      },
      {
        id: 'DNX-2026-083', client: 'Atlas Regional Distribution', buyer: 'Regional Buyer Collective', country: 'Qatar', industry: 'Distribution', product: 'POF', rm: deal.client.relationshipManager, bank: 'ENBD', currency: 'AED', risk: 'Low', exposure: 21_000_000, funding: 8_900_000, collections: 8_200_000, yield: 15.9, irr: 17.1, status: 'Matured', legalStatus: 'Cleared', fundingStatus: 'Completed', collectionStatus: 'Collected', maturityBucket: '180+',
      },
      {
        id: 'DNX-2026-091', client: 'Marina Foods Trading', buyer: 'Retail Buyer Union', country: 'United Arab Emirates', industry: 'Food', product: 'SCF', rm: 'R. Sinha', bank: 'Mashreq', currency: 'AED', risk: 'Medium', exposure: 18_000_000, funding: 7_200_000, collections: 6_300_000, yield: 16.1, irr: 17.7, status: 'Active', legalStatus: 'Pending', fundingStatus: 'Scheduled', collectionStatus: 'Expected', maturityBucket: '31-90',
      },
    ],
    [deal.client.legalName, deal.client.relationshipManager, deal.deal.currency],
  );

  const options = useMemo(() => {
    const unique = (values: string[]) => ['All', ...Array.from(new Set(values))];
    return {
      clients: unique(records.map((r) => r.client)),
      countries: unique(records.map((r) => r.country)),
      rms: unique(records.map((r) => r.rm)),
      risks: ['All', 'Low', 'Medium', 'High'],
      funding: unique(records.map((r) => r.fundingStatus)),
      collections: unique(records.map((r) => r.collectionStatus)),
      legal: unique(records.map((r) => r.legalStatus)),
    };
  }, [records]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records
      .filter((r) => {
        if (!q) return true;
        const text = [
          r.id, r.client, r.buyer, r.country, r.rm, r.risk, r.fundingStatus, r.collectionStatus, r.legalStatus,
        ]
          .join(' ')
          .toLowerCase();
        return text.includes(q);
      })
      .filter((r) => (clientFilter === 'All' ? true : r.client === clientFilter))
      .filter((r) => (countryFilter === 'All' ? true : r.country === countryFilter))
      .filter((r) => (rmFilter === 'All' ? true : r.rm === rmFilter))
      .filter((r) => (riskFilter === 'All' ? true : r.risk === riskFilter))
      .filter((r) => (fundingFilter === 'All' ? true : r.fundingStatus === fundingFilter))
      .filter((r) => (collectionsFilter === 'All' ? true : r.collectionStatus === collectionsFilter))
      .filter((r) => (legalFilter === 'All' ? true : r.legalStatus === legalFilter));
  }, [
    records,
    search,
    clientFilter,
    countryFilter,
    rmFilter,
    riskFilter,
    fundingFilter,
    collectionsFilter,
    legalFilter,
  ]);

  const totals = useMemo(() => {
    const exposure = filtered.reduce((sum, r) => sum + r.exposure, 0);
    const fundingMonth = monthSeries.reduce((sum, m) => sum + m.funding, 0) * 1_000_000;
    const collectionsMonth = monthSeries.reduce((sum, m) => sum + m.collections, 0) * 1_000_000;
    const avgYield = filtered.length ? filtered.reduce((sum, r) => sum + r.yield, 0) / filtered.length : 0;
    const avgIrr = filtered.length ? filtered.reduce((sum, r) => sum + r.irr, 0) / filtered.length : 0;
    const npa = filtered.length ? (filtered.filter((r) => r.collectionStatus === 'Overdue').length / filtered.length) * 100 : 0;
    const recoveryRate = collectionsMonth > 0 ? (collectionsMonth / (collectionsMonth + 8_300_000)) * 100 : 0;
    const counterparties = new Set(filtered.map((r) => r.buyer)).size;
    const clients = new Set(filtered.map((r) => r.client)).size;

    return {
      exposure,
      deals: filtered.length,
      clients,
      counterparties,
      fundingMonth,
      collectionsMonth,
      avgYield,
      avgIrr,
      npa,
      recoveryRate,
      aiConfidence: 94,
    };
  }, [filtered]);

  const reportSearchResults = useMemo(
    () => [
      { name: 'Executive Board Pack', scope: 'Portfolio', status: 'Ready', owner: 'BI Office' },
      { name: 'Funding Performance Report', scope: 'Funding', status: 'Scheduled', owner: 'Treasury Desk' },
      { name: 'Collections Recovery Report', scope: 'Collections', status: 'Ready', owner: 'Collections Desk' },
      { name: 'Legal Exception Report', scope: 'Legal', status: 'In Review', owner: 'Legal Ops' },
      { name: 'Risk Concentration Dashboard', scope: 'Risk', status: 'Ready', owner: 'Risk Office' },
    ].filter((r) =>
      `${r.name} ${r.scope} ${r.status} ${r.owner}`.toLowerCase().includes(search.trim().toLowerCase()),
    ),
    [search],
  );

  const portfolioDist = useMemo(() => {
    return {
      country: distribution(filtered, 'country'),
      industry: distribution(filtered, 'industry'),
      product: distribution(filtered, 'product'),
      rm: distribution(filtered, 'rm'),
      bank: distribution(filtered, 'bank'),
      currency: distribution(filtered, 'currency'),
      risk: distribution(filtered, 'risk'),
      maturity: distribution(filtered, 'maturityBucket'),
    };
  }, [filtered]);

  const scheduleCards = [
    'Board Pack - Every Monday 07:30',
    'Investor Pack - Month End 20:00',
    'Regulatory Exposure - Every Friday 18:00',
    'Collections Analytics - Daily 08:00',
  ];
  const recentCards = [
    'Portfolio Summary - 07 Jul 2026 08:10',
    'Risk Report - 07 Jul 2026 08:24',
    'Funding Analytics - 06 Jul 2026 18:02',
    'ESG Report - 05 Jul 2026 16:42',
  ];
  const aiCards = [
    'Hidden concentration risk in KSA logistics segment.',
    'Recovery pace improving for medium-risk cohort by 6.2%.',
    'Funding turnaround reduced by 0.7 days after treasury optimization.',
  ];
  const trendingCards = ['Portfolio IRR +0.4%', 'NPA down 0.3%', 'Average Yield +0.2%', 'Recovery Rate +1.1%'];
  const boardAlerts = ['Large exposure threshold at 88% utilization', 'Two legal exception clusters pending closure'];

  const handleDropToSelected = () => {
    if (!draggingColumn) return;
    if (!selectedColumns.includes(draggingColumn)) {
      setSelectedColumns((prev) => [...prev, draggingColumn]);
      setAvailableColumns((prev) => prev.filter((c) => c !== draggingColumn));
    }
    setDraggingColumn(null);
  };

  const handleDropToAvailable = () => {
    if (!draggingColumn) return;
    if (!availableColumns.includes(draggingColumn)) {
      setAvailableColumns((prev) => [...prev, draggingColumn]);
      setSelectedColumns((prev) => prev.filter((c) => c !== draggingColumn));
    }
    setDraggingColumn(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-[1850px] space-y-6 pb-24">
        <SectionCard title="Reporting & Business Intelligence Center" iconKey="bar-chart-3">
          <p className="text-sm text-slate-300">Executive Analytics, Portfolio Intelligence & Institutional Reporting</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
            {metricCard('Portfolio Exposure', money(totals.exposure, deal.deal.currency), 'Live financed + monitored exposure')}
            {metricCard('Total Active Deals', String(totals.deals), 'Filtered institutional scope')}
            {metricCard('Total Clients', String(totals.clients), 'Relationship universe in focus')}
            {metricCard('Total Counterparties', String(totals.counterparties), 'Buyer + obligor set')}
            {metricCard('Funding This Month', money(totals.fundingMonth, deal.deal.currency), 'Treasury execution total')}
            {metricCard('Collections This Month', money(totals.collectionsMonth, deal.deal.currency), 'Recovered cash position')}
            {metricCard('Average Yield', percent(totals.avgYield), 'Gross weighted portfolio yield')}
            {metricCard('Portfolio IRR', percent(totals.avgIrr), 'Blended transaction IRR')}
            {metricCard('NPA %', percent(totals.npa), 'Non-performing asset share')}
            {metricCard('Recovery Rate', percent(totals.recoveryRate), 'Collections recovery efficiency')}
            {metricCard('AI Confidence Score', `${totals.aiConfidence}%`, 'Signal confidence on analytics layer')}
          </div>
        </SectionCard>

        <SectionCard title="Global Search" iconKey="search">
          <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reports, Client, Deal, Portfolio, Country, RM, Risk, Funding, Collections, Legal"
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-5">
            <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.clients.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.countries.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={rmFilter} onChange={(e) => setRmFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.rms.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.risks.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={fundingFilter} onChange={(e) => setFundingFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.funding.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={collectionsFilter} onChange={(e) => setCollectionsFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.collections.map((x) => <option key={x}>{x}</option>)}</select>
            <select value={legalFilter} onChange={(e) => setLegalFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{options.legal.map((x) => <option key={x}>{x}</option>)}</select>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            {reportSearchResults.map((result) => (
              <div key={result.name} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">
                <p className="font-semibold text-slate-100">{result.name}</p>
                <p className="text-xs text-slate-400">{result.scope} | {result.owner}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Workspace Tabs" iconKey="landmark">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  activeTab === tab
                    ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {activeTab === 'Executive Dashboard' ? (
                <>
                  <div className="grid gap-4 xl:grid-cols-2">
                    <SectionCard title="Portfolio Growth" iconKey="trending-up">
                      <div className="space-y-2">
                        {monthSeries.map((m) => (
                          <div key={`g-${m.month}`}>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>{m.month}</span>
                              <span>{m.growth}%</span>
                            </div>
                            <div className="mt-1 h-2 rounded-full bg-slate-800">
                              <div className="h-2 rounded-full bg-cyan-500/80" style={{ width: `${m.growth * 18}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </SectionCard>

                    <SectionCard title="Monthly Funding vs Collections" iconKey="wallet">
                      <div className="space-y-2">
                        {monthSeries.map((m) => (
                          <div key={`fc-${m.month}`} className="grid grid-cols-[40px_1fr] gap-2">
                            <p className="text-xs text-slate-400">{m.month}</p>
                            <div className="space-y-1">
                              <div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-cyan-500/80" style={{ width: `${m.funding}%` }} /></div>
                              <div className="h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-emerald-500/80" style={{ width: `${m.collections}%` }} /></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-3">
                    <SectionCard title="Yield Trend" iconKey="bar-chart-3">
                      <div className="space-y-2">
                        {monthSeries.map((m) => (
                          <div key={`y-${m.month}`} className="flex items-center justify-between text-sm text-slate-200">
                            <span>{m.month}</span>
                            <span>{m.yield}%</span>
                          </div>
                        ))}
                      </div>
                    </SectionCard>

                    <SectionCard title="Top Clients" iconKey="building-2">
                      <div className="space-y-2">
                        {filtered
                          .slice()
                          .sort((a, b) => b.exposure - a.exposure)
                          .slice(0, 5)
                          .map((r) => (
                            <div key={r.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-2 text-sm text-slate-200">
                              <p>{r.client}</p>
                              <p className="text-xs text-slate-400">{money(r.exposure, r.currency)}</p>
                            </div>
                          ))}
                      </div>
                    </SectionCard>

                    <SectionCard title="Top Buyers" iconKey="hand-coins">
                      <div className="space-y-2">
                        {topBuyers.map((buyer) => (
                          <div key={buyer.name} className="rounded-lg border border-slate-800 bg-slate-950/70 p-2 text-sm text-slate-200">
                            <p>{buyer.name}</p>
                            <p className="text-xs text-slate-400">Exposure AED {buyer.exposure}M | {buyer.performance}</p>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2">
                    <SectionCard title="Country / Industry Exposure" iconKey="bar-chart-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {portfolioDist.country.slice(0, 4).map((row) => (
                          <div key={`c-${row.name}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                            <p className="text-xs text-slate-500">Country</p>
                            <p className="text-sm text-slate-100">{row.name}</p>
                            <div className="mt-1 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-cyan-500/80" style={{ width: `${row.pct}%` }} /></div>
                          </div>
                        ))}
                        {portfolioDist.industry.slice(0, 4).map((row) => (
                          <div key={`i-${row.name}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                            <p className="text-xs text-slate-500">Industry</p>
                            <p className="text-sm text-slate-100">{row.name}</p>
                            <div className="mt-1 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-emerald-500/80" style={{ width: `${row.pct}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    </SectionCard>

                    <SectionCard title="Largest Facilities / Upcoming Maturities" iconKey="clock-3">
                      <div className="space-y-2">
                        {filtered
                          .slice()
                          .sort((a, b) => b.exposure - a.exposure)
                          .slice(0, 6)
                          .map((r) => (
                            <div key={`lf-${r.id}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-2 text-sm text-slate-200">
                              <p>{r.id} | {r.client}</p>
                              <p className="text-xs text-slate-400">{money(r.exposure, r.currency)} | Maturity Bucket {r.maturityBucket}</p>
                            </div>
                          ))}
                      </div>
                    </SectionCard>
                  </div>
                </>
              ) : null}

              {activeTab === 'Portfolio Analytics' ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  {([
                    ['Portfolio by Country', portfolioDist.country],
                    ['Portfolio by Industry', portfolioDist.industry],
                    ['Portfolio by Product', portfolioDist.product],
                    ['Portfolio by RM', portfolioDist.rm],
                    ['Portfolio by Bank', portfolioDist.bank],
                    ['Portfolio by Currency', portfolioDist.currency],
                    ['Portfolio by Risk', portfolioDist.risk],
                    ['Portfolio by Maturity', portfolioDist.maturity],
                  ] as [string, Array<{ name: string; value: number; pct: number }>][]) .map(([title, rows]) => (
                    <SectionCard key={title} title={title} iconKey="bar-chart-3">
                      <div className="space-y-2">
                        {rows.map((row) => (
                          <div key={`${title}-${row.name}`}>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>{row.name}</span>
                              <span>{row.pct.toFixed(1)}%</span>
                            </div>
                            <div className="mt-1 h-2 rounded-full bg-slate-800">
                              <div className="h-2 rounded-full bg-cyan-500/80" style={{ width: `${row.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  ))}
                </div>
              ) : null}

              {activeTab === 'Funding Analytics' ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  <SectionCard title="Funding Pipeline" iconKey="wallet">
                    <div className="space-y-2 text-sm text-slate-200">
                      <p>Pipeline Size: {money(filtered.reduce((s, r) => s + r.funding, 0), deal.deal.currency)}</p>
                      <p>Average Funding Time: 2.8 days</p>
                      <p>Funding Turnaround: 93.4%</p>
                      <p>Bank Utilisation: ADCB 78%, ENBD 66%, FAB 61%, Mashreq 58%</p>
                      <p>Cost of Funds: 6.2%</p>
                      <p>Treasury Efficiency: 91.8%</p>
                    </div>
                  </SectionCard>
                  <SectionCard title="Bank Utilisation" iconKey="landmark">
                    <div className="space-y-2">
                      {portfolioDist.bank.map((row) => (
                        <div key={`b-${row.name}`}>
                          <div className="flex items-center justify-between text-xs text-slate-400"><span>{row.name}</span><span>{row.pct.toFixed(1)}%</span></div>
                          <div className="mt-1 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-cyan-500/80" style={{ width: `${row.pct}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              ) : null}

              {activeTab === 'Collections Analytics' ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  <SectionCard title="Collections Core Metrics" iconKey="hand-coins">
                    <div className="space-y-2 text-sm text-slate-200">
                      <p>Collection Success: 98.4%</p>
                      <p>DSO: 21 Days</p>
                      <p>Recovery Rate: {percent(totals.recoveryRate)}</p>
                      <p>Overdue Analysis: {filtered.filter((r) => r.collectionStatus === 'Overdue').length} active overdue facilities</p>
                      <p>Ageing Buckets: 0-30 (58%), 31-60 (27%), 60+ (15%)</p>
                    </div>
                  </SectionCard>
                  <SectionCard title="Buyer Performance" iconKey="clipboard-list">
                    <div className="space-y-2">
                      {topBuyers.map((buyer) => (
                        <div key={`bp-${buyer.name}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-2 text-sm text-slate-200">
                          <p>{buyer.name}</p>
                          <p className="text-xs text-slate-400">Exposure AED {buyer.exposure}M | {buyer.performance}</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              ) : null}

              {activeTab === 'Risk Analytics' ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  <SectionCard title="Risk Heat Map" iconKey="shield-alert">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {portfolioDist.country.slice(0, 6).map((row) => (
                        <div key={`rh-${row.name}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                          <p className="text-xs text-slate-500">{row.name}</p>
                          <p className="text-sm text-slate-100">Concentration {row.pct.toFixed(1)}%</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                  <SectionCard title="Risk Concentration" iconKey="panels-top-left">
                    <div className="space-y-2 text-sm text-slate-200">
                      <p>Country Concentration: UAE + KSA = 62%</p>
                      <p>Industry Concentration: Logistics + Trading = 49%</p>
                      <p>Counterparty Concentration: Top 5 buyers = 57%</p>
                      <p>Policy Exceptions: 6 active exceptions</p>
                      <p>Watchlist Exposure: {money(filtered.filter((r) => r.status === 'Watchlist').reduce((s, r) => s + r.exposure, 0), deal.deal.currency)}</p>
                    </div>
                  </SectionCard>
                </div>
              ) : null}

              {activeTab === 'Profitability' ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  <SectionCard title="Profitability Metrics" iconKey="trending-up">
                    <div className="grid gap-2 sm:grid-cols-2 text-sm text-slate-200">
                      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">Gross Yield: {percent(totals.avgYield + 1.3)}</div>
                      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">Net Yield: {percent(totals.avgYield)}</div>
                      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">ROA: 6.8%</div>
                      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">ROE: 14.2%</div>
                      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">Spread: 4.6%</div>
                      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">Fees: AED 12.4M</div>
                    </div>
                  </SectionCard>
                  <SectionCard title="Client / Facility Profitability" iconKey="bar-chart-3">
                    <div className="space-y-2">
                      {filtered
                        .slice()
                        .sort((a, b) => b.yield - a.yield)
                        .slice(0, 6)
                        .map((r) => (
                          <div key={`pf-${r.id}`} className="rounded-lg border border-slate-800 bg-slate-950/70 p-2 text-sm text-slate-200">
                            <p>{r.client}</p>
                            <p className="text-xs text-slate-400">{r.id} | Yield {r.yield}% | IRR {r.irr}%</p>
                          </div>
                        ))}
                    </div>
                  </SectionCard>
                </div>
              ) : null}

              {activeTab === 'Investor Reports' ? (
                <SectionCard title="Investor Reports" iconKey="file-text">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {investorReports.map((name) => (
                      <div key={name} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-sm font-semibold text-slate-100">{name}</p>
                        <button type="button" className="mt-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                          Generate
                        </button>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'Regulatory Reports' ? (
                <SectionCard title="Regulatory Reports" iconKey="shield-alert">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {regulatoryReports.map((name) => (
                      <div key={name} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-sm font-semibold text-slate-100">{name}</p>
                        <p className="mt-1 text-xs text-slate-400">Latest cycle status: Ready</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'Custom Reports' ? (
                <SectionCard title="Custom Report Builder" iconKey="sparkles">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDropToSelected}
                      className="rounded-xl border border-cyan-700/40 bg-cyan-950/20 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Selected Columns</p>
                      <div className="mt-3 space-y-2">
                        {selectedColumns.map((column) => (
                          <div
                            key={column}
                            draggable
                            onDragStart={() => setDraggingColumn(column)}
                            className="cursor-grab rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                          >
                            {column}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDropToAvailable}
                      className="rounded-xl border border-slate-700 bg-slate-950/70 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Available Columns</p>
                      <div className="mt-3 space-y-2">
                        {availableColumns.map((column) => (
                          <div
                            key={column}
                            draggable
                            onDragStart={() => setDraggingColumn(column)}
                            className="cursor-grab rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                          >
                            {column}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    <select value={selectedChart} onChange={(e) => setSelectedChart(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">
                      {['Bar', 'Line', 'Area', 'Table'].map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <button type="button" className="rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200">Export</button>
                    <button type="button" className="rounded-lg border border-emerald-700/40 bg-emerald-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-200">Save Template</button>
                    <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200">Preview Report</button>
                  </div>
                </SectionCard>
              ) : null}
            </div>

            <div className="space-y-4">
              <SectionCard title="Right Sidebar" iconKey="bell-ring">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Scheduled Reports</p>
                    <div className="mt-2 space-y-2">
                      {scheduleCards.map((card) => <p key={card} className="rounded-lg border border-slate-800 bg-slate-950/70 p-2 text-sm text-slate-200">{card}</p>)}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recent Reports</p>
                    <div className="mt-2 space-y-2">
                      {recentCards.map((card) => <p key={card} className="rounded-lg border border-slate-800 bg-slate-950/70 p-2 text-sm text-slate-200">{card}</p>)}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300">AI Insights</p>
                    <div className="mt-2 space-y-2">
                      {aiCards.map((card) => <p key={card} className="rounded-lg border border-fuchsia-900/40 bg-fuchsia-950/20 p-2 text-sm text-fuchsia-100">{card}</p>)}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Trending KPIs</p>
                    <div className="mt-2 space-y-2">
                      {trendingCards.map((card) => <p key={card} className="rounded-lg border border-cyan-900/40 bg-cyan-950/20 p-2 text-sm text-cyan-100">{card}</p>)}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Board Alerts</p>
                    <div className="mt-2 space-y-2">
                      {boardAlerts.map((card) => <p key={card} className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-2 text-sm text-amber-100">{card}</p>)}
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-30 px-4">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur">
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200"><Sparkles className="h-4 w-4" />Generate Report</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-emerald-700/40 bg-emerald-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-200"><CalendarRange className="h-4 w-4" />Schedule Report</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><Download className="h-4 w-4" />Export Excel</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><FileText className="h-4 w-4" />Export PDF</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><Mail className="h-4 w-4" />Email Report</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><CheckCircle2 className="h-4 w-4" />Share Dashboard</button>
            </div>
      </div>
    </div>
  );
}
