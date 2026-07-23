'use client';

import React from 'react';
import KPIPanelView from '@/components/atlas/intelligence/KPIPanelView';
import ScorecardPanelView from '@/components/atlas/intelligence/ScorecardPanelView';
import type { ExecutiveWorkspace } from '@/src/capabilities/intelligence/workspace/ExecutiveWorkspace';

interface ExecutiveWorkspaceViewProps {
  readonly workspace: ExecutiveWorkspace;
  readonly className?: string;
}

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

const ExecutiveWorkspaceView: React.FC<ExecutiveWorkspaceViewProps> = ({ workspace, className }) => {
  return (
    <section className={withClassName('space-y-6', className)} aria-label="Executive workspace">
      <KPIPanelView panel={workspace.kpiPanel} />
      <ScorecardPanelView panel={workspace.scorecardPanel} />
    </section>
  );
};

export default ExecutiveWorkspaceView;