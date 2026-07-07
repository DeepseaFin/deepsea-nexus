'use client';

import { useMemo, useState } from 'react';
import {
  Banknote,
  CalendarDays,
  Coins,
  Landmark,
  ListChecks,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import { useDeal } from '@/components/atlas/common/DealContext';
import { DealOrchestrationEngine } from '@/atlas-core/orchestration/DealOrchestrationEngine';

type TreasuryTab =
  | 'Overview'
  | 'Funding Queue'
  | 'Bank Lines'
  | 'Liquidity'
  | 'Disbursements'
  | 'Collections Forecast'
  | 'Reconciliation'
  | 'Audit';

const TREASURY_TABS: TreasuryTab[] = [
  'Overview',
  'Funding Queue',
  'Bank Lines',
  'Liquidity',
  'Disbursements',
  'Collections Forecast',
  'Reconciliation',
  'Audit',
];

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDate(value: string): Date | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function formatMoney(value: number, currency: string): string {
  return `${currency} ${Math.round(value).toLocaleString('en-US')}`;
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function field(label: string, value: string) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function tone(status: string): string {
  const value = status.toLowerCase();
  if (value.includes('blocked') || value.includes('reject')) return 'text-rose-300';
  if (value.includes('pending')) return 'text-amber-300';
  if (value.includes('complete') || value.includes('executed') || value.includes('passed')) return 'text-emerald-300';
  return 'text-cyan-300';
}

export default function TreasuryPage() {
  const { deal } = useDeal();
  const [activeTab, setActiveTab] = useState<TreasuryTab>('Overview');

  const orchestration = useMemo(() => DealOrchestrationEngine.orchestrateDealWorkflow(deal), [deal]);

  const anchorDate = useMemo(
    () => parseDate(deal.funding.scheduledFundingDate) ?? parseDate(deal.workflow.lastUpdated) ?? new Date('2026-01-01'),
    [deal],
  );
  const isoToday = toIsoDate(anchorDate);

  const signaturesStage = orchestration.stages.find((stage) => stage.stageName === 'Signatures');
  const fundingStage = orchestration.stages.find((stage) => stage.stageName.includes('Funding'));
  const collectionsStage = orchestration.stages.find((stage) => stage.stageName === 'Collections');
  const settlementStage = orchestration.stages.find((stage) => stage.stageName === 'Settlement');

  const treasuryStats = useMemo(() => {
    const availableBankLimits = Math.max(deal.commercialStructure.facilityLimit - deal.commercialStructure.approvedFunding, 0);
    const expectedFundingToday = fundingStage && fundingStage.status !== 'Completed'
      ? Math.round(deal.commercialStructure.approvedFunding * (fundingStage.completionPercent / 100))
      : 0;
    const collectionsExpected = collectionsStage
      ? Math.round(deal.commercialStructure.approvedFunding * (Math.max(collectionsStage.completionPercent, 35) / 100))
      : Math.round(deal.commercialStructure.approvedFunding * 0.35);
    const todayLiquidity = availableBankLimits + Math.round(deal.commercialStructure.approvedFunding * 0.2);
    const netLiquidity = todayLiquidity + collectionsExpected - expectedFundingToday;
    const queue = orchestration.gates.filter(
      (gate) => gate.stageName.includes('Funding') || gate.stageName === 'Signatures' || gate.stageName === 'Conditions Precedent',
    ).length;

    return {
      todayLiquidity,
      availableBankLimits,
      expectedFundingToday,
      collectionsExpected,
      netLiquidity,
      fundingQueue: queue,
      treasuryHealth: orchestration.analytics.workflowHealthScore,
    };
  }, [deal, fundingStage, collectionsStage, orchestration]);

  const overviewKpis = useMemo(() => {
    const availableCash = Math.round(treasuryStats.todayLiquidity * 0.55);
    const utilisation = Math.round((deal.commercialStructure.approvedFunding / Math.max(deal.commercialStructure.facilityLimit, 1)) * 100);
    const pendingApprovals = orchestration.gates.reduce((sum, gate) => sum + gate.pendingApprovals.length, 0);
    const expectedCashPosition = availableCash + treasuryStats.collectionsExpected - treasuryStats.expectedFundingToday;
    const averageCostOfFunds = Number((deal.commercialStructure.discountRatePercent + 1.1).toFixed(2));

    return [
      { label: 'Available Cash', value: formatMoney(availableCash, deal.deal.currency) },
      { label: 'Available Credit Lines', value: formatMoney(treasuryStats.availableBankLimits, deal.deal.currency) },
      { label: "Today's Funding", value: formatMoney(treasuryStats.expectedFundingToday, deal.deal.currency) },
      { label: "Today's Collections", value: formatMoney(treasuryStats.collectionsExpected, deal.deal.currency) },
      { label: 'Expected Cash Position', value: formatMoney(expectedCashPosition, deal.deal.currency) },
      { label: 'Utilisation %', value: `${utilisation}%` },
      { label: 'Funding Requests', value: String(treasuryStats.fundingQueue) },
      { label: 'Pending Treasury Approvals', value: String(pendingApprovals) },
      { label: 'Currency Exposure', value: `${deal.deal.currency} ${Math.round(deal.commercialStructure.approvedFunding / 1000000)}M` },
      { label: 'Average Cost of Funds', value: `${averageCostOfFunds}%` },
    ];
  }, [deal, treasuryStats, orchestration]);

  const fundingQueueRows = useMemo(() => {
    const fundingGate = orchestration.gates.find((gate) => gate.stageName.includes('Funding'));
    const legalGate = orchestration.gates.find((gate) => gate.stageName === 'Signatures');
    const cpGate = orchestration.gates.find((gate) => gate.stageName === 'Conditions Precedent');

    const readiness = avg([
      signaturesStage?.completionPercent ?? 0,
      fundingStage?.completionPercent ?? 0,
      settlementStage?.completionPercent ?? 0,
    ]);

    return [
      {
        dealId: deal.deal.dealId,
        client: deal.client.legalName,
        facility: deal.deal.product,
        fundingAmount: deal.commercialStructure.approvedFunding,
        currency: deal.deal.currency,
        fundingDate: deal.funding.scheduledFundingDate,
        priority: orchestration.analytics.overallWorkflowRisk === 'High' ? 'High' : 'Medium',
        currentStatus: deal.deal.status,
        treasuryStatus: fundingStage?.status ?? 'Waiting',
        requiredDocuments: [
          ...(fundingStage?.requiredDocuments ?? []),
          ...(signaturesStage?.requiredDocuments ?? []),
        ].join(', '),
        approvals: [
          ...(fundingGate?.pendingApprovals ?? []),
          ...(legalGate?.pendingApprovals ?? []),
          ...(cpGate?.pendingApprovals ?? []),
        ].join(', ') || 'None Pending',
        fundingReadiness: `${readiness}%`,
      },
    ];
  }, [deal, orchestration, signaturesStage, fundingStage, settlementStage]);

  const bankLines = useMemo(() => {
    const sources = deal.commercialStructure.fundingSource
      .split(/[,|/]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const providers = sources.length > 0 ? sources : [deal.counterparty.name];

    return providers.map((bank, index) => {
      const ratio = 1 / providers.length;
      const limit = Math.round(deal.commercialStructure.facilityLimit * ratio);
      const outstanding = Math.round(deal.commercialStructure.approvedFunding * ratio);
      const available = Math.max(limit - outstanding, 0);
      const utilisation = Math.round((outstanding / Math.max(limit, 1)) * 100);
      return {
        bank,
        facilityLimit: limit,
        outstanding,
        available,
        interestRate: Number((deal.commercialStructure.discountRatePercent + index * 0.25).toFixed(2)),
        expiry: toIsoDate(new Date(anchorDate.getFullYear() + 1, anchorDate.getMonth(), anchorDate.getDate())),
        relationshipManager: deal.client.relationshipManager,
        utilisation,
        health: utilisation > 90 ? 'Needs Attention' : 'Healthy',
      };
    });
  }, [deal, anchorDate]);

  const liquidity = useMemo(() => {
    const incomingCollections = treasuryStats.collectionsExpected;
    const outgoingFunding = treasuryStats.expectedFundingToday;
    const netPosition = incomingCollections - outgoingFunding;

    return {
      cashPosition: treasuryStats.todayLiquidity,
      forecast: treasuryStats.netLiquidity,
      incomingCollections,
      outgoingFunding,
      netPosition,
      forecast7d: treasuryStats.netLiquidity + Math.round(incomingCollections * 0.2),
      forecast30d: treasuryStats.netLiquidity + Math.round(incomingCollections * 0.55),
      currencyBreakdown: [{ currency: deal.deal.currency, amount: treasuryStats.netLiquidity }],
    };
  }, [treasuryStats, deal]);

  const disbursements = useMemo(() => {
    const fundingTimeline = deal.timeline.filter((entry) => {
      const label = `${entry.title} ${entry.description}`.toLowerCase();
      return label.includes('fund') || label.includes('payment') || label.includes('settlement');
    });

    if (fundingTimeline.length === 0) {
      return [
        {
          beneficiary: deal.client.legalName,
          bank: deal.funding.disbursementAccount,
          amount: deal.commercialStructure.approvedFunding,
          currency: deal.deal.currency,
          reference: `${deal.deal.dealId}-DISB-1`,
          status: fundingStage?.status ?? 'Waiting',
          approval: orchestration.gates.find((gate) => gate.stageName.includes('Funding'))?.gateStatus ?? 'Open',
          paymentDate: deal.funding.scheduledFundingDate,
        },
      ];
    }

    return fundingTimeline.map((entry, index) => ({
      beneficiary: deal.client.legalName,
      bank: deal.funding.disbursementAccount,
      amount: Math.round(deal.commercialStructure.approvedFunding / Math.max(fundingTimeline.length, 1)),
      currency: deal.deal.currency,
      reference: `${deal.deal.dealId}-DISB-${index + 1}`,
      status: entry.status,
      approval: orchestration.gates.find((gate) => gate.stageName.includes('Funding'))?.gateStatus ?? 'Open',
      paymentDate: toIsoDate(anchorDate),
    }));
  }, [deal, fundingStage, orchestration, anchorDate]);

  const collectionsForecast = useMemo(() => {
    const dueToday = Math.round(treasuryStats.collectionsExpected * 0.2);
    const dueTomorrow = Math.round(treasuryStats.collectionsExpected * 0.15);
    const thisWeek = Math.round(treasuryStats.collectionsExpected * 0.65);
    const overdue = Math.max(Math.round(deal.commercialStructure.approvedFunding * 0.08), 0);
    const recovery = Math.round(((thisWeek - overdue) / Math.max(thisWeek, 1)) * 100);

    return {
      expectedCollections: treasuryStats.collectionsExpected,
      dueToday,
      dueTomorrow,
      thisWeek,
      overdue,
      recovery,
    };
  }, [treasuryStats, deal]);

  const reconciliationRows = useMemo(() => {
    return [
      {
        item: 'Funding Released',
        status: fundingStage?.status ?? 'Waiting',
        amount: deal.commercialStructure.approvedFunding,
      },
      {
        item: 'Collections Received',
        status: collectionsStage?.status ?? 'Waiting',
        amount: collectionsForecast.thisWeek,
      },
      {
        item: 'Bank Confirmation',
        status: settlementStage?.status ?? 'Pending Approval',
        amount: liquidity.netPosition,
      },
      {
        item: 'Exceptions',
        status: orchestration.gates.some((gate) => gate.blockingIssues.length > 0) ? 'Open' : 'None',
        amount: orchestration.gates.reduce((sum, gate) => sum + gate.blockingIssues.length, 0),
      },
      {
        item: 'Outstanding Items',
        status: orchestration.analytics.nextRecommendedAction,
        amount: orchestration.gates.reduce((sum, gate) => sum + gate.pendingApprovals.length, 0),
      },
    ];
  }, [deal, fundingStage, collectionsStage, settlementStage, collectionsForecast, liquidity, orchestration]);

  const auditRows = useMemo(() => {
    const fromTimeline = orchestration.analytics.timeline.map((entry) => ({
      event: `${entry.stageName}`,
      user: entry.owner,
      timestamp: entry.targetDate,
      status: entry.status,
    }));

    const requiredEvents = [
      'Funding Approved',
      'Funding Released',
      'Payment Sent',
      'Collection Received',
      'Reconciled',
    ];

    const synthesized = requiredEvents.map((event, index) => ({
      event,
      user: deal.client.relationshipManager,
      timestamp: toIsoDate(new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate() + index)),
      status: index <= 1 && (fundingStage?.status === 'Completed' || fundingStage?.status === 'In Progress') ? 'Completed' : 'Pending',
    }));

    return [...synthesized, ...fromTimeline].slice(0, 20);
  }, [orchestration, deal, anchorDate, fundingStage]);

  const sidebar = useMemo(() => {
    const fundingAlerts = orchestration.gates.filter((gate) => gate.stageName.includes('Funding') && gate.gateStatus !== 'Passed').length;
    const liquidityAlerts = liquidity.netPosition < 0 ? 1 : 0;
    const bankLimitAlerts = bankLines.filter((line) => line.utilisation > 90).length;
    const highValuePayments = disbursements.filter((row) => row.amount >= deal.commercialStructure.approvedFunding * 0.5).length;
    const collectionsToday = collectionsForecast.dueToday > 0 ? 1 : 0;
    const pendingApprovals = orchestration.gates.reduce((sum, gate) => sum + gate.pendingApprovals.length, 0);

    return {
      fundingAlerts,
      liquidityAlerts,
      bankLimitAlerts,
      highValuePayments,
      collectionsToday,
      pendingApprovals,
      treasuryRecommendations: orchestration.analytics.nextRecommendedAction,
    };
  }, [orchestration, liquidity, bankLines, disbursements, deal, collectionsForecast]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <SectionCard title="Treasury & Funding Desk" icon={Landmark}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
            {field("Today's Liquidity", formatMoney(treasuryStats.todayLiquidity, deal.deal.currency))}
            {field('Available Bank Limits', formatMoney(treasuryStats.availableBankLimits, deal.deal.currency))}
            {field('Expected Funding Today', formatMoney(treasuryStats.expectedFundingToday, deal.deal.currency))}
            {field('Collections Expected', formatMoney(treasuryStats.collectionsExpected, deal.deal.currency))}
            {field('Net Liquidity', formatMoney(treasuryStats.netLiquidity, deal.deal.currency))}
            {field('Funding Queue', String(treasuryStats.fundingQueue))}
            {field('Treasury Health', `${treasuryStats.treasuryHealth}%`)}
            {field('Workspace Date', isoToday)}
          </div>
        </SectionCard>

        <SectionCard title="Workspace Tabs" icon={ListChecks}>
          <div className="flex flex-wrap gap-2">
            {TREASURY_TABS.map((tab) => (
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
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {overviewKpis.map((kpi) => (
                    <div key={kpi.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">{kpi.label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-100">{kpi.value}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {activeTab === 'Funding Queue' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Deal ID</th>
                        <th className="px-2 py-2">Client</th>
                        <th className="px-2 py-2">Facility</th>
                        <th className="px-2 py-2">Funding Amount</th>
                        <th className="px-2 py-2">Currency</th>
                        <th className="px-2 py-2">Funding Date</th>
                        <th className="px-2 py-2">Priority</th>
                        <th className="px-2 py-2">Current Status</th>
                        <th className="px-2 py-2">Treasury Status</th>
                        <th className="px-2 py-2">Required Documents</th>
                        <th className="px-2 py-2">Approvals</th>
                        <th className="px-2 py-2">Funding Readiness</th>
                        <th className="px-2 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {fundingQueueRows.map((row) => (
                        <tr key={row.dealId} className="border-t border-slate-800">
                          <td className="px-2 py-2 font-semibold text-white">{row.dealId}</td>
                          <td className="px-2 py-2">{row.client}</td>
                          <td className="px-2 py-2">{row.facility}</td>
                          <td className="px-2 py-2">{formatMoney(row.fundingAmount, row.currency)}</td>
                          <td className="px-2 py-2">{row.currency}</td>
                          <td className="px-2 py-2">{row.fundingDate}</td>
                          <td className="px-2 py-2">{row.priority}</td>
                          <td className="px-2 py-2">{row.currentStatus}</td>
                          <td className={`px-2 py-2 ${tone(row.treasuryStatus)}`}>{row.treasuryStatus}</td>
                          <td className="px-2 py-2 max-w-80">{row.requiredDocuments}</td>
                          <td className="px-2 py-2 max-w-80">{row.approvals}</td>
                          <td className="px-2 py-2">{row.fundingReadiness}</td>
                          <td className="px-2 py-2">
                            <div className="flex flex-wrap gap-1">
                              <button type="button" className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">Approve</button>
                              <button type="button" className="rounded border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-xs text-rose-300">Reject</button>
                              <button type="button" className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-300">Hold</button>
                              <button type="button" className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">Fund</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Bank Lines' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Bank</th>
                        <th className="px-2 py-2">Facility Limit</th>
                        <th className="px-2 py-2">Outstanding</th>
                        <th className="px-2 py-2">Available</th>
                        <th className="px-2 py-2">Interest Rate</th>
                        <th className="px-2 py-2">Expiry</th>
                        <th className="px-2 py-2">Relationship Manager</th>
                        <th className="px-2 py-2">Utilisation</th>
                        <th className="px-2 py-2">Health</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {bankLines.map((line) => (
                        <tr key={line.bank} className="border-t border-slate-800">
                          <td className="px-2 py-2 font-semibold text-white">{line.bank}</td>
                          <td className="px-2 py-2">{formatMoney(line.facilityLimit, deal.deal.currency)}</td>
                          <td className="px-2 py-2">{formatMoney(line.outstanding, deal.deal.currency)}</td>
                          <td className="px-2 py-2">{formatMoney(line.available, deal.deal.currency)}</td>
                          <td className="px-2 py-2">{line.interestRate}%</td>
                          <td className="px-2 py-2">{line.expiry}</td>
                          <td className="px-2 py-2">{line.relationshipManager}</td>
                          <td className="px-2 py-2">{line.utilisation}%</td>
                          <td className={`px-2 py-2 ${tone(line.health)}`}>{line.health}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Liquidity' ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {field('Cash Position', formatMoney(liquidity.cashPosition, deal.deal.currency))}
                    {field('Forecast', formatMoney(liquidity.forecast, deal.deal.currency))}
                    {field('Incoming Collections', formatMoney(liquidity.incomingCollections, deal.deal.currency))}
                    {field('Outgoing Funding', formatMoney(liquidity.outgoingFunding, deal.deal.currency))}
                    {field('Net Position', formatMoney(liquidity.netPosition, deal.deal.currency))}
                    {field('7-Day Forecast', formatMoney(liquidity.forecast7d, deal.deal.currency))}
                    {field('30-Day Forecast', formatMoney(liquidity.forecast30d, deal.deal.currency))}
                    {field('Currency Breakdown', `${liquidity.currencyBreakdown[0].currency} only`) }
                  </div>
                </div>
              ) : null}

              {activeTab === 'Disbursements' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Beneficiary</th>
                        <th className="px-2 py-2">Bank</th>
                        <th className="px-2 py-2">Amount</th>
                        <th className="px-2 py-2">Currency</th>
                        <th className="px-2 py-2">Reference</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Approval</th>
                        <th className="px-2 py-2">Payment Date</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {disbursements.map((row) => (
                        <tr key={row.reference} className="border-t border-slate-800">
                          <td className="px-2 py-2">{row.beneficiary}</td>
                          <td className="px-2 py-2">{row.bank}</td>
                          <td className="px-2 py-2">{formatMoney(row.amount, row.currency)}</td>
                          <td className="px-2 py-2">{row.currency}</td>
                          <td className="px-2 py-2">{row.reference}</td>
                          <td className={`px-2 py-2 ${tone(String(row.status))}`}>{row.status}</td>
                          <td className={`px-2 py-2 ${tone(row.approval)}`}>{row.approval}</td>
                          <td className="px-2 py-2">{row.paymentDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Collections Forecast' ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {field('Expected Collections', formatMoney(collectionsForecast.expectedCollections, deal.deal.currency))}
                  {field('Due Today', formatMoney(collectionsForecast.dueToday, deal.deal.currency))}
                  {field('Due Tomorrow', formatMoney(collectionsForecast.dueTomorrow, deal.deal.currency))}
                  {field('This Week', formatMoney(collectionsForecast.thisWeek, deal.deal.currency))}
                  {field('Overdue', formatMoney(collectionsForecast.overdue, deal.deal.currency))}
                  {field('Recovery %', `${collectionsForecast.recovery}%`)}
                </div>
              ) : null}

              {activeTab === 'Reconciliation' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Item</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {reconciliationRows.map((row) => (
                        <tr key={row.item} className="border-t border-slate-800">
                          <td className="px-2 py-2">{row.item}</td>
                          <td className={`px-2 py-2 ${tone(String(row.status))}`}>{row.status}</td>
                          <td className="px-2 py-2">
                            {typeof row.amount === 'number' && row.item !== 'Exceptions' && row.item !== 'Outstanding Items'
                              ? formatMoney(row.amount, deal.deal.currency)
                              : String(row.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                        <th className="px-2 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {auditRows.map((row, index) => (
                        <tr key={`${row.event}-${index + 1}`} className="border-t border-slate-800">
                          <td className="px-2 py-2">{row.event}</td>
                          <td className="px-2 py-2">{row.user}</td>
                          <td className="px-2 py-2">{row.timestamp}</td>
                          <td className={`px-2 py-2 ${tone(row.status)}`}>{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Right Sidebar</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="rounded-lg border border-amber-900/60 bg-amber-950/20 p-3 text-amber-200">Funding Alerts: {sidebar.fundingAlerts}</div>
                  <div className="rounded-lg border border-cyan-900/60 bg-cyan-950/20 p-3 text-cyan-200">Liquidity Alerts: {sidebar.liquidityAlerts}</div>
                  <div className="rounded-lg border border-rose-900/60 bg-rose-950/20 p-3 text-rose-200">Bank Limit Alerts: {sidebar.bankLimitAlerts}</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">High Value Payments: {sidebar.highValuePayments}</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">Collections Today: {sidebar.collectionsToday}</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">Pending Approvals: {sidebar.pendingApprovals}</div>
                  <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-3 text-emerald-200">Treasury Recommendations: {sidebar.treasuryRecommendations}</div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Quick Context</p>
                <div className="mt-3 space-y-2 text-sm text-slate-200">
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Legal Execution: <span className={tone(signaturesStage?.status ?? 'Waiting')}>{signaturesStage?.status ?? 'Waiting'}</span></div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Funding Stage: <span className={tone(fundingStage?.status ?? 'Waiting')}>{fundingStage?.status ?? 'Waiting'}</span></div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Collections Stage: <span className={tone(collectionsStage?.status ?? 'Waiting')}>{collectionsStage?.status ?? 'Waiting'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Treasury Signals" icon={ShieldCheck}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {field('Next Recommended Action', orchestration.analytics.nextRecommendedAction)}
            {field('Estimated Completion Date', orchestration.analytics.estimatedCompletionDate)}
            {field('Critical Path Length', String(orchestration.analytics.criticalPath.length))}
            {field('Dependency Edges', String(orchestration.analytics.dependencyGraph.edges.length))}
          </div>

          <details className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-slate-200">Advanced Information</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 text-sm text-slate-300">
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Stage Count: {orchestration.stages.length}</div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Gate Count: {orchestration.gates.length}</div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Deal Completion: {orchestration.analytics.dealCompletionPercentage}%</div>
            </div>
          </details>
        </SectionCard>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-slate-200"><Wallet className="h-4 w-4 text-cyan-300" /> <p className="mt-2 text-xs uppercase text-slate-500">Desk</p><p className="text-sm font-semibold">Treasury</p></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-slate-200"><Coins className="h-4 w-4 text-cyan-300" /> <p className="mt-2 text-xs uppercase text-slate-500">Source</p><p className="text-sm font-semibold">Deal Orchestration Engine</p></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-slate-200"><Banknote className="h-4 w-4 text-cyan-300" /> <p className="mt-2 text-xs uppercase text-slate-500">Currency</p><p className="text-sm font-semibold">{deal.deal.currency}</p></div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-slate-200"><CalendarDays className="h-4 w-4 text-cyan-300" /> <p className="mt-2 text-xs uppercase text-slate-500">Funding Date</p><p className="text-sm font-semibold">{deal.funding.scheduledFundingDate}</p></div>
        </div>
      </div>
    </div>
  );
}
