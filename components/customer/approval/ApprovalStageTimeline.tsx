"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { ApprovalPanelConfig, ApprovalStageItem } from "@/lib/customer/approval/approval-panel.types";

function stateTone(state: ApprovalStageItem["state"]): string {
  if (state === "Approved" || state === "Completed") {
    return "border-emerald-700/50 bg-emerald-900/25 text-emerald-200";
  }

  if (state === "In Review" || state === "Pending") {
    return "border-amber-700/50 bg-amber-900/25 text-amber-200";
  }

  if (state === "Rejected" || state === "Returned") {
    return "border-rose-700/50 bg-rose-900/25 text-rose-200";
  }

  return "border-cyan-700/50 bg-cyan-900/25 text-cyan-200";
}

export interface ApprovalStageTimelineProps {
  readonly config: ApprovalPanelConfig;
  readonly stages: readonly ApprovalStageItem[];
}

export default function ApprovalStageTimeline({ config, stages }: ApprovalStageTimelineProps) {
  return (
    <SectionCard title={config.stagesTitle} subtitle={config.stagesSubtitle}>
      <ol className="space-y-2.5" aria-label="Approval stages timeline">
        {stages.map((stage) => (
          <li key={stage.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-100">{stage.title}</p>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${stateTone(stage.state)}`}
              >
                {stage.state}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
              {stage.owner ? <span>Owner: {stage.owner}</span> : null}
              {stage.dueDate ? <span>Due: {stage.dueDate}</span> : null}
            </div>
          </li>
        ))}

        {stages.length === 0 ? <PanelEmptyState asListItem message="No approval stages provided." /> : null}
      </ol>
    </SectionCard>
  );
}
