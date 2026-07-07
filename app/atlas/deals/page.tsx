import DealCockpit from "@/components/atlas/deal/DealCockpit";
import WorkspaceScaffold from '@/components/atlas/design-system/WorkspaceScaffold';

export default function DealsPage() {
  return (
    <WorkspaceScaffold
      title="Deals Workspace"
      subtitle="Originate, evaluate, approve, and monitor institutional financing deals."
      status={{ label: 'Active', tone: 'info' }}
      headerFields={[
        { label: 'Primary Module', value: 'Deal Cockpit' },
        { label: 'Coverage', value: 'End-to-end deal lifecycle' },
        { label: 'Execution Mode', value: 'Live operations' },
      ]}
      actions={[
        { label: 'New Deal', href: '/atlas/deals/new' },
        { label: 'Work Queue', href: '/atlas/work-queue' },
      ]}
      kpis={[
        { label: 'Pipeline', value: 'Live', note: 'Sourced from orchestration outputs' },
        { label: 'Status', value: 'Operational', note: 'Institutional workflow enabled' },
      ]}
      tabs={[
        { key: 'overview', label: 'Overview' },
        { key: 'execution', label: 'Execution' },
        { key: 'audit', label: 'Audit' },
      ]}
      main={<DealCockpit />}
      intelligence={[
        { title: 'Workflow Cohesion', detail: 'Deals are orchestrated with gates, dependencies, and risk telemetry.' },
        { title: 'Next Action', detail: 'Use command palette to trigger term sheet or credit memo flows.' },
      ]}
      activity={[
        { time: 'Live', title: 'Deal workspace opened', detail: 'Cockpit loaded with latest relationship and workflow context.' },
      ]}
      advanced={<p className="text-sm text-slate-400">Advanced controls can include custom desk views and institutional permissions.</p>}
    />
  );
}