import DealStudio from '@/components/atlas/deal/DealStudio';
import WorkspaceScaffold from '@/components/atlas/design-system/WorkspaceScaffold';

export default function NewDealPage() {
  return (
    <WorkspaceScaffold
      title="New Deal Studio"
      subtitle="Structured workflow to originate and configure a new institutional financing deal."
      status={{ label: 'Draft Mode', tone: 'info' }}
      headerFields={[
        { label: 'Mode', value: 'Authoring' },
        { label: 'Destination', value: 'Deals Workspace' },
        { label: 'Flow', value: 'Guided setup' },
      ]}
      actions={[
        { label: 'Back to Deals', href: '/atlas/deals' },
        { label: 'Open Work Queue', href: '/atlas/work-queue' },
      ]}
      kpis={[
        { label: 'Wizard', value: 'Active' },
        { label: 'Validation', value: 'Live' },
      ]}
      tabs={[
        { key: 'overview', label: 'Overview' },
        { key: 'commercial', label: 'Commercial' },
        { key: 'submission', label: 'Submission' },
      ]}
      main={<DealStudio />}
      intelligence={[
        { title: 'Authoring Guidance', detail: 'Provide complete commercial, legal, and participant details for smooth downstream processing.' },
      ]}
      activity={[
        { time: 'Now', title: 'New deal draft initialized', detail: 'Studio ready for intake and structuring.' },
      ]}
      advanced={<p className="text-sm text-slate-400">Advanced configuration can include custom approval templates and desk defaults.</p>}
    />
  );
}
