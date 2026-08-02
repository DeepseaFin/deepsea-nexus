'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  Gavel,
  GitBranch,
  ShieldAlert,
  Sparkles,
  Timer,
  UserCheck,
  Users,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import { seedOperationsCenterRepository } from '@/lib/workflows/DemoScenario';
import { OpportunityLifecycle } from '@/lib/workflows/WorkflowTransition';
import {
  ApprovalRecord,
  ApprovalRule,
  EscalationRule,
  buildWorkflowStages,
  computeApprovalHealth,
  computeEscalationState,
  resolveApprovalLevels,
} from '@/components/atlas/approval-engine/engine';

type Tab =
  | 'My Approvals'
  | 'Committee'
  | 'Workflow Designer'
  | 'Approval Matrix'
  | 'Escalations'
  | 'Delegations'
  | 'History'
  | 'Analytics';

const TABS: Tab[] = [
  'My Approvals',
  'Committee',
  'Workflow Designer',
  'Approval Matrix',
  'Escalations',
  'Delegations',
  'History',
  'Analytics',
];

function money(value: number, currency: string): string {
  return `${currency} ${Math.round(value).toLocaleString('en-US')}`;
}

function statusClass(status: ApprovalRecord['status']): string {
  if (status === 'Approved') return 'text-emerald-300';
  if (status === 'Under Review') return 'text-cyan-300';
  if (status === 'Pending') return 'text-amber-300';
  if (status === 'Rejected') return 'text-rose-300';
  return 'text-fuchsia-300';
}

function priorityClass(priority: ApprovalRecord['priority']): string {
  if (priority === 'Critical') return 'text-rose-300';
  if (priority === 'High') return 'text-amber-300';
  if (priority === 'Medium') return 'text-cyan-300';
  return 'text-slate-400';
}

function toCreditDecisionHref(deal: string): string {
  if (deal.startsWith('OPP-')) {
    return `/atlas/credit-decision?opportunityId=${deal}`;
  }

  return '/atlas/credit-decision';
}

