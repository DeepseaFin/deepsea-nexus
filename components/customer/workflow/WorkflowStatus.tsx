"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import type { WorkflowPanelConfig, WorkflowStatusModel } from "@/lib/customer/workflow/workflow.types";

export interface WorkflowStatusProps {
  readonly config: WorkflowPanelConfig;
  readonly model: WorkflowStatusModel;
}

export default function WorkflowStatus({ config, model }: WorkflowStatusProps) {
  return (
    <SectionCard title={config.workflowStatusTitle} subtitle={config.workflowStatusSubtitle}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Current Phase</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.currentPhase}</p>
        </article>
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Owner</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.owner}</p>
        </article>
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Queue Status</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.queueStatus}</p>
        </article>
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Due Window</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.dueWindow}</p>
        </article>
      </div>
    </SectionCard>
  );
}
