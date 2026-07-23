'use client';

import React from 'react';
import { Scale } from 'lucide-react';
import SectionCard from './SectionCard';
import type { DecisionOptionPanel } from '@/src/capabilities/intelligence/decision-option/DecisionOptionPanel';

interface DecisionOptionPanelViewProps {
  readonly panel: DecisionOptionPanel;
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

const DecisionOptionPanelView: React.FC<DecisionOptionPanelViewProps> = ({ panel }) => {
  return (
    <SectionCard
      title="Decision Option Panel"
      icon={Scale}
      badge={{
        label: `${panel.totalDecisionOptions} Options`,
        variant: 'info',
      }}
    >
      <p className="mb-4 text-sm text-slate-400">
        Canonical institutional decision option presentation for available options under active decision
        contexts.
      </p>

      {panel.decisionOptions.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">{panel.emptyState.title}</p>
          <p className="mt-1 text-xs text-slate-500">{panel.emptyState.description}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {panel.decisionOptions.map((decisionOption) => (
            <article
              key={decisionOption.decisionOptionId}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">{decisionOption.optionType}</p>
                  <h4 className="mt-1 text-sm font-semibold tracking-tight text-slate-100">{decisionOption.title}</h4>
                </div>
                <p className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-300">
                  {decisionOption.status}
                </p>
              </div>

              <p className="mt-3 text-sm text-slate-400">{decisionOption.description}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Field label="Decision Option ID" value={decisionOption.decisionOptionId} />
                <Field label="Option Type" value={decisionOption.optionType} />
                <Field label="Status" value={decisionOption.status} />
                <Field label="Created At" value={decisionOption.createdAt} />
              </div>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Option Summary</h5>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <p className="text-xs text-slate-300">
                    Source Contexts: {decisionOption.sourceDecisionContextIds.join(', ') || 'None'}
                  </p>
                  <p className="text-xs text-slate-300">
                    Assumptions: {decisionOption.assumptions.length.toString()}
                  </p>
                  <p className="text-xs text-slate-300">Tags: {decisionOption.summaryMetadata.tags.length}</p>
                  <p className="text-xs text-slate-300">Attributes: {decisionOption.summaryMetadata.attributeCount}</p>
                </div>
              </section>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Assumptions</h5>
                {decisionOption.assumptions.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">No assumptions recorded.</p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {decisionOption.assumptions.map((assumption, index) => (
                      <li key={`${decisionOption.decisionOptionId}-assumption-${index}`} className="text-xs text-slate-300">
                        {assumption}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default DecisionOptionPanelView;