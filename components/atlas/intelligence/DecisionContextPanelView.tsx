'use client';

import React from 'react';

import SectionCard from './SectionCard';
import type { DecisionContextPanel } from '@/src/capabilities/intelligence/decision-context/DecisionContextPanel';

interface DecisionContextPanelViewProps {
  readonly panel: DecisionContextPanel;
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

const DecisionContextPanelView: React.FC<DecisionContextPanelViewProps> = ({ panel }) => {
  return (
    <SectionCard
      title="Decision Context Panel"
      iconKey="network"
      badge={{
        label: `${panel.totalDecisionContexts} Contexts`,
        variant: 'info',
      }}
    >
      <p className="mb-4 text-sm text-slate-400">
        Canonical institutional decision context presentation for complete pre-recommendation context.
      </p>

      {panel.decisionContexts.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">{panel.emptyState.title}</p>
          <p className="mt-1 text-xs text-slate-500">{panel.emptyState.description}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {panel.decisionContexts.map((decisionContext) => (
            <article
              key={decisionContext.decisionContextId}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">{decisionContext.contextType}</p>
                  <h4 className="mt-1 text-sm font-semibold tracking-tight text-slate-100">{decisionContext.title}</h4>
                </div>
                <p className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-300">
                  {decisionContext.status}
                </p>
              </div>

              <p className="mt-3 text-sm text-slate-400">{decisionContext.description}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Field label="Decision Context ID" value={decisionContext.decisionContextId} />
                <Field label="Context Type" value={decisionContext.contextType} />
                <Field label="Created At" value={decisionContext.createdAt} />
                <Field
                  label="Related Insight Count"
                  value={decisionContext.sourceInsightIds.length.toString()}
                />
              </div>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Context Summary</h5>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <p className="text-xs text-slate-300">
                    Source Insights: {decisionContext.sourceInsightIds.join(', ') || 'None'}
                  </p>
                  <p className="text-xs text-slate-300">
                    Related Entities: {decisionContext.relatedEntityIds.join(', ') || 'None'}
                  </p>
                  <p className="text-xs text-slate-300">Tags: {decisionContext.summaryMetadata.tags.length}</p>
                  <p className="text-xs text-slate-300">Attributes: {decisionContext.summaryMetadata.attributeCount}</p>
                </div>
              </section>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default DecisionContextPanelView;