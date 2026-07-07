import RMWorkQueue from '@/components/atlas/workqueue/RMWorkQueue';
import WorkspaceScaffold from '@/components/atlas/design-system/WorkspaceScaffold';

export default function WorkQueuePage() {
  return (
    <WorkspaceScaffold
      title="Institutional Work Queue"
      subtitle="Operational command center for prioritization, approvals, and cross-desk execution."
      status={{ label: 'Monitored', tone: 'warning' }}
      headerFields={[
        { label: 'Queue Type', value: 'Institutional Operations' },
        { label: 'Ownership', value: 'RM + Risk + Legal + Treasury' },
        { label: 'SLA', value: 'Continuous' },
      ]}
      actions={[
        { label: 'Go to Deals', href: '/atlas/deals' },
        { label: 'Go to Dashboard', href: '/atlas/dashboard' },
      ]}
      kpis={[
        { label: 'Queue Health', value: 'Live', note: 'Sourced from orchestration and gate status' },
        { label: 'Execution', value: 'Institutional', note: 'Aligned to operations center design' },
      ]}
      tabs={[
        { key: 'overview', label: 'Overview' },
        { key: 'pipeline', label: 'Pipeline' },
        { key: 'actions', label: 'Actions' },
      ]}
      main={<RMWorkQueue />}
      intelligence={[
        { title: 'Bottleneck Watch', detail: 'Monitor stage transitions with longest cycle durations and pending approvals.' },
        { title: 'Escalation Focus', detail: 'Prioritize high-risk or high-value transactions for committee intervention.' },
      ]}
      activity={[
        { time: 'Live', title: 'Work queue synchronized', detail: 'Dynamic rows refreshed from deal orchestration engine.' },
      ]}
      advanced={<p className="text-sm text-slate-400">Advanced operators can pin saved views and policy-specific queue slices.</p>}
    />
  );
}
