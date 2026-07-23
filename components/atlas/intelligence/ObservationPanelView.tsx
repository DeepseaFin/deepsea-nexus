'use client';

import React from 'react';
import { SearchCheck } from 'lucide-react';
import SectionCard from './SectionCard';
import type { ObservationPanel } from '@/src/capabilities/intelligence/observation/ObservationPanel';

interface ObservationPanelViewProps {
  readonly panel: ObservationPanel;
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

const ObservationPanelView: React.FC<ObservationPanelViewProps> = ({ panel }) => {
  return (
    <SectionCard
      title="Observation Panel"
      icon={SearchCheck}
      badge={{
        label: `${panel.totalObservations} Observations`,
        variant: 'info',
      }}
    >
      <p className="mb-4 text-sm text-slate-400">
        Canonical institutional observation presentation for factual operational and intelligence findings.
      </p>

      {panel.observations.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">{panel.emptyState.title}</p>
          <p className="mt-1 text-xs text-slate-500">{panel.emptyState.description}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {panel.observations.map((observation) => (
            <article
              key={observation.observationId}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">{observation.type}</p>
                  <h4 className="mt-1 text-sm font-semibold tracking-tight text-slate-100">{observation.title}</h4>
                </div>
                <p className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-300">
                  {observation.status}
                </p>
              </div>

              <p className="mt-3 text-sm text-slate-400">{observation.description}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Field label="Observation ID" value={observation.observationId} />
                <Field label="Type" value={observation.type} />
                <Field label="Source" value={observation.source} />
                <Field label="Observed At" value={observation.observedAt} />
              </div>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Observation Summary</h5>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <p className="text-xs text-slate-300">
                    Related Entities: {observation.relatedEntityIds.join(', ') || 'None'}
                  </p>
                  <p className="text-xs text-slate-300">Source: {observation.summaryMetadata.sourceSystem}</p>
                  <p className="text-xs text-slate-300">Tags: {observation.summaryMetadata.tags.length}</p>
                  <p className="text-xs text-slate-300">Attributes: {observation.summaryMetadata.attributeCount}</p>
                </div>
              </section>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default ObservationPanelView;