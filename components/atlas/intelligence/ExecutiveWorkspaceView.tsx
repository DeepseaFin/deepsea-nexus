'use client';

import React from 'react';
import DecisionContextPanelView from '@/components/atlas/intelligence/DecisionContextPanelView';
import DecisionOptionPanelView from '@/components/atlas/intelligence/DecisionOptionPanelView';
import InsightPanelView from '@/components/atlas/intelligence/InsightPanelView';
import KPIPanelView from '@/components/atlas/intelligence/KPIPanelView';
import ObservationPanelView from '@/components/atlas/intelligence/ObservationPanelView';
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
      <ObservationPanelView panel={workspace.observationPanel} />
      <InsightPanelView panel={workspace.insightPanel} />
      <DecisionContextPanelView panel={workspace.decisionContextPanel} />
      <DecisionOptionPanelView panel={workspace.decisionOptionPanel} />
    </section>
  );
};

export default ExecutiveWorkspaceView;