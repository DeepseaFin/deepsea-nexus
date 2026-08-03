import WorkspaceActivityFeed from '@/components/workspace/WorkspaceActivityFeed';
import WorkspaceCommandCenter from '@/components/workspace/WorkspaceCommandCenter';
import WorkspaceGreeting from '@/components/workspace/WorkspaceGreeting';
import WorkspaceHero from '@/components/workspace/WorkspaceHero';
import WorkspaceMyWork from '@/components/workspace/WorkspaceMyWork';
import WorkspaceQuickActions from '@/components/workspace/WorkspaceQuickActions';
import WorkspaceResume from '@/components/workspace/WorkspaceResume';
import WorkspaceSection from '@/components/workspace/WorkspaceSection';
import WorkspaceSummary from '@/components/workspace/WorkspaceSummary';
import type { WorkspaceContext } from '@/lib/workspace/WorkspaceContext';
import { WorkspaceProvider } from '@/lib/workspace/WorkspaceProvider';

export default function WorkspaceShell({ context }: { context: WorkspaceContext }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <WorkspaceProvider context={context}>
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 py-10 sm:px-8 lg:gap-12 lg:px-10">
          <WorkspaceGreeting />

          <WorkspaceSection title="My Command Center" iconName="handCoins">
            <WorkspaceCommandCenter />
          </WorkspaceSection>

          <WorkspaceSection title="My Work" iconName="handCoins">
            <WorkspaceMyWork />
          </WorkspaceSection>

          <WorkspaceSection title="Recommended Next Action" iconName="sparkles">
            <WorkspaceHero />
          </WorkspaceSection>

          <WorkspaceSection title="What&apos;s New Today" iconName="bell">
            <WorkspaceActivityFeed />
          </WorkspaceSection>

          <WorkspaceSection title="Today&apos;s Summary" iconName="bell">
            <WorkspaceSummary />
          </WorkspaceSection>

          <WorkspaceSection title="Quick Actions" iconName="handCoins">
            <WorkspaceQuickActions />
          </WorkspaceSection>

          <WorkspaceSection title="Continue Where You Left Off" iconName="handCoins">
            <WorkspaceResume />
          </WorkspaceSection>
        </div>
      </WorkspaceProvider>
    </div>
  );
}
