'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  FileSearch,
  Receipt,
  Search,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import { useDeal } from '@/components/atlas/common/DealContext';
import { DealOrchestrationEngine } from '@/atlas-core/orchestration/DealOrchestrationEngine';

type CollectionsTab =
  | 'Overview'
  | "Today's Collections"
  | 'Overdue'
  | 'Future Collections'
  | 'Monitoring'
  | 'Exceptions'
  | 'Recovery'
  | 'Audit';

type CollectionStatus = 'Collected' | 'Expected' | 'Due Today' | 'Overdue' | 'Recovery';

type PaymentMethod = 'SWIFT' | 'RTGS' | 'ACH' | 'Internal Transfer';

type SortDirection = 'asc' | 'desc';

type CollectionRow = {
  collectionId: string;
  dealId: string;
  invoice: string;
  invoiceNumber: string;
  client: string;
  buyer: string;
  amountDue: number;
  amountReceived: number;
  balance: number;
  dueDate: string;
  daysOutstanding: number;
  collectionStatus: CollectionStatus;
  probability: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  relationshipManager: string;
  collectionAccount: string;
  paymentMethod: PaymentMethod;
  country: string;
  reference: string;
  swift: string;
  treasuryBank: string;
  riskRating: 'Low' | 'Medium' | 'High';
  fundingDate: string;
  lastFollowUp: string;
  actionRequired: string;
  nextFollowUp: string;
};

const TABS: CollectionsTab[] = [
  'Overview',
  "Today's Collections",
  'Overdue',
  'Future Collections',
  'Monitoring',
  'Exceptions',
  'Recovery',
  'Audit',
];

const MONEY_M = [56, 44, 38, 36, 32, 30, 28, 26, 24, 22, 20, 18, 16, 12, 10, 6];

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDate(value: string): Date | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function formatMoney(value: number, currency: string): string {
  return `${currency} ${Math.round(value).toLocaleString('en-US')}`;
}

function statusClass(status: CollectionStatus): string {
  if (status === 'Collected') return 'text-emerald-300';
  if (status === 'Expected') return 'text-cyan-300';
  if (status === 'Due Today') return 'text-amber-300';
  if (status === 'Overdue') return 'text-rose-300';
  return 'text-fuchsia-300';
}

function field(label: string, value: string) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function timelineTone(step: string, currentStatus: CollectionStatus): string {
  if (step === 'Closed' && currentStatus === 'Collected') return 'bg-emerald-500';
  if (step === 'Payment Received' && (currentStatus === 'Collected' || currentStatus === 'Recovery')) return 'bg-emerald-500';
  if (step === 'Payment Expected' && (currentStatus === 'Expected' || currentStatus === 'Due Today')) return 'bg-cyan-500';
  if (step === 'Reminder Sent' && currentStatus === 'Overdue') return 'bg-amber-500';
  if (step === 'Buyer Confirmed' && currentStatus === 'Recovery') return 'bg-fuchsia-500';
  return 'bg-slate-700';
}

