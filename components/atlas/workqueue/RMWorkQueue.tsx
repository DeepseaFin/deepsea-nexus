'use client';

import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useDeal } from '@/components/atlas/common/DealContext';
import { DealOrchestrationEngine } from '@/atlas-core/orchestration/DealOrchestrationEngine';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

type FundingDateFilter = 'All' | 'Today' | 'This Week' | 'Overdue';

type StageFilter =
  | 'All'
  | 'Lead'
  | 'Client Onboarding'
  | 'Commercial Review'
  | 'Pricing'
  | 'Risk'
  | 'Credit Committee'
  | 'Indicative TS'
  | 'Negotiation'
  | 'Final TS'
  | 'Legal'
  | 'Signatures'
  | 'Funding'
  | 'Settlement'
  | 'Collections'
  | 'Closed';

type StageMetric = {
  stage: StageFilter;
  dealCount: number;
  totalValue: number;
  averageAgeing: number;
  blockedCount: number;
  progressPercent: number;
  indicator: RowIndicator;
};

type RowIndicator = 'Healthy' | 'Needs Attention' | 'Blocked' | 'Funding Ready';

type DealRow = {
  dealId: string;
  client: string;
  facility: string;
  rm: string;
  currentStage: StageFilter;
  progress: number;
  workflowHealth: number;
  fundingAmount: number;
  expectedFundingDate: string;
  daysInStage: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  legalStatus: string;
  requiredAction: string;
  owner: string;
  status: string;
  country: string;
  department: string;
  indicator: RowIndicator;
};

type ContextMenuState = {
  x: number;
  y: number;
  row: DealRow;
};

const PIPELINE_STAGES: StageFilter[] = [
  'Lead',
  'Client Onboarding',
  'Commercial Review',
  'Pricing',
  'Risk',
  'Credit Committee',
  'Indicative TS',
  'Negotiation',
  'Final TS',
  'Legal',
  'Signatures',
  'Funding',
  'Settlement',
  'Collections',
  'Closed',
];

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDate(value: string): Date | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function formatMoney(value: number, currency: string): string {
  return `${currency} ${Math.round(value).toLocaleString('en-US')}`;
}

function stageToPipelineStage(value: string): StageFilter {
  if (value === 'Draft') return 'Lead';
  if (value === 'Client Onboarding') return 'Client Onboarding';
  if (value === 'Commercial Review') return 'Commercial Review';
  if (value === 'Pricing Complete') return 'Pricing';
  if (value === 'Risk Assessment') return 'Risk';
  if (value === 'Credit Committee') return 'Credit Committee';
  if (value === 'Indicative Term Sheet') return 'Indicative TS';
  if (value === 'Commercial Negotiation') return 'Negotiation';
  if (value === 'Final Executable Term Sheet') return 'Final TS';
  if (value === 'Legal Documentation' || value === 'Legal Review') return 'Legal';
  if (value === 'Signatures') return 'Signatures';
  if (value === 'Funding Approval' || value === 'Treasury Funding') return 'Funding';
  if (value === 'Settlement') return 'Settlement';
  if (value === 'Live Monitoring' || value === 'Collections') return 'Collections';
  if (value === 'Facility Closed') return 'Closed';
  return 'Lead';
}

function rowIndicator(row: DealRow): RowIndicator {
  if (row.currentStage === 'Funding' && row.status !== 'Blocked') return 'Funding Ready';
  if (row.status === 'Blocked' || row.riskRating === 'Critical') return 'Blocked';
  if (row.workflowHealth < 75 || row.status === 'Pending Approval') return 'Needs Attention';
  return 'Healthy';
}

