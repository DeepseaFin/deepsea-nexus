'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import SectionCard from './SectionCard';
import type { KPIPanel } from '@/src/capabilities/intelligence/kpi/KPIPanel';

interface KPIPanelViewProps {
  readonly panel: KPIPanel;
}

function MetricField({
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

const KPIPanelView: React.FC<KPIPanelViewProps> = ({ panel }) => {
  return (
    <SectionCard
      title="KPI Panel"
      icon={BarChart3}
      badge={{
        label: `${panel.totalKPIs} KPIs`,
        variant: 'info',
      }}
    >
      <p className="mb-4 text-sm text-slate-400">
        Canonical institutional KPI presentation for operational and executive metric consumption.
      </p>

      {panel.kpis.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">{panel.emptyState.title}</p>
          <p className="mt-1 text-xs text-slate-500">{panel.emptyState.description}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {panel.kpis.map((kpi) => (
            <article key={kpi.kpiId} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-300">{kpi.type}</p>
                  <h4 className="mt-1 text-sm font-semibold tracking-tight text-slate-100">{kpi.name}</h4>
                </div>
                <p className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-300">
                  {kpi.status}
                </p>
              </div>

              <p className="mt-3 text-sm text-slate-400">{kpi.description}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <MetricField label="Value" value={`${kpi.value} ${kpi.unit}`} />
                <MetricField label="Target" value={`${kpi.target} ${kpi.unit}`} />
                <MetricField label="Trend" value={kpi.trend} />
                <MetricField label="Measured At" value={kpi.measuredAt} />
              </div>

              <section className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <h5 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">KPI Summary</h5>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <p className="text-xs text-slate-300">KPI ID: {kpi.kpiId}</p>
                  <p className="text-xs text-slate-300">Source: {kpi.summaryMetadata.sourceSystem}</p>
                  <p className="text-xs text-slate-300">Tags: {kpi.summaryMetadata.tags.length}</p>
                  <p className="text-xs text-slate-300">Attributes: {kpi.summaryMetadata.attributeCount}</p>
                </div>
              </section>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default KPIPanelView;