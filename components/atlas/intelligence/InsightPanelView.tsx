'use client';

import React from 'react';
import { Lightbulb } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';
import SectionCard from './SectionCard';
import type { InsightPanel } from '@/src/capabilities/intelligence/insight/InsightPanel';

interface InsightPanelViewProps {
  readonly panel: InsightPanel;
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

const InsightPanelView: React.FC<InsightPanelViewProps> = ({ panel }) => {
  return (
    <SectionCard
      title="Insight Panel"
      icon={Lightbulb}
      badge={{
        label: `${panel.totalInsights} Insights`,
        variant: 'info',
      }}
    >
      <p className="mb-4 text-sm text-slate-400">
        Canonical institutional insight presentation for interpreted findings derived from observations.
      </p>

      {panel.insights.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">{panel.emptyState.title}</p>
          <p className="mt-1 text-xs text-slate-500">{panel.emptyState.description}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {panel.insights.map((insight) => (
            <article
              key={insight.insightId}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">{insight.type}</p>
                  <h4 className="mt-1 text-sm font-semibold tracking-tight text-slate-100">{insight.title}</h4>
                </div>
                <p className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-300">
                  {insight.status}
                </p>
              </div>

              <p className="mt-3 text-sm text-slate-400">{insight.description}</p>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.12em] text-slate-500">Confidence</span>
                <ConfidenceBadge score={insight.confidence} size="sm" />
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Field label="Insight ID" value={insight.insightId} />
                <Field label="Type" value={insight.type} />
                <Field label="Status" value={insight.status} />
                <Field label="Generated At" value={insight.generatedAt} />
              </div>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Insight Summary</h5>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <p className="text-xs text-slate-300">
                    Source Observations: {insight.sourceObservationIds.join(', ') || 'None'}
                  </p>
                  <p className="text-xs text-slate-300">Source: {insight.summaryMetadata.sourceSystem}</p>
                  <p className="text-xs text-slate-300">Tags: {insight.summaryMetadata.tags.length}</p>
                  <p className="text-xs text-slate-300">Attributes: {insight.summaryMetadata.attributeCount}</p>
                </div>
              </section>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default InsightPanelView;