function indicatorClass(indicator: RowIndicator): string {
  if (indicator === 'Healthy') return 'bg-emerald-500';
  if (indicator === 'Needs Attention') return 'bg-amber-500';
  if (indicator === 'Blocked') return 'bg-rose-500';
  return 'bg-cyan-500';
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function progressBlocks(value: number): string {
  const capped = Math.max(0, Math.min(100, value));
  const filled = Math.round(capped / 10);
  const empty = 10 - filled;
  return `${'█'.repeat(filled)}${'░'.repeat(empty)}`;
}

function indicatorTextClass(indicator: RowIndicator): string {
  if (indicator === 'Healthy') return 'text-emerald-300';
  if (indicator === 'Needs Attention') return 'text-amber-300';
  if (indicator === 'Blocked') return 'text-rose-300';
  return 'text-cyan-300';
}

function toCsv(rows: DealRow[]): string {
  const header = [
    'Deal ID',
    'Client',
    'Facility',
    'RM',
    'Current Stage',
    'Progress %',
    'Workflow Health',
    'Funding Amount',
    'Expected Funding Date',
    'Days in Stage',
    'Priority',
    'Risk Rating',
    'Legal Status',
    'Required Action',
    'Owner',
    'Status',
  ];

  const body = rows.map((row) => [
    row.dealId,
    row.client,
    row.facility,
    row.rm,
    row.currentStage,
    row.progress,
    row.workflowHealth,
    row.fundingAmount,
    row.expectedFundingDate,
    row.daysInStage,
    row.priority,
    row.riskRating,
    row.legalStatus,
    row.requiredAction,
    row.owner,
    row.status,
  ]);

  return [header, ...body]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\n');
}

function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function RMWorkQueue() {
  const router = useRouter();
  const { deal } = useDeal();
  const activityFeedRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState('');
  const [rmFilter, setRmFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState<'All' | DealRow['riskRating']>('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [fundingDateFilter, setFundingDateFilter] = useState<FundingDateFilter>('All');
  const [legalFilter, setLegalFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState<StageFilter | 'All'>('All');
  const [sortColumn, setSortColumn] = useState<keyof DealRow>('dealId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const orchestration = useMemo(() => DealOrchestrationEngine.orchestrateDealWorkflow(deal), [deal]);

  const rows = useMemo<DealRow[]>(() => {
    const current = orchestration.stages.find((stage) => stage.stageId === orchestration.stateMachine.currentStageId);
    const legalStage = orchestration.stages.find((stage) => stage.stageName === 'Legal Documentation' || stage.stageName === 'Legal Review');
    const fundingStage = orchestration.stages.find((stage) => stage.stageName === 'Treasury Funding' || stage.stageName === 'Funding Approval');
    const today = new Date();

    const currentStageStart = parseDate(current?.startDate ?? '');
    const daysInStage = currentStageStart
      ? Math.max(Math.floor((today.getTime() - currentStageStart.getTime()) / (1000 * 60 * 60 * 24)), 0)
      : 0;

    const expectedFundingDate =
      parseDate(deal.funding.scheduledFundingDate) ??
      parseDate(fundingStage?.targetDate ?? '') ??
      new Date();

    const priority: DealRow['priority'] = current?.status === 'Blocked'
      ? 'Critical'
      : orchestration.analytics.overallWorkflowRisk === 'High' || orchestration.analytics.overallWorkflowRisk === 'Critical'
        ? 'High'
        : orchestration.analytics.overallWorkflowRisk === 'Medium'
          ? 'Medium'
          : 'Low';

    const row: DealRow = {
      dealId: deal.deal.dealId,
      client: deal.client.legalName,
      facility: deal.deal.dealName,
      rm: deal.client.relationshipManager,
      currentStage: stageToPipelineStage(current?.stageName ?? 'Draft'),
      progress: orchestration.analytics.progressPercentage,
      workflowHealth: orchestration.analytics.workflowHealthScore,
      fundingAmount: deal.commercialStructure.approvedFunding,
      expectedFundingDate: toIsoDate(expectedFundingDate),
      daysInStage,
      priority,
      riskRating: orchestration.analytics.overallWorkflowRisk,
      legalStatus: legalStage?.status ?? 'Waiting',
      requiredAction: orchestration.analytics.nextRecommendedAction,
      owner: current?.owner ?? 'Relationship Manager',
      status: current?.status ?? 'Waiting',
      country: deal.client.country,
      department: current?.department ?? 'Origination',
      indicator: 'Healthy',
    };

    row.indicator = rowIndicator(row);

    return [row];
  }, [deal, orchestration]);

  const filterOptions = useMemo(() => {
    const uniq = <T,>(values: T[]): T[] => Array.from(new Set(values));
    return {
      rms: ['All', ...uniq(rows.map((row) => row.rm))],
      clients: ['All', ...uniq(rows.map((row) => row.client))],
      countries: ['All', ...uniq(rows.map((row) => row.country))],
      statuses: ['All', ...uniq(rows.map((row) => row.status))],
      legalStatuses: ['All', ...uniq(rows.map((row) => row.legalStatus))],
      departments: ['All', ...uniq(rows.map((row) => row.department))],
    };
  }, [rows]);

  const filteredRows = useMemo(() => {
    const today = toIsoDate(new Date());
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);

    return rows
      .filter((row) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          row.dealId.toLowerCase().includes(q) ||
          row.client.toLowerCase().includes(q) ||
          row.facility.toLowerCase().includes(q)
        );
      })
      .filter((row) => (rmFilter === 'All' ? true : row.rm === rmFilter))
      .filter((row) => (clientFilter === 'All' ? true : row.client === clientFilter))
      .filter((row) => (countryFilter === 'All' ? true : row.country === countryFilter))
      .filter((row) => (riskFilter === 'All' ? true : row.riskRating === riskFilter))
      .filter((row) => (statusFilter === 'All' ? true : row.status === statusFilter))
      .filter((row) => (legalFilter === 'All' ? true : row.legalStatus === legalFilter))
      .filter((row) => (departmentFilter === 'All' ? true : row.department === departmentFilter))
      .filter((row) => (stageFilter === 'All' ? true : row.currentStage === stageFilter))
      .filter((row) => {
        if (fundingDateFilter === 'All') return true;
        const date = parseDate(row.expectedFundingDate);
        if (!date) return false;
        const iso = toIsoDate(date);
        if (fundingDateFilter === 'Today') return iso === today;
        if (fundingDateFilter === 'This Week') return date >= new Date(today) && date <= in7Days;
        return date < new Date(today);
      })
      .sort((left, right) => {
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
    rows,
    search,
    rmFilter,
    clientFilter,
    countryFilter,
    riskFilter,
    statusFilter,
    legalFilter,
    departmentFilter,
    stageFilter,
    fundingDateFilter,
    sortColumn,
    sortDirection,
  ]);

  const stageMetrics = useMemo<StageMetric[]>(() => {
    return PIPELINE_STAGES.map((stage) => {
      const stageRows = filteredRows.filter((row) => row.currentStage === stage);
      const stageOrchestration = orchestration.stages.find(
        (item) => stageToPipelineStage(item.stageName) === stage,
      );
      const stageProgress =
        stageRows.length > 0
          ? avg(stageRows.map((row) => row.progress))
          : Math.round(stageOrchestration?.completionPercent ?? 0);

      const stageIndicator: RowIndicator =
        stageRows.length > 0
          ? rowIndicator(stageRows[0])
          : stageOrchestration?.status === 'Blocked'
            ? 'Blocked'
            : stageOrchestration?.status === 'Pending Approval'
              ? 'Needs Attention'
              : stage === 'Funding' && stageOrchestration?.status === 'In Progress'
                ? 'Funding Ready'
                : 'Healthy';

      return {
        stage,
        dealCount: stageRows.length,
        totalValue: stageRows.reduce((sum, row) => sum + row.fundingAmount, 0),
        averageAgeing: avg(stageRows.map((row) => row.daysInStage)),
        blockedCount: stageRows.filter((row) => row.status === 'Blocked').length,
        progressPercent: stageProgress,
        indicator: stageIndicator,
      };
    });
  }, [filteredRows, orchestration]);

  const executive = useMemo(() => {
    const now = new Date();
    const today = toIsoDate(now);
    const week = new Date(now);
    week.setDate(week.getDate() + 7);

    const totalDeals = rows.length;
    const activeDeals = rows.filter((row) => row.currentStage !== 'Closed').length;
    const pendingApprovals = rows.filter((row) => row.status === 'Pending Approval').length;
    const fundingToday = rows.filter((row) => row.expectedFundingDate === today).length;
    const legalPending = rows.filter((row) => row.legalStatus !== 'Completed').length;
    const blockedDeals = rows.filter((row) => row.status === 'Blocked').length;
    const averageDealCompletion = avg(rows.map((row) => row.progress));
    const portfolioExposure = rows.reduce((sum, row) => sum + row.fundingAmount, 0);
    const expectedFundingThisWeek = rows
      .filter((row) => {
        const value = parseDate(row.expectedFundingDate);
        return value ? value <= week && value >= now : false;
      })
      .reduce((sum, row) => sum + row.fundingAmount, 0);
    const collectionsDueToday = rows.filter((row) => row.currentStage === 'Collections' && row.expectedFundingDate === today).length;
    const averageProcessingTime = avg(rows.map((row) => row.daysInStage));
    const workflowHealthScore = avg(rows.map((row) => row.workflowHealth));

    return {
      totalDeals,
      activeDeals,
      pendingApprovals,
      fundingToday,
      legalPending,
      blockedDeals,
      averageDealCompletion,
      portfolioExposure,
      expectedFundingThisWeek,
      collectionsDueToday,
      averageProcessingTime,
      workflowHealthScore,
    };
  }, [rows]);

  const recentEvents = useMemo(() => {
    const eventMap: Record<string, string> = {
      Draft: 'Deal Created',
      'Risk Assessment': 'Risk Approved',
      'Pricing Complete': 'Pricing Updated',
      'Indicative Term Sheet': 'Term Sheet Generated',
      'Legal Documentation': 'Legal Package Generated',
      'Treasury Funding': 'Funding Released',
      Settlement: 'Settlement Completed',
      Collections: 'Collections Started',
      'Facility Closed': 'Facility Closed',
    };

    return orchestration.stages
      .filter((stage) => stage.status === 'Completed' || stage.status === 'In Progress')
      .map((stage) => ({
        title: eventMap[stage.stageName] ?? `${stage.stageName} Updated`,
        stageName: stage.stageName,
        date: stage.targetDate,
        status: stage.status,
      }))
      .slice(-8)
      .reverse();
  }, [orchestration]);

  const operationsPanel = useMemo(() => {
    const today = toIsoDate(new Date());
    const pendingCreditApprovals = rows.filter(
      (row) => row.status === 'Pending Approval' && row.currentStage === 'Credit Committee',
    ).length;
    const highRiskDeals = rows.filter(
      (row) => row.riskRating === 'High' || row.riskRating === 'Critical',
    ).length;
    const slaBreaches = rows.filter((row) => row.daysInStage > 7).length;
    const escalations = rows.filter((row) => row.priority === 'Critical').length;
    const staffWorkload = avg(rows.map((row) => row.daysInStage * Math.max(row.progress, 1)));

    return {
      todaysFunding: rows.filter((row) => row.expectedFundingDate === today).length,
      pendingLegal: rows.filter((row) => row.legalStatus !== 'Completed').length,
      pendingCreditApprovals,
      collectionsDueToday: rows.filter(
        (row) => row.currentStage === 'Collections' && row.expectedFundingDate === today,
      ).length,
      highRiskDeals,
      slaBreaches,
      escalations,
      workflowHealth: executive.workflowHealthScore,
      staffWorkload,
    };
  }, [rows, executive]);

  const chartData = useMemo(() => {
    const totalFunding = Math.max(rows.reduce((sum, row) => sum + row.fundingAmount, 0), 1);
    const collections = Math.round(totalFunding * 0.35);
    const legalPending = rows.filter((row) => row.legalStatus !== 'Completed').length;
    const legalDone = Math.max(rows.length - legalPending, 0);
    const healthy = rows.filter((row) => row.indicator === 'Healthy').length;
    const attention = rows.filter((row) => row.indicator === 'Needs Attention').length;
    const blocked = rows.filter((row) => row.indicator === 'Blocked').length;
    const ready = rows.filter((row) => row.indicator === 'Funding Ready').length;

    return {
      fundingPipeline: [
        { label: 'Expected', value: totalFunding },
        { label: 'This Week', value: executive.expectedFundingThisWeek },
        { label: 'Today', value: rows.filter((row) => row.expectedFundingDate === toIsoDate(new Date())).reduce((sum, row) => sum + row.fundingAmount, 0) },
      ],
      collections: [
        { label: 'Due', value: collections },
        { label: 'Received', value: Math.round(collections * 0.65) },
        { label: 'Overdue', value: Math.round(collections * 0.2) },
      ],
      dealDistribution: [
        { label: 'Active', value: executive.activeDeals },
        { label: 'Blocked', value: executive.blockedDeals },
        { label: 'Closed', value: Math.max(executive.totalDeals - executive.activeDeals, 0) },
      ],
      riskDistribution: [
        { label: 'Healthy', value: healthy },
        { label: 'Attention', value: attention },
        { label: 'Blocked', value: blocked },
        { label: 'Ready', value: ready },
      ],
      legalStatus: [
        { label: 'Pending', value: legalPending },
        { label: 'Completed', value: legalDone },
      ],
    };
  }, [rows, executive]);

  const todaysCalendar = useMemo(() => {
    const today = toIsoDate(new Date());
    return [
      {
        bucket: 'Funding',
        count: rows.filter((row) => row.expectedFundingDate === today).length,
        detail: rows.filter((row) => row.expectedFundingDate === today).map((row) => row.dealId).join(' | ') || 'No funding slots scheduled',
      },
      {
        bucket: 'Meetings',
        count: orchestration.gates.filter((gate) => gate.pendingApprovals.length > 0).length,
        detail: 'Credit and legal follow-up meetings from pending approval gates',
      },
      {
        bucket: 'Collections',
        count: rows.filter((row) => row.currentStage === 'Collections').length,
        detail: 'Collections monitoring and callback windows',
      },
      {
        bucket: 'Approvals',
        count: executive.pendingApprovals,
        detail: 'Pending approvals requiring same-day resolution',
      },
    ];
  }, [rows, orchestration, executive]);

  const activityFeed = useMemo(() => {
    return recentEvents.map((event, index) => {
      const severity =
        event.status === 'Blocked'
          ? 'Blocked'
          : event.status === 'Pending Approval'
            ? 'Attention'
            : event.stageName === 'Funding' || event.stageName === 'Treasury Funding'
              ? 'Ready'
              : 'Healthy';

      return {
        id: `${event.title}-${index + 1}`,
        ...event,
        severity,
      };
    });
  }, [recentEvents]);

  useEffect(() => {
    if (!activityFeedRef.current) return;
    activityFeedRef.current.scrollTop = 0;
  }, [activityFeed]);

  const resetFilters = (): void => {
    setSearch('');
    setRmFilter('All');
    setClientFilter('All');
    setCountryFilter('All');
    setRiskFilter('All');
    setStatusFilter('All');
    setFundingDateFilter('All');
    setLegalFilter('All');
    setDepartmentFilter('All');
    setStageFilter('All');
  };

  const toggleSort = (column: keyof DealRow): void => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }
    setSortColumn(column);
    setSortDirection('asc');
  };

  const handleRowContextMenu = (event: MouseEvent<HTMLTableRowElement>, row: DealRow): void => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      row,
    });
  };

  const closeContextMenu = (): void => {
    setContextMenu(null);
  };

  const openFromContext = (target: 'deal' | 'client' | 'funding' | 'risk' | 'legal'): void => {
    if (target === 'deal') router.push('/atlas/deals');
    if (target === 'client') router.push('/atlas/clients');
    if (target === 'funding') router.push('/atlas/deals');
    if (target === 'risk') router.push('/atlas/deals');
    if (target === 'legal') router.push('/atlas/deals');
    closeContextMenu();
  };

  const activityClass = (severity: string): string => {
    if (severity === 'Blocked') return 'border-rose-900/60 bg-rose-950/20 text-rose-200';
    if (severity === 'Attention') return 'border-amber-900/60 bg-amber-950/20 text-amber-200';
    if (severity === 'Ready') return 'border-cyan-900/60 bg-cyan-950/20 text-cyan-200';
    return 'border-emerald-900/60 bg-emerald-950/20 text-emerald-200';
  };

  const barWidth = (value: number, max: number): string => {
    const width = max <= 0 ? 0 : Math.round((value / max) * 100);
    return `${Math.max(0, Math.min(100, width))}%`;
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Institutional Work Queue">
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Total Deals</p><p className="mt-1 text-lg font-semibold text-white">{executive.totalDeals}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Active Deals</p><p className="mt-1 text-lg font-semibold text-white">{executive.activeDeals}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Pending Approvals</p><p className="mt-1 text-lg font-semibold text-white">{executive.pendingApprovals}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Funding Today</p><p className="mt-1 text-lg font-semibold text-white">{executive.fundingToday}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Legal Pending</p><p className="mt-1 text-lg font-semibold text-white">{executive.legalPending}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Blocked Deals</p><p className="mt-1 text-lg font-semibold text-white">{executive.blockedDeals}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Average Deal Completion</p><p className="mt-1 text-lg font-semibold text-white">{executive.averageDealCompletion}%</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Portfolio Exposure</p><p className="mt-1 text-lg font-semibold text-white">{formatMoney(executive.portfolioExposure, deal.deal.currency)}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Expected Funding This Week</p><p className="mt-1 text-lg font-semibold text-white">{formatMoney(executive.expectedFundingThisWeek, deal.deal.currency)}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Collections Due Today</p><p className="mt-1 text-lg font-semibold text-white">{executive.collectionsDueToday}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Average Processing Time</p><p className="mt-1 text-lg font-semibold text-white">{executive.averageProcessingTime} days</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Workflow Health Score</p><p className="mt-1 text-lg font-semibold text-white">{executive.workflowHealthScore}%</p></div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workflow Pipeline</p>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {stageMetrics.map((metric) => (
                <button
                  key={metric.stage}
                  type="button"
                  onClick={() => setStageFilter(metric.stage)}
                  className={`min-w-56 rounded-lg border p-3 text-left transition ${stageFilter === metric.stage ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{metric.stage}</p>
                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${indicatorTextClass(metric.indicator)}`}>{metric.indicator}</span>
                  </div>
                  <p className={`mt-2 font-mono text-xs ${indicatorTextClass(metric.indicator)}`}>{progressBlocks(metric.progressPercent)}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-800">
                    <div className={`${indicatorClass(metric.indicator)} h-1.5 rounded-full`} style={{ width: `${metric.progressPercent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Deals: {metric.dealCount}</p>
                  <p className="text-xs text-slate-400">Total Value: {formatMoney(metric.totalValue, deal.deal.currency)}</p>
                  <p className="text-xs text-slate-400">Average Ageing: {metric.averageAgeing} days</p>
                  <p className="text-xs text-rose-300">Blocked: {metric.blockedCount}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-6">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search deals" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-500/50" />
              <select value={rmFilter} onChange={(event) => setRmFilter(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.rms.map((value) => <option key={value}>{value}</option>)}</select>
              <select value={clientFilter} onChange={(event) => setClientFilter(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.clients.map((value) => <option key={value}>{value}</option>)}</select>
              <select value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.countries.map((value) => <option key={value}>{value}</option>)}</select>
              <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value as 'All' | DealRow['riskRating'])} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"><option>All</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.statuses.map((value) => <option key={value}>{value}</option>)}</select>
              <select value={fundingDateFilter} onChange={(event) => setFundingDateFilter(event.target.value as FundingDateFilter)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"><option>All</option><option>Today</option><option>This Week</option><option>Overdue</option></select>
              <select value={legalFilter} onChange={(event) => setLegalFilter(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.legalStatuses.map((value) => <option key={value}>{value}</option>)}</select>
              <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">{filterOptions.departments.map((value) => <option key={value}>{value}</option>)}</select>
              <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value as StageFilter | 'All')} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"><option>All</option>{PIPELINE_STAGES.map((value) => <option key={value}>{value}</option>)}</select>
              <button type="button" onClick={resetFilters} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:border-slate-600">Reset Filters</button>
              <button type="button" onClick={() => downloadCsv(toCsv(filteredRows), `work-queue-${toIsoDate(new Date())}.csv`)} className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">Export Excel</button>
              <button type="button" onClick={() => window.print()} className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">Export PDF</button>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live Deal Table</p>
                <div className="mt-3 max-h-[420px] overflow-auto rounded-lg border border-slate-800">
                  <table className="min-w-[1500px] w-full border-collapse text-left text-xs">
                    <thead className="sticky top-0 z-20 bg-slate-900">
                      <tr className="border-b border-slate-700 text-slate-300">
                        <th className="sticky left-0 z-30 bg-slate-900 px-2 py-2 cursor-pointer" onClick={() => toggleSort('dealId')}>Deal ID</th>
                        <th className="px-2 py-2 cursor-pointer" onClick={() => toggleSort('client')}>Client</th>
                        <th className="px-2 py-2 cursor-pointer" onClick={() => toggleSort('facility')}>Facility</th>
                        <th className="px-2 py-2">RM</th>
                        <th className="px-2 py-2">Current Stage</th>
                        <th className="px-2 py-2 cursor-pointer" onClick={() => toggleSort('progress')}>Progress %</th>
                        <th className="px-2 py-2 cursor-pointer" onClick={() => toggleSort('workflowHealth')}>Workflow Health</th>
                        <th className="px-2 py-2">Funding Amount</th>
                        <th className="px-2 py-2">Expected Funding Date</th>
                        <th className="px-2 py-2">Days in Stage</th>
                        <th className="px-2 py-2">Priority</th>
                        <th className="px-2 py-2">Risk Rating</th>
                        <th className="px-2 py-2">Legal Status</th>
                        <th className="px-2 py-2">Required Action</th>
                        <th className="px-2 py-2">Owner</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.map((row) => (
                        <tr
                          key={row.dealId}
                          onClick={() => router.push('/atlas/deals')}
                          onContextMenu={(event) => handleRowContextMenu(event, row)}
                          className="cursor-pointer border-b border-slate-800/70 text-slate-200 transition hover:bg-slate-900/80"
                        >
                          <td className="sticky left-0 z-10 bg-slate-950 px-2 py-2 font-semibold text-white">
                            <div className="flex items-center gap-2">
                              <span className={`inline-block h-2.5 w-2.5 rounded-full ${indicatorClass(row.indicator)}`} />
                              <span>{row.dealId}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2">{row.client}</td>
                          <td className="px-2 py-2">{row.facility}</td>
                          <td className="px-2 py-2">{row.rm}</td>
                          <td className="px-2 py-2">{row.currentStage}</td>
                          <td className="px-2 py-2">{row.progress}%</td>
                          <td className="px-2 py-2">{row.workflowHealth}%</td>
                          <td className="px-2 py-2">{formatMoney(row.fundingAmount, deal.deal.currency)}</td>
                          <td className="px-2 py-2">{row.expectedFundingDate}</td>
                          <td className="px-2 py-2">{row.daysInStage}</td>
                          <td className="px-2 py-2">{row.priority}</td>
                          <td className="px-2 py-2">{row.riskRating}</td>
                          <td className="px-2 py-2">{row.legalStatus}</td>
                          <td className="px-2 py-2 max-w-80 truncate" title={row.requiredAction}>{row.requiredAction}</td>
                          <td className="px-2 py-2">{row.owner}</td>
                          <td className="px-2 py-2">{row.status}</td>
                          <td className="px-2 py-2">
                            <button type="button" onClick={(event) => { event.stopPropagation(); router.push('/atlas/deals'); }} className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] uppercase tracking-wide text-cyan-300">Open</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Funding Pipeline</p>
                  <div className="mt-3 space-y-2 text-xs text-slate-200">
                    {chartData.fundingPipeline.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between"><span>{item.label}</span><span>{formatMoney(item.value, deal.deal.currency)}</span></div>
                        <div className="mt-1 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-cyan-500" style={{ width: barWidth(item.value, chartData.fundingPipeline[0].value) }} /></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Collections</p>
                  <div className="mt-3 space-y-2 text-xs text-slate-200">
                    {chartData.collections.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between"><span>{item.label}</span><span>{formatMoney(item.value, deal.deal.currency)}</span></div>
                        <div className="mt-1 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-emerald-500" style={{ width: barWidth(item.value, chartData.collections[0].value) }} /></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Deal Distribution</p>
                  <div className="mt-3 space-y-2 text-xs text-slate-200">
                    {chartData.dealDistribution.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between"><span>{item.label}</span><span>{item.value}</span></div>
                        <div className="mt-1 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-indigo-500" style={{ width: barWidth(item.value, Math.max(chartData.dealDistribution[0].value, 1)) }} /></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Risk Distribution</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    {chartData.riskDistribution.map((item) => (
                      <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-200">
                        <p className="text-slate-400">{item.label}</p>
                        <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Legal Status</p>
                  <div className="mt-3 space-y-2 text-xs text-slate-200">
                    {chartData.legalStatus.map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between"><span>{item.label}</span><span>{item.value}</span></div>
                        <div className="mt-1 h-2 rounded-full bg-slate-800"><div className="h-2 rounded-full bg-amber-500" style={{ width: barWidth(item.value, Math.max(rows.length, 1)) }} /></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Today&apos;s Calendar</p>
                  <div className="mt-3 space-y-2 text-xs text-slate-200">
                    {todaysCalendar.map((slot) => (
                      <div key={slot.bucket} className="rounded-lg border border-slate-800 bg-slate-900/60 p-2">
                        <p className="font-semibold text-white">{slot.bucket} ({slot.count})</p>
                        <p className="mt-1 text-slate-400">{slot.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Activity Feed</p>
                <div ref={activityFeedRef} className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
                  {activityFeed.map((event) => (
                    <div key={event.id} className={`rounded-lg border p-3 text-sm ${activityClass(event.severity)}`}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">{event.title}</p>
                        <span className="text-xs uppercase tracking-wide">{event.severity}</span>
                      </div>
                      <p className="mt-1 text-xs opacity-80">{event.stageName} | {event.status} | {event.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Operations Panel</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="rounded-lg border border-cyan-900/60 bg-cyan-950/20 p-3 text-cyan-200">Today&apos;s Funding: {operationsPanel.todaysFunding}</div>
                  <div className="rounded-lg border border-amber-900/60 bg-amber-950/20 p-3 text-amber-200">Pending Legal: {operationsPanel.pendingLegal}</div>
                  <div className="rounded-lg border border-amber-900/60 bg-amber-950/20 p-3 text-amber-200">Pending Credit Approvals: {operationsPanel.pendingCreditApprovals}</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">Collections Due Today: {operationsPanel.collectionsDueToday}</div>
                  <div className="rounded-lg border border-rose-900/60 bg-rose-950/20 p-3 text-rose-200">High Risk Deals: {operationsPanel.highRiskDeals}</div>
                  <div className="rounded-lg border border-rose-900/60 bg-rose-950/20 p-3 text-rose-200">SLA Breaches: {operationsPanel.slaBreaches}</div>
                  <div className="rounded-lg border border-rose-900/60 bg-rose-950/20 p-3 text-rose-200">Escalations: {operationsPanel.escalations}</div>
                  <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-3 text-emerald-200">Workflow Health: {operationsPanel.workflowHealth}%</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">Staff Workload: {operationsPanel.staffWorkload}</div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quick Actions</p>
                <div className="mt-3 grid gap-2">
                  <button type="button" onClick={() => router.push('/atlas/deals')} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm text-slate-200 hover:border-cyan-500/50">New Deal</button>
                  <button type="button" onClick={() => router.push('/atlas/clients')} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm text-slate-200 hover:border-cyan-500/50">New Client</button>
                  <button type="button" onClick={() => router.push('/atlas/deals')} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm text-slate-200 hover:border-cyan-500/50">Generate Credit Memo</button>
                  <button type="button" onClick={() => router.push('/atlas/term-sheets')} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm text-slate-200 hover:border-cyan-500/50">Generate Term Sheet</button>
                  <button type="button" onClick={() => router.push('/atlas/deals')} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm text-slate-200 hover:border-cyan-500/50">Generate Legal Package</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {contextMenu ? (
        <div className="fixed inset-0 z-50" onClick={closeContextMenu}>
          <div
            className="absolute min-w-52 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-2xl"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="px-3 py-2 text-xs uppercase tracking-wide text-slate-500">{contextMenu.row.dealId}</p>
            <button type="button" onClick={() => openFromContext('deal')} className="block w-full rounded px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800">Open Deal</button>
            <button type="button" onClick={() => openFromContext('client')} className="block w-full rounded px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800">Open Client</button>
            <button type="button" onClick={() => openFromContext('funding')} className="block w-full rounded px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800">Funding History</button>
            <button type="button" onClick={() => openFromContext('risk')} className="block w-full rounded px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800">Risk Workspace</button>
            <button type="button" onClick={() => openFromContext('legal')} className="block w-full rounded px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800">Legal Workspace</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
