'use client';

import React from 'react';
import { ClipboardCheck } from 'lucide-react';
import SectionCard from './SectionCard';
import type { RecommendationPanel } from '@/src/capabilities/intelligence/recommendation/RecommendationPanel';

interface RecommendationPanelViewProps {
  readonly panel: RecommendationPanel;
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

const RecommendationPanelView: React.FC<RecommendationPanelViewProps> = ({ panel }) => {
  return (
    <SectionCard
      title="Recommendation Panel"
      icon={ClipboardCheck}
      badge={{
        label: `${panel.totalRecommendations} Recommendations`,
        variant: 'info',
      }}
    >
      <p className="mb-4 text-sm text-slate-400">
        Canonical institutional recommendation presentation for evaluated proposals across active decision
        contexts.
      </p>

      {panel.recommendations.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">{panel.emptyState.title}</p>
          <p className="mt-1 text-xs text-slate-500">{panel.emptyState.description}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {panel.recommendations.map((recommendation) => (
            <article
              key={recommendation.recommendationId}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">{recommendation.recommendationType}</p>
                  <h4 className="mt-1 text-sm font-semibold tracking-tight text-slate-100">{recommendation.title}</h4>
                </div>
                <p className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-300">
                  {recommendation.status}
                </p>
              </div>

              <p className="mt-3 text-sm text-slate-400">{recommendation.description}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Field label="Recommendation ID" value={recommendation.recommendationId} />
                <Field label="Type" value={recommendation.recommendationType} />
                <Field label="Status" value={recommendation.status} />
                <Field label="Created At" value={recommendation.createdAt} />
              </div>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Recommendation Summary</h5>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <p className="text-xs text-slate-300">
                    Source Contexts: {recommendation.sourceDecisionContextIds.join(', ') || 'None'}
                  </p>
                  <p className="text-xs text-slate-300">
                    Source Options: {recommendation.sourceDecisionOptionIds.join(', ') || 'None'}
                  </p>
                  <p className="text-xs text-slate-300">Tags: {recommendation.summaryMetadata.tags.length}</p>
                  <p className="text-xs text-slate-300">Attributes: {recommendation.summaryMetadata.attributeCount}</p>
                </div>
              </section>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Rationale</h5>
                <p className="mt-2 text-xs text-slate-300">{recommendation.rationale || 'No rationale recorded.'}</p>
              </section>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Assumptions</h5>
                {recommendation.assumptions.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">No assumptions recorded.</p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {recommendation.assumptions.map((assumption, index) => (
                      <li
                        key={`${recommendation.recommendationId}-assumption-${index}`}
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

export default RecommendationPanelView;