"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import type { ReadinessItem, WorkflowPanelConfig } from "@/lib/customer/workflow/workflow.types";

function stateTone(state: ReadinessItem["state"]): string {
  if (state === "Completed" || state === "Ready") {
    return "border-emerald-700/50 bg-emerald-900/25 text-emerald-200";
  }

  if (state === "In Progress") {
    return "border-sky-700/50 bg-sky-900/25 text-sky-200";
  }

  if (state === "Review Required") {
    return "border-amber-700/50 bg-amber-900/25 text-amber-200";
  }

  return "border-slate-700 bg-slate-900 text-slate-300";
}

export interface ReadinessProgressProps {
  readonly config: WorkflowPanelConfig;
  readonly items: readonly ReadinessItem[];
}

export default function ReadinessProgress({ config, items }: ReadinessProgressProps) {
  return (
    <SectionCard title={config.readinessTitle} subtitle={config.readinessSubtitle}>
      <ol className="space-y-2.5" aria-label="Readiness progress">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${stateTone(item.state)}`}>
                {item.state}
              </span>
            </div>
            {item.detail ? <p className="mt-1 text-sm text-slate-300">{item.detail}</p> : null}
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}
