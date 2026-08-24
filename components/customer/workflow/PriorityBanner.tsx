"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";
import type { PriorityBannerModel, WorkflowPanelConfig } from "@/lib/customer/workflow/workflow.types";

function priorityTone(priority: PriorityBannerModel["priority"]): string {
  if (priority === "critical") {
    return "border-rose-700/60 bg-rose-900/25 text-rose-200";
  }

  if (priority === "high") {
    return "border-orange-700/60 bg-orange-900/25 text-orange-200";
  }

  if (priority === "medium") {
    return "border-amber-700/60 bg-amber-900/25 text-amber-200";
  }

  return "border-emerald-700/60 bg-emerald-900/25 text-emerald-200";
}

export interface PriorityBannerProps {
  readonly config: WorkflowPanelConfig;
  readonly model: PriorityBannerModel;
}

export default function PriorityBanner({ config, model }: PriorityBannerProps) {
  return (
    <SectionCard title={config.priorityBannerTitle} subtitle={config.priorityBannerSubtitle}>
      <div className="rounded-xl border border-slate-800 bg-[linear-gradient(135deg,rgba(15,23,42,0.85),rgba(8,47,73,0.45))] p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-100">{model.title}</p>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityTone(model.priority)}`}>
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            {model.priority}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-slate-300">{model.summary}</p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-900/55 p-2.5">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Recommended Action</p>
            <p className="mt-1 text-sm text-slate-200">{model.recommendedAction}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/55 p-2.5">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Estimated Impact</p>
            <p className="mt-1 text-sm text-slate-200">{model.estimatedImpact}</p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
