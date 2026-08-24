'use client';

import React from 'react';

import SectionCard from './SectionCard';
import type { ScorecardPanel } from '@/src/capabilities/intelligence/scorecard/ScorecardPanel';

interface ScorecardPanelViewProps {
  readonly panel: ScorecardPanel;
}

function Field({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-200">{value}</p>
    </div>
  );
}

const ScorecardPanelView: React.FC<ScorecardPanelViewProps> = ({ panel }) => {
  return (
    <SectionCard
      title="Scorecard Panel"
      iconKey="clipboard-list"
      badge={{
        label: `${panel.totalScorecards} Scorecards`,
        variant: 'info',
      }}
    >
      <p className="mb-4 text-sm text-slate-400">
        Canonical institutional scorecard presentation for grouped performance measurement.
      </p>

      {panel.scorecards.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">{panel.emptyState.title}</p>
          <p className="mt-1 text-xs text-slate-500">{panel.emptyState.description}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {panel.scorecards.map((scorecard) => (
            <article
              key={scorecard.scorecardId}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">{scorecard.type}</p>
                  <h4 className="mt-1 text-sm font-semibold tracking-tight text-slate-100">{scorecard.name}</h4>
                </div>
                <p className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-300">
                  {scorecard.status}
                </p>
              </div>

              <p className="mt-3 text-sm text-slate-400">{scorecard.description}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Field label="Scorecard ID" value={scorecard.scorecardId} />
                <Field label="Type" value={scorecard.type} />
                <Field label="Measured At" value={scorecard.measuredAt} />
                <Field label="KPI Count" value={scorecard.kpiIds.length.toString()} />
              </div>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Scorecard Summary</h5>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <p className="text-xs text-slate-300">KPI IDs: {scorecard.kpiIds.join(', ') || 'None'}</p>
                  <p className="text-xs text-slate-300">Source: {scorecard.summaryMetadata.sourceSystem}</p>
                  <p className="text-xs text-slate-300">Tags: {scorecard.summaryMetadata.tags.length}</p>
                  <p className="text-xs text-slate-300">Attributes: {scorecard.summaryMetadata.attributeCount}</p>
                </div>
              </section>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default ScorecardPanelView;