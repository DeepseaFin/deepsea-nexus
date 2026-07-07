import EmptyState from '@/components/atlas/design-system/EmptyState';
import WorkspaceScaffold from '@/components/atlas/design-system/WorkspaceScaffold';

export default function AtlasPage() {
  return (
    <WorkspaceScaffold
      title="ATLAS Operating System"
      subtitle="Institutional command center for deal execution, risk, legal, and operations."
      status={{ label: 'Live', tone: 'success' }}
      headerFields={[
        { label: 'Platform', value: 'ATLAS Design System 2.0' },
        { label: 'Environment', value: 'Production Workspace' },
        { label: 'Mode', value: 'Institutional Operations' },
      ]}
      actions={[
        { label: 'Open Dashboard', href: '/atlas/dashboard' },
        { label: 'Open Deals', href: '/atlas/deals' },
        { label: 'Open Work Queue', href: '/atlas/work-queue' },
      ]}
      kpis={[
        { label: 'Workspaces', value: '10', note: 'Institutional modules enabled' },
        { label: 'Search Entities', value: '5', note: 'Registry seeded for universal search' },
        { label: 'Command Palette', value: '⌘K', note: 'Global command navigation' },
        { label: 'UI Foundation', value: '2.0', note: 'Consistent shell + components' },
      ]}
      tabs={[
        { key: 'overview', label: 'Overview' },
        { key: 'modules', label: 'Modules' },
        { key: 'governance', label: 'Governance' },
      ]}
      main={
        <EmptyState
          title="Select a Workspace"
          message="Use the left navigation or command palette to enter Deals, Clients, Counterparties, Work Queue, and other institutional modules."
        />
      }
      intelligence={[
        { title: 'Design System Rollout', detail: 'Global header and command palette are now persistent across Atlas routes.' },
        { title: 'Search Architecture', detail: 'Entity registry supports future modules with dynamic search indexing.' },
      ]}
      activity={[
        { time: 'Now', title: 'ATLAS shell initialized', detail: 'Design System 2.0 scaffold active.' },
      ]}
      advanced={<p className="text-sm text-slate-400">Advanced system diagnostics and module-level telemetry can be attached here in later sprints.</p>}
    />
  );
}