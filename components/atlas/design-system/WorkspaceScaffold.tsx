'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import ActivityTimeline, { type TimelineEvent } from './ActivityTimeline';
import IntelligencePanel, { type IntelligenceItem } from './IntelligencePanel';
import KPIGrid, { type KPIItem } from './KPIGrid';
import WorkspaceHeader from './WorkspaceHeader';
import type { QuickAction } from './QuickActionBar';

export type WorkspaceTab = {
  key: string;
  label: string;
};

export default function WorkspaceScaffold({
  title,
  subtitle,
  status,
  headerFields,
  actions,
  kpis,
  tabs,
  main,
  intelligence,
  activity,
  advanced,
}: {
  title: string;
  subtitle: string;
  status?: { label: string; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' };
  headerFields?: Array<{ label: string; value: string }>;
  actions?: QuickAction[];
  kpis?: KPIItem[];
  tabs?: WorkspaceTab[];
  main: React.ReactNode;
  intelligence?: IntelligenceItem[];
  activity?: TimelineEvent[];
  advanced?: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.key ?? 'overview');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <div className="space-y-4 p-6 sm:p-8">
      <div className="mx-auto max-w-[1600px] space-y-4">
        <WorkspaceHeader
          title={title}
          subtitle={subtitle}
          status={status}
          fields={headerFields ?? []}
          actions={actions ?? []}
        />

        {kpis && kpis.length > 0 ? <KPIGrid items={kpis} /> : null}

        {tabs && tabs.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 p-1">
            <div className="flex min-w-max items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    activeTab === tab.key
                      ? 'bg-cyan-600/20 text-cyan-200'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.7fr)]">
          <div className="space-y-4">{main}</div>

          <div className="space-y-4">
            {intelligence && intelligence.length > 0 ? (
              <IntelligencePanel items={intelligence} />
            ) : null}
            {activity && activity.length > 0 ? <ActivityTimeline events={activity} /> : null}
          </div>
        </div>

        {advanced ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <button
              type="button"
              onClick={() => setAdvancedOpen((open) => !open)}
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-200"
            >
              Advanced Information
              {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {advancedOpen ? <div className="mt-3">{advanced}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
