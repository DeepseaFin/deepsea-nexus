import React from "react";
import DashboardSection from "@/components/dashboard/DashboardSection";
import EmptyState from "@/components/ui/EmptyState";
import StatusChip from "@/components/ui/StatusChip";
import type { DashboardPipelineItem } from "@/lib/dashboard/dashboard.types";

export interface PipelinePanelProps {
  readonly stages: readonly DashboardPipelineItem[];
}

export default function PipelinePanel({ stages }: PipelinePanelProps) {
  return (
    <DashboardSection title="Pipeline" subtitle="Stage distribution for connected portfolio and deal sources">
      {stages.length === 0 ? (
        <EmptyState
          title="No pipeline stages"
          description="Pipeline stage summaries will appear here when connected data providers are configured."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {stages.map((stage) => (
            <article key={stage.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-slate-100">{stage.stage}</h3>
                <StatusChip label={stage.status ?? "default"} variant={stage.status ?? "default"} />
              </div>
              <p className="mt-2 text-xl font-semibold text-slate-100">{stage.count}</p>
              {stage.amount ? <p className="mt-1 text-xs text-slate-500">{stage.amount}</p> : null}
            </article>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}
