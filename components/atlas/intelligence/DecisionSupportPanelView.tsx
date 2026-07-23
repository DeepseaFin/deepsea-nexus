'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import SectionCard from './SectionCard';
import type { DecisionSupportPanel } from '@/src/capabilities/intelligence/decision-support/DecisionSupportPanel';

interface DecisionSupportPanelViewProps {
  readonly panel: DecisionSupportPanel;
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

const DecisionSupportPanelView: React.FC<DecisionSupportPanelViewProps> = ({ panel }) => {
  return (
    <SectionCard
      title="Decision Support Panel"
      icon={FileText}
      badge={{
        label: `${panel.totalDecisionSupportItems} Support Packages`,
        variant: 'info',
      }}
    >
      <p className="mb-4 text-sm text-slate-400">
        Canonical institutional decision support presentation for executive review of recommendation analysis
        packages.
      </p>

      {panel.decisionSupportItems.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">{panel.emptyState.title}</p>
          <p className="mt-1 text-xs text-slate-500">{panel.emptyState.description}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {panel.decisionSupportItems.map((decisionSupport) => (
            <article
              key={decisionSupport.decisionSupportId}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">{decisionSupport.supportType}</p>
                  <h4 className="mt-1 text-sm font-semibold tracking-tight text-slate-100">{decisionSupport.title}</h4>
                </div>
                <p className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-300">
                  {decisionSupport.status}
                </p>
              </div>

              <p className="mt-3 text-sm text-slate-400">{decisionSupport.description}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Field label="Decision Support ID" value={decisionSupport.decisionSupportId} />
                <Field label="Support Type" value={decisionSupport.supportType} />
                <Field label="Status" value={decisionSupport.status} />
                <Field label="Created At" value={decisionSupport.createdAt} />
              </div>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Executive Summary</h5>
                <p className="mt-2 text-xs text-slate-300">{decisionSupport.summary || 'No summary recorded.'}</p>
              </section>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Decision Support Summary</h5>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <p className="text-xs text-slate-300">
                    Recommendations: {decisionSupport.recommendationIds.join(', ') || 'None'}
                  </p>
                  <p className="text-xs text-slate-300">Assumptions: {decisionSupport.assumptions.length.toString()}</p>
                  <p className="text-xs text-slate-300">Tags: {decisionSupport.summaryMetadata.tags.length}</p>
                  <p className="text-xs text-slate-300">Attributes: {decisionSupport.summaryMetadata.attributeCount}</p>
                </div>
              </section>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Considerations</h5>
                {decisionSupport.considerations.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">No considerations recorded.</p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {decisionSupport.considerations.map((consideration, index) => (
                      <li
                        key={`${decisionSupport.decisionSupportId}-consideration-${index}`}
                        className="text-xs text-slate-300"
                      >
                        {consideration}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Assumptions</h5>
                {decisionSupport.assumptions.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">No assumptions recorded.</p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {decisionSupport.assumptions.map((assumption, index) => (
                      <li
                        key={`${decisionSupport.decisionSupportId}-assumption-${index}`}
                        className="text-xs text-slate-300"
                      >
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

export default DecisionSupportPanelView;