export default function CollectionsPage() {
  const { deal } = useDeal();
  const orchestration = useMemo(() => DealOrchestrationEngine.orchestrateDealWorkflow(deal), [deal]);

  const [activeTab, setActiveTab] = useState<CollectionsTab>('Overview');
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [bankFilter, setBankFilter] = useState('All');
  const [currencyFilter, setCurrencyFilter] = useState('All');
  const [buyerFilter, setBuyerFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [rmFilter, setRmFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [fundingDateFilter, setFundingDateFilter] = useState('All');
  const [dueDateFilter, setDueDateFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [sortColumn, setSortColumn] = useState<keyof CollectionRow>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const anchorDate = useMemo(
    () => parseDate(deal.funding.scheduledFundingDate) ?? parseDate(deal.workflow.lastUpdated) ?? new Date('2026-07-07'),
    [deal],
  );
  const isoToday = toIsoDate(anchorDate);

  const tableRows = useMemo<CollectionRow[]>(() => {
    const buyers = [
      'Mashreq Bank PJSC',
      'Gulf Maritime Logistics LLC',
      'Crescent Healthcare Distribution SPC',
      'Northern Infrastructure Buyers Ltd.',
      'Blue Horizon Procurement DMCC',
      'Summit Industrial Procurement Co.',
      'Falcon Energy Trading LLC',
      'Atlas Regional Distribution Co.',
    ];
    const countries = ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Bahrain'];
    const methods: PaymentMethod[] = ['SWIFT', 'RTGS', 'ACH', 'Internal Transfer'];
    const banks = ['Mashreq', 'ADCB', 'ENBD', 'FAB'];

    return MONEY_M.map((amountM, index) => {
      const amountDue = amountM * 1_000_000;
      const dueOffset = index === 14
        ? 0
        : index === 15
          ? 0
          : index === 13
            ? -2
            : index < 6
              ? 1 + index
              : index < 10
                ? 7 + (index - 6)
                : 15 + (index - 10);
      const dueDate = toIsoDate(addDays(anchorDate, dueOffset));
      const daysOutstanding = Math.max(-dueOffset, 0);

      const collectionStatus: CollectionStatus = dueOffset < 0
        ? index === 13
          ? 'Overdue'
          : 'Recovery'
        : dueOffset === 0
          ? 'Due Today'
          : dueOffset <= 7
            ? 'Expected'
            : index % 3 === 0
              ? 'Collected'
              : 'Expected';

      const amountReceived = collectionStatus === 'Collected'
        ? amountDue
        : collectionStatus === 'Recovery'
          ? Math.round(amountDue * 0.55)
          : collectionStatus === 'Overdue'
            ? Math.round(amountDue * 0.0)
            : collectionStatus === 'Due Today'
              ? Math.round(amountDue * 0.35)
              : Math.round(amountDue * 0.15);

      const balance = Math.max(amountDue - amountReceived, 0);

      return {
        collectionId: `COL-${String(index + 1).padStart(5, '0')}`,
        dealId: `${deal.deal.dealId.slice(0, -1)}${(index + 1) % 10}`,
        invoice: `INV-${2026}-${String(index + 101)}`,
        invoiceNumber: `INVNO-${String(7000 + index)}`,
        client: index % 2 === 0 ? deal.client.legalName : `${deal.client.legalName} Group ${index + 1}`,
        buyer: buyers[index % buyers.length],
        amountDue,
        amountReceived,
        balance,
        dueDate,
        daysOutstanding,
        collectionStatus,
        probability: collectionStatus === 'Collected' ? 100 : collectionStatus === 'Overdue' ? 42 : 78 - Math.min(index, 8),
        priority: collectionStatus === 'Overdue' ? 'Critical' : collectionStatus === 'Due Today' ? 'High' : collectionStatus === 'Recovery' ? 'High' : 'Medium',
        relationshipManager: deal.client.relationshipManager,
        collectionAccount: `${deal.funding.disbursementAccount}-${(index % 3) + 1}`,
        paymentMethod: methods[index % methods.length],
        country: countries[index % countries.length],
        reference: `REF-${deal.deal.dealId}-${index + 1}`,
        swift: `DNXAED${String(1000 + index)}`,
        treasuryBank: banks[index % banks.length],
        riskRating: collectionStatus === 'Overdue' ? 'High' : collectionStatus === 'Recovery' ? 'Medium' : 'Low',
        fundingDate: toIsoDate(addDays(anchorDate, -30 + index)),
        lastFollowUp: toIsoDate(addDays(anchorDate, -Math.max(1, index % 5 + 1))),
        actionRequired: collectionStatus === 'Overdue'
          ? 'Escalate to legal recovery'
          : collectionStatus === 'Due Today'
            ? 'Confirm incoming transfer window'
            : collectionStatus === 'Recovery'
              ? 'Obtain promise-to-pay confirmation'
              : 'Monitor payment execution',
        nextFollowUp: toIsoDate(addDays(anchorDate, collectionStatus === 'Overdue' ? 0 : 1)),
      };
    });
  }, [deal, anchorDate]);

  const filterOptions = useMemo(() => {
    const uniq = (items: string[]) => Array.from(new Set(items));
    return {
      countries: ['All', ...uniq(tableRows.map((row) => row.country))],
      banks: ['All', ...uniq(tableRows.map((row) => row.treasuryBank))],
      currencies: ['All', deal.deal.currency],
      buyers: ['All', ...uniq(tableRows.map((row) => row.buyer))],
      clients: ['All', ...uniq(tableRows.map((row) => row.client))],
      rms: ['All', ...uniq(tableRows.map((row) => row.relationshipManager))],
      statuses: ['All', ...uniq(tableRows.map((row) => row.collectionStatus))],
      risk: ['All', ...uniq(tableRows.map((row) => row.riskRating))],
      fundingDates: ['All', ...uniq(tableRows.map((row) => row.fundingDate))],
      dueDates: ['All', ...uniq(tableRows.map((row) => row.dueDate))],
      paymentMethods: ['All', ...uniq(tableRows.map((row) => row.paymentMethod))],
    };
  }, [tableRows, deal]);

  const searchedFilteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = tableRows
      .filter((row) => {
        if (!query) return true;
        const fields = [
          row.collectionId,
          row.dealId,
          row.invoice,
          row.invoiceNumber,
          row.client,
          row.buyer,
          row.reference,
          row.swift,
          row.collectionAccount,
          row.collectionStatus,
          row.relationshipManager,
          row.country,
          row.paymentMethod,
          row.actionRequired,
          row.nextFollowUp,
        ]
          .join(' ')
          .toLowerCase();
        return fields.includes(query);
      })
      .filter((row) => (countryFilter === 'All' ? true : row.country === countryFilter))
      .filter((row) => (bankFilter === 'All' ? true : row.treasuryBank === bankFilter))
      .filter(() => (currencyFilter === 'All' ? true : deal.deal.currency === currencyFilter))
      .filter((row) => (buyerFilter === 'All' ? true : row.buyer === buyerFilter))
      .filter((row) => (clientFilter === 'All' ? true : row.client === clientFilter))
      .filter((row) => (rmFilter === 'All' ? true : row.relationshipManager === rmFilter))
      .filter((row) => (statusFilter === 'All' ? true : row.collectionStatus === statusFilter))
      .filter((row) => (riskFilter === 'All' ? true : row.riskRating === riskFilter))
      .filter((row) => (fundingDateFilter === 'All' ? true : row.fundingDate === fundingDateFilter))
      .filter((row) => (dueDateFilter === 'All' ? true : row.dueDate === dueDateFilter))
      .filter((row) => (paymentMethodFilter === 'All' ? true : row.paymentMethod === paymentMethodFilter));

    const tabFiltered = filtered.filter((row) => {
      if (activeTab === "Today's Collections") return row.dueDate === isoToday;
      if (activeTab === 'Overdue') return row.collectionStatus === 'Overdue' || row.collectionStatus === 'Recovery';
      if (activeTab === 'Future Collections') return row.dueDate > isoToday && row.collectionStatus !== 'Collected';
      if (activeTab === 'Exceptions') return row.collectionStatus === 'Overdue' || row.riskRating === 'High' || row.paymentMethod === 'SWIFT';
      if (activeTab === 'Recovery') return row.collectionStatus === 'Recovery' || row.collectionStatus === 'Overdue';
      return true;
    });

    return [...tabFiltered].sort((left, right) => {
      const leftValue = left[sortColumn];
      const rightValue = right[sortColumn];

      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        return sortDirection === 'asc' ? leftValue - rightValue : rightValue - leftValue;
      }

      const leftText = String(leftValue).toLowerCase();
      const rightText = String(rightValue).toLowerCase();
      if (leftText < rightText) return sortDirection === 'asc' ? -1 : 1;
      if (leftText > rightText) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [
    tableRows,
    search,
    countryFilter,
    bankFilter,
    currencyFilter,
    buyerFilter,
    clientFilter,
    rmFilter,
    statusFilter,
    riskFilter,
    fundingDateFilter,
    dueDateFilter,
    paymentMethodFilter,
    activeTab,
    isoToday,
    sortColumn,
    sortDirection,
    deal,
  ]);

  const executiveKpis = useMemo(() => {
    return [
      { label: 'Total Receivables Outstanding', value: 'AED 418M' },
      { label: 'Collections Due Today', value: 'AED 18.4M' },
      { label: 'Collections This Week', value: 'AED 74M' },
      { label: 'Overdue Collections', value: 'AED 8.3M' },
      { label: 'Collection Success Rate', value: '98.4%' },
      { label: 'Average DSO', value: '21 Days' },
      { label: 'Recovery Rate', value: '99.2%' },
      { label: 'Portfolio Health', value: 'Healthy' },
    ];
  }, []);

  const todayExpected = useMemo(
    () => tableRows.filter((row) => row.dueDate === isoToday).reduce((sum, row) => sum + row.amountDue, 0),
    [tableRows, isoToday],
  );
  const todayReceived = useMemo(
    () => tableRows.filter((row) => row.dueDate === isoToday).reduce((sum, row) => sum + row.amountReceived, 0),
    [tableRows, isoToday],
  );
  const pendingToday = Math.max(todayExpected - todayReceived, 0);
  const lateToday = useMemo(
    () => tableRows.filter((row) => row.dueDate === isoToday && row.collectionStatus !== 'Collected').length,
    [tableRows, isoToday],
  );

  const sidebar = useMemo(() => {
    const highRiskBuyers = tableRows.filter((row) => row.riskRating === 'High').length;
    const returnedPayments = tableRows.filter((row) => row.collectionStatus === 'Recovery').length;
    const swiftExceptions = tableRows.filter((row) => row.paymentMethod === 'SWIFT' && row.collectionStatus !== 'Collected').length;

    return {
      collectionAlerts: tableRows.filter((row) => row.collectionStatus === 'Overdue' || row.collectionStatus === 'Recovery').length,
      highRiskBuyers,
      returnedPayments,
      swiftExceptions,
      bankRejections: Math.max(1, Math.round(returnedPayments * 0.4)),
      accountMismatch: Math.max(1, Math.round(returnedPayments * 0.25)),
      duplicateReceipts: Math.max(1, Math.round(tableRows.length * 0.06)),
      manualIntervention: tableRows.filter((row) => row.priority === 'Critical').length,
    };
  }, [tableRows]);

  const bottomPanels = useMemo(() => {
    const today = tableRows.filter((row) => row.dueDate === isoToday).reduce((sum, row) => sum + row.amountDue, 0);
    const tomorrow = tableRows
      .filter((row) => row.dueDate === toIsoDate(addDays(anchorDate, 1)))
      .reduce((sum, row) => sum + row.amountDue, 0);
    const thisWeek = tableRows
      .filter((row) => row.dueDate <= toIsoDate(addDays(anchorDate, 7)) && row.dueDate >= isoToday)
      .reduce((sum, row) => sum + row.amountDue, 0);
    const nextWeek = tableRows
      .filter((row) => row.dueDate > toIsoDate(addDays(anchorDate, 7)) && row.dueDate <= toIsoDate(addDays(anchorDate, 14)))
      .reduce((sum, row) => sum + row.amountDue, 0);

    const overdueRows = tableRows.filter((row) => row.collectionStatus === 'Overdue' || row.collectionStatus === 'Recovery');

    return {
      expected: {
        today,
        tomorrow,
        thisWeek,
        nextWeek,
      },
      ageing: {
        b0_7: overdueRows.filter((row) => row.daysOutstanding <= 7).length,
        b8_30: overdueRows.filter((row) => row.daysOutstanding > 7 && row.daysOutstanding <= 30).length,
        b31_60: overdueRows.filter((row) => row.daysOutstanding > 30 && row.daysOutstanding <= 60).length,
        b60plus: overdueRows.filter((row) => row.daysOutstanding > 60).length,
      },
      recovery: {
        negotiation: tableRows.filter((row) => row.collectionStatus === 'Recovery').length,
        promiseToPay: tableRows.filter((row) => row.actionRequired.toLowerCase().includes('promise')).length,
        legalNotice: tableRows.filter((row) => row.priority === 'Critical').length,
        legalRecovery: tableRows.filter((row) => row.collectionStatus === 'Overdue').length,
        recovered: tableRows.filter((row) => row.collectionStatus === 'Collected').length,
      },
      bankMonitoring: {
        received: tableRows.filter((row) => row.collectionStatus === 'Collected').length,
        returned: tableRows.filter((row) => row.collectionStatus === 'Recovery').length,
        swiftPending: tableRows.filter((row) => row.paymentMethod === 'SWIFT' && row.collectionStatus !== 'Collected').length,
        unmatched: tableRows.filter((row) => row.balance > 0 && row.collectionStatus === 'Collected').length,
      },
    };
  }, [tableRows, isoToday, anchorDate]);

  const paymentTimelineSteps = [
    'Funding',
    'Invoice Assigned',
    'Reminder Sent',
    'Buyer Confirmed',
    'Payment Expected',
    'Payment Received',
    'Reconciled',
    'Closed',
  ];

  const selectedTimelineRow = searchedFilteredRows[0] ?? tableRows[0];

  const auditEvents = useMemo(() => {
    const baseEvents = [
      'Funding Approved',
      'Funding Released',
      'Payment Sent',
      'Collection Received',
      'Reconciled',
    ];

    return baseEvents.map((event, index) => ({
      event,
      user: selectedTimelineRow.relationshipManager,
      timestamp: toIsoDate(addDays(anchorDate, index - 2)),
      detail: `${selectedTimelineRow.collectionId} | ${selectedTimelineRow.reference}`,
    }));
  }, [selectedTimelineRow, anchorDate]);

  const aiRecommendations = [
    {
      title: 'Buyer payment behaviour deteriorating.',
      detail: 'Expected delay: 5 days. Recommend proactive reminder with treasury confirmation call.',
      tone: 'amber',
    },
    {
      title: 'Buyer has historically paid early.',
      detail: 'Expected payment within 24 hours. Keep monitoring and auto-match once credited.',
      tone: 'cyan',
    },
    {
      title: 'Payment received but invoice mapping incomplete.',
      detail: 'Recommend reconciliation and unmatched credit review for same-day closure.',
      tone: 'rose',
    },
  ] as const;

  const onSort = (column: keyof CollectionRow) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }
    setSortColumn(column);
    setSortDirection('asc');
  };

  const sortHint = (column: keyof CollectionRow) => (sortColumn === column ? ` (${sortDirection})` : '');

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <SectionCard title="Collections & Monitoring Center" icon={Receipt}>
          <p className="text-sm text-slate-300">Monitor, predict and control all incoming receivables.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
            {executiveKpis.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Global Search" icon={Search}>
          <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
            <div className="flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-cyan-300" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Deal ID, Invoice Number, Client, Buyer, Reference, SWIFT, Collection Account, Collection Status, RM, Country"
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-6">
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.countries.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={bankFilter} onChange={(e) => setBankFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.banks.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={currencyFilter} onChange={(e) => setCurrencyFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.currencies.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={buyerFilter} onChange={(e) => setBuyerFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.buyers.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.clients.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={rmFilter} onChange={(e) => setRmFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.rms.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.statuses.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.risk.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={fundingDateFilter} onChange={(e) => setFundingDateFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.fundingDates.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={dueDateFilter} onChange={(e) => setDueDateFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.dueDates.map((v) => <option key={v}>{v}</option>)}</select>
            <select value={paymentMethodFilter} onChange={(e) => setPaymentMethodFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.paymentMethods.map((v) => <option key={v}>{v}</option>)}</select>
            <button
              type="button"
              onClick={() => {
                setCountryFilter('All');
                setBankFilter('All');
                setCurrencyFilter('All');
                setBuyerFilter('All');
                setClientFilter('All');
                setRmFilter('All');
                setStatusFilter('All');
                setRiskFilter('All');
                setFundingDateFilter('All');
                setDueDateFilter('All');
                setPaymentMethodFilter('All');
                setSearch('');
              }}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:border-cyan-600/40"
            >
              Reset Filters
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Workspace Tabs" icon={Activity}>
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
              {activeTab === 'Overview' ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {field("Today's Expected Collections", formatMoney(todayExpected, deal.deal.currency))}
                    {field("Today's Received", formatMoney(todayReceived, deal.deal.currency))}
                    {field('Pending Today', formatMoney(pendingToday, deal.deal.currency))}
                    {field('Late Today', String(lateToday))}
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">AI Collections Recommendation</p>
                    <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                      <p className="text-sm font-semibold text-white">Priority 1</p>
                      <p className="mt-1 text-sm text-slate-300">Call ABC Buyer. Payment overdue by 2 days.</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <p className="text-xs text-slate-400">Confidence: <span className="text-cyan-300">96%</span></p>
                        <p className="text-xs text-slate-400">Expected Recovery: <span className="text-emerald-300">AED 4.8M</span></p>
                      </div>
                      <button type="button" className="mt-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-300">
                        Start Recovery
                      </button>
                    </div>
                  </div>
                </>
              ) : null}

              {activeTab === 'Monitoring' ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {field('Monitoring Coverage', `${searchedFilteredRows.length} receivables tracked`) }
                  {field('Collections Stage Status', orchestration.stages.find((s) => s.stageName === 'Collections')?.status ?? 'In Progress')}
                  {field('Workflow Health', `${orchestration.analytics.workflowHealthScore}%`) }
                  {field('Next Recommended Action', orchestration.analytics.nextRecommendedAction)}
                </div>
              ) : null}

              {activeTab === 'Exceptions' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Exception Queue</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-200">
                    {searchedFilteredRows.slice(0, 6).map((row) => (
                      <div key={`${row.collectionId}-exception`} className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3">
                        <p className="font-semibold text-rose-200">{row.collectionId} | {row.buyer}</p>
                        <p className="mt-1 text-xs text-rose-100">{row.actionRequired} | Next Follow-up: {row.nextFollowUp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'Recovery' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recovery Workbench</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {field('Negotiation', String(bottomPanels.recovery.negotiation))}
                    {field('Promise to Pay', String(bottomPanels.recovery.promiseToPay))}
                    {field('Legal Notice', String(bottomPanels.recovery.legalNotice))}
                    {field('Legal Recovery', String(bottomPanels.recovery.legalRecovery))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'Audit' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Event</th>
                        <th className="px-2 py-2">User</th>
                        <th className="px-2 py-2">Timestamp</th>
                        <th className="px-2 py-2">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {auditEvents.map((row) => (
                        <tr key={`${row.event}-${row.timestamp}`} className="border-t border-slate-800">
                          <td className="px-2 py-2">{row.event}</td>
                          <td className="px-2 py-2">{row.user}</td>
                          <td className="px-2 py-2">{row.timestamp}</td>
                          <td className="px-2 py-2">{row.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Live Collection Table</p>
                <table className="mt-3 min-w-[1800px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('collectionId')}>Collection ID{sortHint('collectionId')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('dealId')}>Deal ID{sortHint('dealId')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('invoice')}>Invoice{sortHint('invoice')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('client')}>Client{sortHint('client')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('buyer')}>Buyer{sortHint('buyer')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('amountDue')}>Amount Due{sortHint('amountDue')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('amountReceived')}>Amount Received{sortHint('amountReceived')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('balance')}>Balance{sortHint('balance')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('dueDate')}>Due Date{sortHint('dueDate')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('daysOutstanding')}>Days Outstanding{sortHint('daysOutstanding')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('collectionStatus')}>Collection Status{sortHint('collectionStatus')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('probability')}>Probability{sortHint('probability')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('priority')}>Priority{sortHint('priority')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('relationshipManager')}>Relationship Manager{sortHint('relationshipManager')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('collectionAccount')}>Collection Account{sortHint('collectionAccount')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('paymentMethod')}>Payment Method{sortHint('paymentMethod')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('country')}>Country{sortHint('country')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('lastFollowUp')}>Last Follow-up{sortHint('lastFollowUp')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('actionRequired')}>Action Required{sortHint('actionRequired')}</th>
                      <th className="px-2 py-2 cursor-pointer" onClick={() => onSort('nextFollowUp')}>Next Follow-up{sortHint('nextFollowUp')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-200">
                    {searchedFilteredRows.map((row) => (
                      <tr key={row.collectionId} className="border-t border-slate-800">
                        <td className="px-2 py-2 font-semibold text-white">{row.collectionId}</td>
                        <td className="px-2 py-2">{row.dealId}</td>
                        <td className="px-2 py-2">{row.invoice}</td>
                        <td className="px-2 py-2">{row.client}</td>
                        <td className="px-2 py-2">{row.buyer}</td>
                        <td className="px-2 py-2">{formatMoney(row.amountDue, deal.deal.currency)}</td>
                        <td className="px-2 py-2">{formatMoney(row.amountReceived, deal.deal.currency)}</td>
                        <td className="px-2 py-2">{formatMoney(row.balance, deal.deal.currency)}</td>
                        <td className="px-2 py-2">{row.dueDate}</td>
                        <td className="px-2 py-2">{row.daysOutstanding}</td>
                        <td className={`px-2 py-2 font-semibold ${statusClass(row.collectionStatus)}`}>{row.collectionStatus}</td>
                        <td className="px-2 py-2">{row.probability}%</td>
                        <td className="px-2 py-2">{row.priority}</td>
                        <td className="px-2 py-2">{row.relationshipManager}</td>
                        <td className="px-2 py-2">{row.collectionAccount}</td>
                        <td className="px-2 py-2">{row.paymentMethod}</td>
                        <td className="px-2 py-2">{row.country}</td>
                        <td className="px-2 py-2">{row.lastFollowUp}</td>
                        <td className="px-2 py-2">{row.actionRequired}</td>
                        <td className="px-2 py-2">{row.nextFollowUp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Expected Collections</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-200">
                    <div>Today: {formatMoney(bottomPanels.expected.today, deal.deal.currency)}</div>
                    <div>Tomorrow: {formatMoney(bottomPanels.expected.tomorrow, deal.deal.currency)}</div>
                    <div>This Week: {formatMoney(bottomPanels.expected.thisWeek, deal.deal.currency)}</div>
                    <div>Next Week: {formatMoney(bottomPanels.expected.nextWeek, deal.deal.currency)}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Overdue Ageing</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-200">
                    <div>0-7: {bottomPanels.ageing.b0_7}</div>
                    <div>8-30: {bottomPanels.ageing.b8_30}</div>
                    <div>31-60: {bottomPanels.ageing.b31_60}</div>
                    <div>60+: {bottomPanels.ageing.b60plus}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recovery Pipeline</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-200">
                    <div>Negotiation: {bottomPanels.recovery.negotiation}</div>
                    <div>Promise to Pay: {bottomPanels.recovery.promiseToPay}</div>
                    <div>Legal Notice: {bottomPanels.recovery.legalNotice}</div>
                    <div>Legal Recovery: {bottomPanels.recovery.legalRecovery}</div>
                    <div>Recovered: {bottomPanels.recovery.recovered}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Bank Monitoring</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-200">
                    <div>Payments Received: {bottomPanels.bankMonitoring.received}</div>
                    <div>Returned: {bottomPanels.bankMonitoring.returned}</div>
                    <div>SWIFT Pending: {bottomPanels.bankMonitoring.swiftPending}</div>
                    <div>Unmatched Credits: {bottomPanels.bankMonitoring.unmatched}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ATLAS Collection Intelligence</p>
                <div className="mt-3 space-y-2 text-sm">
                  {aiRecommendations.map((item) => (
                    <div
                      key={item.title}
                      className={`rounded-lg border p-3 ${
                        item.tone === 'amber'
                          ? 'border-amber-900/60 bg-amber-950/20 text-amber-100'
                          : item.tone === 'rose'
                            ? 'border-rose-900/60 bg-rose-950/20 text-rose-100'
                            : 'border-cyan-900/60 bg-cyan-950/20 text-cyan-100'
                      }`}
                    >
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Payment Timeline</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {paymentTimelineSteps.map((step) => (
                    <div key={step} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${timelineTone(step, selectedTimelineRow.collectionStatus)}`} />
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Collection Alerts</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="rounded-lg border border-amber-900/60 bg-amber-950/20 p-3 text-amber-200">Collection Alerts: {sidebar.collectionAlerts}</div>
                  <div className="rounded-lg border border-rose-900/60 bg-rose-950/20 p-3 text-rose-200">High Risk Buyers: {sidebar.highRiskBuyers}</div>
                  <div className="rounded-lg border border-fuchsia-900/60 bg-fuchsia-950/20 p-3 text-fuchsia-200">Returned Payments: {sidebar.returnedPayments}</div>
                  <div className="rounded-lg border border-cyan-900/60 bg-cyan-950/20 p-3 text-cyan-200">SWIFT Exceptions: {sidebar.swiftExceptions}</div>
                  <div className="rounded-lg border border-rose-900/60 bg-rose-950/20 p-3 text-rose-200">Bank Rejections: {sidebar.bankRejections}</div>
                  <div className="rounded-lg border border-amber-900/60 bg-amber-950/20 p-3 text-amber-200">Account Mismatch: {sidebar.accountMismatch}</div>
                  <div className="rounded-lg border border-cyan-900/60 bg-cyan-950/20 p-3 text-cyan-200">Duplicate Receipts: {sidebar.duplicateReceipts}</div>
                  <div className="rounded-lg border border-rose-900/60 bg-rose-950/20 p-3 text-rose-200">Manual Intervention Required: {sidebar.manualIntervention}</div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Collection Desk Signals</p>
                <div className="mt-3 space-y-2">
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Collections Stage: <span className="text-cyan-300">{orchestration.stages.find((s) => s.stageName === 'Collections')?.status ?? 'In Progress'}</span></div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Workflow Health: <span className="text-emerald-300">{orchestration.analytics.workflowHealthScore}%</span></div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Next Action: {orchestration.analytics.nextRecommendedAction}</div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-30 px-4">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur">
          <button type="button" className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200">Record Collection</button>
          <button type="button" className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200">Match Payment</button>
          <button type="button" className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200">Send Reminder</button>
          <button type="button" className="rounded-lg border border-amber-700/50 bg-amber-950/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-200">Escalate</button>
          <button type="button" className="rounded-lg border border-fuchsia-700/50 bg-fuchsia-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-fuchsia-200">Legal Notice</button>
          <button type="button" className="rounded-lg border border-cyan-700/50 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200">Export</button>
          <button type="button" className="rounded-lg border border-emerald-700/50 bg-emerald-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-200">Generate Report</button>
        </div>
      </div>
    </div>
  );
}
