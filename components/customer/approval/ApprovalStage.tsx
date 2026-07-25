"use client";

import React from "react";
import type { ApprovalWorkflowOverviewModel } from "@/lib/application/WorkspaceIntelligence";

export interface ApprovalStageProps {
  readonly stage: ApprovalWorkflowOverviewModel["stages"][number];
}

function stageTone(state: ApprovalWorkflowOverviewModel["stages"][number]["state"]): string {
  if (state === "completed") {
    return "border-emerald-700/50 bg-emerald-900/25 text-emerald-200";
  }

  if (state === "current") {
    return "border-cyan-700/50 bg-cyan-900/25 text-cyan-200";
  }

  return "border-slate-700 bg-slate-900 text-slate-300";
}

export default function ApprovalStage({ stage }: ApprovalStageProps) {
  return (
    <li className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-100">{stage.label}</p>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${stageTone(stage.state)}`}>
          {stage.state}
        </span>
      </div>
    </li>
  );
}