export default function ApprovalCenterPage() {
  const [activeTab, setActiveTab] = useState<Tab>('My Approvals');
  const [search, setSearch] = useState('');

  const operationsContexts = useMemo(() => seedOperationsCenterRepository(), []);

  const approvalRules = useMemo<ApprovalRule[]>(
    () => [
      {
        id: 'rule-1',
        minAmount: 0,
        maxAmount: 2_000_000,
        country: 'Any',
        product: 'Any',
        riskRating: 'Low',
        relationshipManager: 'Any',
        department: 'Any',
        currency: 'Any',
        clientCategory: 'Any',
        levels: ['Submission', 'Review', 'Final Approval', 'Funding'],
      },
      {
        id: 'rule-2',
        minAmount: 2_000_001,
        maxAmount: 10_000_000,
        country: 'Any',
        product: 'Any',
        riskRating: 'Medium',
        relationshipManager: 'Any',
        department: 'Credit',
        currency: 'Any',
        clientCategory: 'Any',
        levels: ['Submission', 'Review', 'Risk', 'Legal', 'Management', 'Final Approval', 'Funding'],
      },
      {
        id: 'rule-3',
        minAmount: 10_000_001,
        maxAmount: 999_000_000,
        country: 'Any',
        product: 'Any',
        riskRating: 'Any',
        relationshipManager: 'Any',
        department: 'Any',
        currency: 'Any',
        clientCategory: 'Strategic',
        levels: ['Submission', 'Review', 'Risk', 'Legal', 'Treasury', 'Committee', 'Final Approval', 'Funding'],
      },
    ],
    [],
  );

  const escalationRule = useMemo<EscalationRule>(
    () => ({
      id: 'escalation-main',
      slaHours: 8,
      managerEscalationHours: 10,
      departmentEscalationHours: 14,
      executiveEscalationHours: 20,
      reminderScheduleHours: [2, 4, 6],
    }),
    [],
  );

  const baseApprovals = useMemo<ApprovalRecord[]>(
    () => [
      {
        approvalId: 'APR-2026-1001',
        module: 'Deals',
        deal: 'DNX-2026-178',
        client: 'Apex Trade Group',
        requestedBy: 'Riya Sinha',
        approvalType: 'Credit Decision',
        priority: 'Critical',
        requestedDate: '2026-07-06T06:00:00.000Z',
        dueDate: '2026-07-07T12:00:00.000Z',
        currentLevel: 'Risk',
        status: 'Pending',
        decisionRequired: 'Approve / Reject',
        amount: 14_000_000,
        country: 'Saudi Arabia',
        product: 'RF',
        riskRating: 'High',
        relationshipManager: 'Riya Sinha',
        department: 'Credit',
        currency: 'AED',
        clientCategory: 'Strategic',
      },
      {
        approvalId: 'APR-2026-1002',
        module: 'Legal',
        deal: 'DNX-2026-181',
        client: 'Blue Horizon Procurement',
        requestedBy: 'Anika Khan',
        approvalType: 'Legal Exception',
        priority: 'High',
        requestedDate: '2026-07-06T09:30:00.000Z',
        dueDate: '2026-07-07T15:00:00.000Z',
        currentLevel: 'Legal',
        status: 'Under Review',
        decisionRequired: 'Legal Sign-off',
        amount: 8_400_000,
        country: 'United Arab Emirates',
        product: 'SCF',
        riskRating: 'Medium',
        relationshipManager: 'Deepak Rao',
        department: 'Legal',
        currency: 'AED',
        clientCategory: 'Corporate',
      },
      {
        approvalId: 'APR-2026-1003',
        module: 'Treasury',
        deal: 'DNX-2026-190',
        client: 'Crescent Healthcare',
        requestedBy: 'Mohan Patel',
        approvalType: 'Funding Release',
        priority: 'High',
        requestedDate: '2026-07-06T03:00:00.000Z',
        dueDate: '2026-07-07T10:00:00.000Z',
        currentLevel: 'Treasury',
        status: 'Pending',
        decisionRequired: 'Approve Funding',
        amount: 11_200_000,
        country: 'Qatar',
        product: 'POF',
        riskRating: 'Medium',
        relationshipManager: 'Mohan Patel',
        department: 'Treasury',
        currency: 'USD',
        clientCategory: 'Corporate',
      },
      {
        approvalId: 'APR-2026-1004',
        module: 'Collections',
        deal: 'DNX-2026-201',
        client: 'Falcon Energy Trade',
        requestedBy: 'Sana Malik',
        approvalType: 'Escalation Action',
        priority: 'Medium',
        requestedDate: '2026-07-07T01:00:00.000Z',
        dueDate: '2026-07-07T18:00:00.000Z',
        currentLevel: 'Management',
        status: 'Pending',
        decisionRequired: 'Escalation Decision',
        amount: 3_200_000,
        country: 'Bahrain',
        product: 'RF',
        riskRating: 'Low',
        relationshipManager: 'Suresh Menon',
        department: 'Collections',
        currency: 'AED',
        clientCategory: 'SME',
      },
      {
        approvalId: 'APR-2026-1005',
        module: 'Risk',
        deal: 'DNX-2026-207',
        client: 'Summit Industrial Procurement',
        requestedBy: 'Leena George',
        approvalType: 'Risk Override',
        priority: 'Critical',
        requestedDate: '2026-07-05T18:00:00.000Z',
        dueDate: '2026-07-07T09:00:00.000Z',
        currentLevel: 'Committee',
        status: 'Escalated',
        decisionRequired: 'Committee Vote',
        amount: 19_500_000,
        country: 'Saudi Arabia',
        product: 'SCF',
        riskRating: 'High',
        relationshipManager: 'Arjun Pillai',
        department: 'Risk',
        currency: 'AED',
        clientCategory: 'Strategic',
      },
      {
        approvalId: 'APR-2026-1006',
        module: 'Credit Memo',
        deal: 'DNX-2026-211',
        client: 'Atlas Regional Distribution',
        requestedBy: 'Rohan Das',
        approvalType: 'Memo Finalization',
        priority: 'Low',
        requestedDate: '2026-07-07T05:00:00.000Z',
        dueDate: '2026-07-08T11:00:00.000Z',
        currentLevel: 'Review',
        status: 'Under Review',
        decisionRequired: 'Review Notes',
        amount: 1_100_000,
        country: 'United Arab Emirates',
        product: 'RF',
        riskRating: 'Low',
        relationshipManager: 'Deepak Rao',
        department: 'Credit',
        currency: 'AED',
        clientCategory: 'Corporate',
      },
    ],
    [],
  );

  const contextDrivenApprovals = useMemo<ApprovalRecord[]>(() => {
    return operationsContexts
      .filter((context) => context.opportunityLifecycle !== OpportunityLifecycle.DRAFT)
      .map((context, index) => {
        const isExecutive =
          context.opportunityLifecycle === OpportunityLifecycle.SUBMITTED
          || context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW
          || context.opportunityLifecycle === OpportunityLifecycle.APPROVED;

        const lifecycleStatus = context.opportunityLifecycle;
        const currentLevel =
          lifecycleStatus === OpportunityLifecycle.SUBMITTED
            ? 'Submission'
            : lifecycleStatus === OpportunityLifecycle.UNDER_REVIEW
              ? 'Review'
              : lifecycleStatus === OpportunityLifecycle.APPROVED
                ? 'Final Approval'
                : lifecycleStatus === OpportunityLifecycle.FUNDING_ALLOCATED
                  ? 'Funding'
                  : 'Forfaitting';

        const status: ApprovalRecord['status'] =
          lifecycleStatus === OpportunityLifecycle.APPROVED
          || lifecycleStatus === OpportunityLifecycle.FUNDING_ALLOCATED
          || lifecycleStatus === OpportunityLifecycle.RELEASED_FOR_PURCHASE
          || lifecycleStatus === OpportunityLifecycle.PURCHASED
          || lifecycleStatus === OpportunityLifecycle.SETTLING
          || lifecycleStatus === OpportunityLifecycle.SETTLED
          || lifecycleStatus === OpportunityLifecycle.CLOSED
            ? 'Approved'
            : lifecycleStatus === OpportunityLifecycle.UNDER_REVIEW
              ? 'Under Review'
              : 'Pending';

        return {
          approvalId: `APR-${context.workflowId}-${String(index + 1).padStart(2, '0')}`,
          module: isExecutive ? 'Executive' : 'Treasury',
          deal: context.opportunityId,
          client: context.institutionId,
          requestedBy: 'Workflow Orchestrator',
          approvalType: 'Lifecycle Transition',
          priority: isExecutive ? 'High' : 'Medium',
          requestedDate: '2026-07-15T08:00:00.000Z',
          dueDate: '2026-07-15T18:00:00.000Z',
          currentLevel,
          status,
          decisionRequired: isExecutive ? 'Approve / Reject' : 'Release / Hold',
          amount: 6_200_000 + index * 350_000,
          country: 'United Arab Emirates',
          product: 'RF',
          riskRating: isExecutive ? 'Medium' : 'Low',
          relationshipManager: context.currentOwner,
          department: isExecutive ? 'Credit' : 'Treasury',
          currency: 'USD',
          clientCategory: 'Corporate',
        };
      });
  }, [operationsContexts]);

  const mergedBaseApprovals = useMemo<ApprovalRecord[]>(
    () => [...contextDrivenApprovals, ...baseApprovals],
    [baseApprovals, contextDrivenApprovals],
  );

  const approvals = useMemo(() => {
    return mergedBaseApprovals.map((approval) => {
      const computedStatus = computeEscalationState(approval, escalationRule);
      return {
        ...approval,
        status: computedStatus,
        currentLevel: resolveApprovalLevels(approval, approvalRules).includes('Committee') && computedStatus === 'Escalated'
          ? 'Executive Escalation'
          : approval.currentLevel,
      };
    });
  }, [mergedBaseApprovals, escalationRule, approvalRules]);

  const filteredApprovals = useMemo(() => {
    const q = search.trim().toLowerCase();
    return approvals.filter((item) => {
      if (!q) return true;
      const text = [
        item.approvalId,
        item.module,
        item.deal,
        item.client,
        item.requestedBy,
        item.approvalType,
        item.priority,
        item.currentLevel,
        item.status,
      ]
        .join(' ')
        .toLowerCase();
      return text.includes(q);
    });
  }, [approvals, search]);

  const committeeQueues = useMemo(
    () => [
      {
        queue: 'Credit Committee Queue',
        meetingDate: '2026-07-07 14:00',
        agenda: 'High-value facilities and policy exceptions',
        chairperson: 'Chief Credit Officer',
        members: 'Risk Head, Legal Head, Treasury Head',
        quorum: '4/5',
        votingStatus: 'In Progress',
        decision: 'Pending',
        minutes: 'Drafting',
      },
      {
        queue: 'Legal Committee Queue',
        meetingDate: '2026-07-07 16:00',
        agenda: 'Cross-border enforceability exceptions',
        chairperson: 'General Counsel',
        members: 'Legal Ops, Compliance, Credit',
        quorum: '3/4',
        votingStatus: 'Open',
        decision: 'Pending',
        minutes: 'Not Started',
      },
      {
        queue: 'Risk Committee Queue',
        meetingDate: '2026-07-08 10:00',
        agenda: 'Watchlist and concentration breaches',
        chairperson: 'Chief Risk Officer',
        members: 'Risk Analysts, Portfolio Lead',
        quorum: '5/6',
        votingStatus: 'Open',
        decision: 'Pending',
        minutes: 'Not Started',
      },
      {
        queue: 'Treasury Queue',
        meetingDate: '2026-07-07 12:30',
        agenda: 'Funding release approvals and line utilization',
        chairperson: 'Treasury Director',
        members: 'Treasury Ops, Finance Control',
        quorum: '3/3',
        votingStatus: 'Complete',
        decision: 'Approved',
        minutes: 'Published',
      },
      {
        queue: 'Investment Committee',
        meetingDate: '2026-07-09 11:00',
        agenda: 'Strategic corridor facility proposals',
        chairperson: 'Chief Executive Officer',
        members: 'Management, Risk, Finance, Legal',
        quorum: '6/7',
        votingStatus: 'Open',
        decision: 'Pending',
        minutes: 'Not Started',
      },
    ],
    [],
  );

  const delegations = useMemo(
    () => [
      { type: 'Temporary Delegation', user: 'Riya Sinha', delegate: 'Mira Thomas', duration: '2026-07-08 to 2026-07-15', reason: 'Annual Leave' },
      { type: 'Permanent Delegation', user: 'Treasury Director', delegate: 'Mohan Patel', duration: 'Ongoing', reason: 'Deputy Authority' },
      { type: 'Vacation Cover', user: 'General Counsel', delegate: 'Anika Khan', duration: '2026-07-10 to 2026-07-18', reason: 'Travel' },
      { type: 'Deputy Approver', user: 'Chief Risk Officer', delegate: 'Leena George', duration: 'Ongoing', reason: 'Dual Control' },
    ],
    [],
  );

  const historyLog = useMemo(
    () => [
      { action: 'Approve', user: 'Chief Credit Officer', timestamp: '2026-07-07 09:14', decision: 'Approved', comments: 'Aligned with policy and committee vote.', version: 'v4.2', ip: '10.11.4.22' },
      { action: 'Reject', user: 'Risk Officer', timestamp: '2026-07-07 09:32', decision: 'Rejected', comments: 'Exposure breach unresolved.', version: 'v3.8', ip: '10.11.5.42' },
      { action: 'Escalate', user: 'Legal Officer', timestamp: '2026-07-07 10:03', decision: 'Escalated', comments: 'Jurisdictional enforceability exception.', version: 'v5.1', ip: '10.11.7.18' },
      { action: 'Request Information', user: 'Treasury Officer', timestamp: '2026-07-07 10:36', decision: 'Under Review', comments: 'Need confirmation of funding source.', version: 'v2.5', ip: '10.11.3.61' },
      { action: 'Return', user: 'Committee Secretariat', timestamp: '2026-07-07 11:20', decision: 'Pending', comments: 'Resubmit with updated legal annexures.', version: 'v3.0', ip: '10.11.8.11' },
    ],
    [],
  );

  const analytics = useMemo(() => {
    const pending = approvals.filter((a) => a.status === 'Pending').length;
    const approved = approvals.filter((a) => a.status === 'Approved').length;
    const rejected = approvals.filter((a) => a.status === 'Rejected').length;
    const escalated = approvals.filter((a) => a.status === 'Escalated').length;

    return {
      turnaround: '4.8 hours',
      bottlenecks: 'Risk and Legal stages',
      pendingByDepartment: {
        Credit: approvals.filter((a) => a.department === 'Credit' && a.status !== 'Approved').length,
        Risk: approvals.filter((a) => a.department === 'Risk' && a.status !== 'Approved').length,
        Legal: approvals.filter((a) => a.department === 'Legal' && a.status !== 'Approved').length,
        Treasury: approvals.filter((a) => a.department === 'Treasury' && a.status !== 'Approved').length,
      },
      successRate: `${Math.round((approved / Math.max(approvals.length, 1)) * 100)}%`,
      averageCommitteeDuration: '1.6 hours',
      slaBreaches: escalated,
      pending,
      rejected,
      workflowHealth: computeApprovalHealth(approvals),
    };
  }, [approvals]);

  const topMetrics = useMemo(() => {
    const pending = approvals.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length;
    const approvalsToday = historyLog.filter((h) => h.action === 'Approve').length;
    const escalated = approvals.filter((a) => a.status === 'Escalated').length;
    const rejected = historyLog.filter((h) => h.action === 'Reject').length;
    const committeeMeetings = committeeQueues.length;

    return [
      { label: 'Pending Approvals', value: String(pending) },
      { label: 'Approvals Today', value: String(approvalsToday) },
      { label: 'Average Approval Time', value: analytics.turnaround },
      { label: 'Escalated Items', value: String(escalated) },
      { label: 'Rejected Today', value: String(rejected) },
      { label: 'Committee Meetings', value: String(committeeMeetings) },
      { label: 'Approval SLA', value: '92.4%' },
      { label: 'Workflow Health', value: analytics.workflowHealth },
    ];
  }, [approvals, analytics, committeeQueues.length, historyLog]);

  const workflowPreview = useMemo(() => {
    const item = approvals[0];
    if (!item) return [];
    return buildWorkflowStages(item, approvalRules);
  }, [approvals, approvalRules]);

  const aiRecommendations = [
    {
      summary: 'This deal resembles 14 previously approved facilities.',
      confidence: '96%',
      recommendation: 'Recommend approval.',
    },
    {
      summary: 'Legal exception profile matches 6 escalated cases with delayed closure.',
      confidence: '91%',
      recommendation: 'Recommend conditional approval with annexure completion.',
    },
    {
      summary: 'Funding release risk is low with fully matched treasury readiness.',
      confidence: '94%',
      recommendation: 'Recommend approval.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-[1850px] space-y-6 pb-24">
        <SectionCard title="Enterprise Approval Center" icon={Gavel}>
          <p className="text-sm text-slate-300">Institutional Workflow & Decision Management</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
            {topMetrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{metric.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{metric.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Workspace Tabs" icon={Users}>
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
              {activeTab === 'My Approvals' ? (
                <>
                  <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search Approval ID, module, deal, client, requested by, approval type"
                      className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                    />
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Institutional Approval Grid</p>
                    <table className="mt-3 min-w-[1900px] text-left text-sm">
                      <thead className="text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-2 py-2">Approval ID</th>
                          <th className="px-2 py-2">Module</th>
                          <th className="px-2 py-2">Deal</th>
                          <th className="px-2 py-2">Client</th>
                          <th className="px-2 py-2">Requested By</th>
                          <th className="px-2 py-2">Approval Type</th>
                          <th className="px-2 py-2">Priority</th>
                          <th className="px-2 py-2">Requested Date</th>
                          <th className="px-2 py-2">Due Date</th>
                          <th className="px-2 py-2">Current Level</th>
                          <th className="px-2 py-2">Status</th>
                          <th className="px-2 py-2">Decision Required</th>
                          <th className="px-2 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-200">
                        {filteredApprovals.map((item) => (
                          <tr key={item.approvalId} className="border-t border-slate-800">
                            <td className="px-2 py-2 font-semibold text-cyan-300">
                              <Link href={toCreditDecisionHref(item.deal)} className="hover:text-cyan-200">
                                {item.approvalId}
                              </Link>
                            </td>
                            <td className="px-2 py-2">{item.module}</td>
                            <td className="px-2 py-2">
                              <Link href={toCreditDecisionHref(item.deal)} className="hover:text-cyan-200">
                                {item.deal}
                              </Link>
                            </td>
                            <td className="px-2 py-2">{item.client}</td>
                            <td className="px-2 py-2">{item.requestedBy}</td>
                            <td className="px-2 py-2">{item.approvalType}</td>
                            <td className={`px-2 py-2 font-semibold ${priorityClass(item.priority)}`}>{item.priority}</td>
                            <td className="px-2 py-2">{item.requestedDate.slice(0, 10)}</td>
                            <td className="px-2 py-2">{item.dueDate.slice(0, 10)}</td>
                            <td className="px-2 py-2">{item.currentLevel}</td>
                            <td className={`px-2 py-2 font-semibold ${statusClass(item.status)}`}>{item.status}</td>
                            <td className="px-2 py-2">{item.decisionRequired}</td>
                            <td className="px-2 py-2">
                              <div className="flex flex-wrap gap-1">
                                <Link href={toCreditDecisionHref(item.deal)} className="rounded border border-emerald-700/40 bg-emerald-950/30 px-2 py-1 text-xs text-emerald-200 hover:border-emerald-600/60">Approve</Link>
                                <Link href={toCreditDecisionHref(item.deal)} className="rounded border border-rose-700/40 bg-rose-950/30 px-2 py-1 text-xs text-rose-200 hover:border-rose-600/60">Reject</Link>
                                <Link href={toCreditDecisionHref(item.deal)} className="rounded border border-amber-700/40 bg-amber-950/30 px-2 py-1 text-xs text-amber-200 hover:border-amber-600/60">Return</Link>
                                <Link href={toCreditDecisionHref(item.deal)} className="rounded border border-cyan-700/40 bg-cyan-950/30 px-2 py-1 text-xs text-cyan-200 hover:border-cyan-600/60">Request Information</Link>
                                <Link href={toCreditDecisionHref(item.deal)} className="rounded border border-fuchsia-700/40 bg-fuchsia-950/30 px-2 py-1 text-xs text-fuchsia-200 hover:border-fuchsia-600/60">Escalate</Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}

              {activeTab === 'Committee' ? (
                <div className="grid gap-3 xl:grid-cols-2">
                  {committeeQueues.map((queue) => (
                    <div key={queue.queue} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                      <p className="text-sm font-semibold text-slate-100">{queue.queue}</p>
                      <div className="mt-2 space-y-1 text-xs text-slate-300">
                        <p>Meeting Date: {queue.meetingDate}</p>
                        <p>Agenda: {queue.agenda}</p>
                        <p>Chairperson: {queue.chairperson}</p>
                        <p>Members: {queue.members}</p>
                        <p>Quorum: {queue.quorum}</p>
                        <p>Voting Status: {queue.votingStatus}</p>
                        <p>Decision: {queue.decision}</p>
                        <p>Minutes: {queue.minutes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {activeTab === 'Workflow Designer' ? (
                <SectionCard title="Workflow Designer" icon={GitBranch}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {workflowPreview.map((stage, index) => (
                      <div key={stage.key} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-xs text-slate-500">Stage {index + 1}</p>
                        <p className="text-sm font-semibold text-slate-100">{stage.name}</p>
                        <p className="text-xs text-cyan-300">{stage.mode}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Sequential approvals</p><p className="text-sm text-slate-100">Enabled</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Parallel approvals</p><p className="text-sm text-slate-100">Enabled for Committee</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Conditional approvals</p><p className="text-sm text-slate-100">Risk-based branching active</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Multi-level approvals</p><p className="text-sm text-slate-100">Management + Committee chain</p></div>
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'Approval Matrix' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Approval Matrix Rules</p>
                  <table className="mt-3 min-w-[1300px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Rule</th>
                        <th className="px-2 py-2">Amount</th>
                        <th className="px-2 py-2">Country</th>
                        <th className="px-2 py-2">Product</th>
                        <th className="px-2 py-2">Risk Rating</th>
                        <th className="px-2 py-2">Relationship Manager</th>
                        <th className="px-2 py-2">Department</th>
                        <th className="px-2 py-2">Currency</th>
                        <th className="px-2 py-2">Client Category</th>
                        <th className="px-2 py-2">Levels</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {approvalRules.map((rule) => (
                        <tr key={rule.id} className="border-t border-slate-800">
                          <td className="px-2 py-2 font-semibold text-cyan-300">{rule.id}</td>
                          <td className="px-2 py-2">{money(rule.minAmount, 'AED')} - {money(rule.maxAmount, 'AED')}</td>
                          <td className="px-2 py-2">{rule.country}</td>
                          <td className="px-2 py-2">{rule.product}</td>
                          <td className="px-2 py-2">{rule.riskRating}</td>
                          <td className="px-2 py-2">{rule.relationshipManager}</td>
                          <td className="px-2 py-2">{rule.department}</td>
                          <td className="px-2 py-2">{rule.currency}</td>
                          <td className="px-2 py-2">{rule.clientCategory}</td>
                          <td className="px-2 py-2">{rule.levels.join(' -> ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Escalations' ? (
                <SectionCard title="Escalation Rules" icon={AlertTriangle}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">SLA</p><p className="text-sm text-slate-100">{escalationRule.slaHours} hours</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Manager escalation</p><p className="text-sm text-slate-100">{escalationRule.managerEscalationHours} hours</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Department escalation</p><p className="text-sm text-slate-100">{escalationRule.departmentEscalationHours} hours</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Executive escalation</p><p className="text-sm text-slate-100">{escalationRule.executiveEscalationHours} hours</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Reminder schedule</p><p className="text-sm text-slate-100">{escalationRule.reminderScheduleHours.join(', ')} hours</p></div>
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'Delegations' ? (
                <SectionCard title="Delegations" icon={UserCheck}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                    {delegations.map((item) => (
                      <div key={`${item.type}-${item.user}`} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-sm font-semibold text-slate-100">{item.type}</p>
                        <p className="mt-1 text-xs text-slate-300">User: {item.user}</p>
                        <p className="text-xs text-slate-300">Delegate: {item.delegate}</p>
                        <p className="text-xs text-slate-400">Duration: {item.duration}</p>
                        <p className="text-xs text-slate-400">Reason: {item.reason}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              ) : null}

              {activeTab === 'History' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Approval Action Audit</p>
                  <table className="mt-3 min-w-[1200px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Action</th>
                        <th className="px-2 py-2">User</th>
                        <th className="px-2 py-2">Timestamp</th>
                        <th className="px-2 py-2">Decision</th>
                        <th className="px-2 py-2">Comments</th>
                        <th className="px-2 py-2">Version</th>
                        <th className="px-2 py-2">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {historyLog.map((row) => (
                        <tr key={`${row.action}-${row.timestamp}`} className="border-t border-slate-800">
                          <td className="px-2 py-2 font-semibold text-slate-100">{row.action}</td>
                          <td className="px-2 py-2">{row.user}</td>
                          <td className="px-2 py-2">{row.timestamp}</td>
                          <td className="px-2 py-2">{row.decision}</td>
                          <td className="px-2 py-2">{row.comments}</td>
                          <td className="px-2 py-2">{row.version}</td>
                          <td className="px-2 py-2">{row.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Analytics' ? (
                <SectionCard title="Approval Analytics" icon={Timer}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Approval turnaround</p><p className="text-sm text-slate-100">{analytics.turnaround}</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Bottlenecks</p><p className="text-sm text-slate-100">{analytics.bottlenecks}</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Approval success rate</p><p className="text-sm text-slate-100">{analytics.successRate}</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Average committee duration</p><p className="text-sm text-slate-100">{analytics.averageCommitteeDuration}</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">SLA breaches</p><p className="text-sm text-rose-300">{analytics.slaBreaches}</p></div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"><p className="text-xs text-slate-500">Pending by department</p><p className="text-xs text-slate-300">Credit {analytics.pendingByDepartment.Credit}, Risk {analytics.pendingByDepartment.Risk}, Legal {analytics.pendingByDepartment.Legal}, Treasury {analytics.pendingByDepartment.Treasury}</p></div>
                  </div>
                </SectionCard>
              ) : null}
            </div>

            <div className="space-y-4">
              <SectionCard title="Right Sidebar" icon={ShieldAlert}>
                <div className="space-y-2 text-sm">
                  <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-3 text-amber-100">Pending Urgent: {approvals.filter((a) => a.priority === 'Critical' && a.status !== 'Approved').length}</div>
                  <div className="rounded-lg border border-cyan-900/50 bg-cyan-950/20 p-3 text-cyan-100">Awaiting My Decision: {approvals.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length}</div>
                  <div className="rounded-lg border border-fuchsia-900/50 bg-fuchsia-950/20 p-3 text-fuchsia-100">Escalated Items: {approvals.filter((a) => a.status === 'Escalated').length}</div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-slate-200">Committee Today: {committeeQueues.filter((q) => q.meetingDate.startsWith('2026-07-07')).length} meetings</div>
                </div>
              </SectionCard>

              <SectionCard title="AI Recommendations" icon={Sparkles}>
                <div className="space-y-2">
                  {aiRecommendations.map((rec) => (
                    <div key={rec.summary} className="rounded-lg border border-fuchsia-900/40 bg-fuchsia-950/20 p-3">
                      <p className="text-xs text-fuchsia-200">{rec.summary}</p>
                      <p className="mt-1 text-xs text-fuchsia-100">Approval confidence: {rec.confidence}</p>
                      <p className="text-xs text-fuchsia-100">{rec.recommendation}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-30 px-4">
        <div className="mx-auto flex max-w-[1300px] flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-2xl backdrop-blur">
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-emerald-700/40 bg-emerald-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-200"><CheckCircle2 className="h-4 w-4" />Approve</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-rose-700/40 bg-rose-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-rose-200"><AlertTriangle className="h-4 w-4" />Reject</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200"><CheckCircle2 className="h-4 w-4" />Bulk Approve</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200"><Users className="h-4 w-4" />Assign Reviewer</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-amber-700/40 bg-amber-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-200"><Gavel className="h-4 w-4" />Schedule Committee</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><FileText className="h-4 w-4" />Export Minutes</button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-fuchsia-700/40 bg-fuchsia-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-fuchsia-200"><Download className="h-4 w-4" />Generate Decision Report</button>
        </div>
      </div>
    </div>
  );
}
