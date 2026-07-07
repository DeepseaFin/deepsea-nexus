import OriginationWorkspace from '@/components/atlas/origination/OriginationWorkspace';
import WorkspaceScaffold from '@/components/atlas/design-system/WorkspaceScaffold';

export default function OriginationPage() {
  return (
    <WorkspaceScaffold
      title="Origination Workspace"
      subtitle="Capture opportunities, structure intake, and channel new financing opportunities."
      status={{ label: 'Pipeline Open', tone: 'success' }}
      headerFields={[
        { label: 'Entry Point', value: 'Opportunity Intake' },
        { label: 'Focus', value: 'Institutional sourcing' },
        { label: 'Data Mode', value: 'Presentation-first' },
      ]}
      actions={[
        { label: 'Create Deal', href: '/atlas/deals/new' },
        { label: 'Open Dashboard', href: '/atlas/dashboard' },
      ]}
      kpis={[
        { label: 'Intake Flow', value: 'Enabled' },
        { label: 'Handoff', value: 'Deals Workspace' },
      ]}
      tabs={[
        { key: 'overview', label: 'Overview' },
        { key: 'intake', label: 'Intake' },
        { key: 'handoff', label: 'Handoff' },
      ]}
      main={<OriginationWorkspace />}
      intelligence={[
        { title: 'Opportunity Quality', detail: 'Prioritize qualified opportunities with complete counterparty and document context.' },
      ]}
      activity={[
        { time: 'Live', title: 'Origination module ready', detail: 'New opportunities can be routed into deal workflow.' },
      ]}
      advanced={<p className="text-sm text-slate-400">Advanced origination analytics and conversion funnels can be attached here.</p>}
    />
  );
}
