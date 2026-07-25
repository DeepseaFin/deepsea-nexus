"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { WorkspaceIntelligenceModel } from "@/lib/application/WorkspaceIntelligence";
import type { NextBestActionModel, WorkflowPanelConfig } from "@/lib/customer/workflow/workflow.types";

function priorityTone(priority: NextBestActionModel["priority"]): string {
  if (priority === "critical") {
    return "border-rose-700/50 bg-rose-900/25 text-rose-200";
  }

  if (priority === "high") {
    return "border-orange-700/50 bg-orange-900/25 text-orange-200";
  }

  if (priority === "medium") {
    return "border-amber-700/50 bg-amber-900/25 text-amber-200";
  }

  return "border-emerald-700/50 bg-emerald-900/25 text-emerald-200";
}

export interface NextBestActionProps {
  readonly config: WorkflowPanelConfig;
  readonly intelligence: WorkspaceIntelligenceModel;
}

export default function NextBestAction({ config, intelligence }: NextBestActionProps) {
  const action = intelligence.workflowNextAction;

  return (
    <SectionCard title={config.nextActionTitle} subtitle={config.nextActionSubtitle}>
      {action ? (
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-sm font-semibold text-slate-100">{action.title}</p>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityTone(action.priority)}`}>
              {action.priority}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-300">{action.description}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">Owner: {action.owner}</p>

          <button
            type="button"
            aria-label={`Execute action: ${action.actionLabel}`}
            className="mt-3 rounded-md border border-cyan-700/50 bg-cyan-900/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            {action.actionLabel}
          </button>
        </div>
      ) : (
        <PanelEmptyState message="No workflow action is available in the current workspace intelligence view." />
      )}
    </SectionCard>
  );
}
