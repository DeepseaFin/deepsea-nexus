import RMWorkQueue from '@/components/atlas/workqueue/RMWorkQueue';
import WorkspaceScaffold from '@/components/atlas/design-system/WorkspaceScaffold';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import Link from 'next/link';
import { getOperationsCenterContexts } from '@/lib/workflows/DemoScenario';
import { OpportunityLifecycle } from '@/lib/workflows/WorkflowTransition';

export default function WorkQueuePage() {
  const activeContexts = getOperationsCenterContexts().filter(
    (context) => context.opportunityLifecycle !== OpportunityLifecycle.CLOSED,
  );

  const groupedByLifecycle = Object.values(OpportunityLifecycle)
    .map((lifecycle) => ({
      lifecycle,
      items: activeContexts.filter((context) => context.opportunityLifecycle === lifecycle),
    }))
    .filter((group) => group.items.length > 0);

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
      main={(
        <div className="space-y-4">
          <SectionCard title="Active Workflow Queue by Lifecycle">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {groupedByLifecycle.map((group) => (
                <div key={group.lifecycle} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">{group.lifecycle}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-100">{group.items.length}</p>
                  <div className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.workflowId}
                        href={`/atlas/opportunity?workflowId=${item.workflowId}`}
                        className="block rounded-lg border border-slate-800 bg-slate-900/70 p-2 transition hover:border-cyan-700/40"
                      >
                        <p className="text-sm font-semibold text-slate-100">{item.opportunityId}</p>
                        <p className="text-xs text-slate-400">Workflow {item.workflowId}</p>
                        <p className="text-xs text-slate-400">Owner {item.currentOwner}</p>
                        <p className="text-xs text-slate-400">Workspace {item.currentWorkspace}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <RMWorkQueue />
        </div>
      )}
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
