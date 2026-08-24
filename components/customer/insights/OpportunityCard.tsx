"use client";

import React from "react";
import type { InsightOpportunity } from "@/lib/customer/insights/insights.types";

function priorityTone(priority: InsightOpportunity["priority"]): string {
  if (priority === "high") {
    return "border-cyan-600/50 bg-cyan-900/25 text-cyan-100";
  }

  if (priority === "medium") {
    return "border-sky-700/50 bg-sky-900/25 text-sky-100";
  }

  return "border-slate-700 bg-slate-900 text-slate-300";
}

export interface OpportunityCardProps {
  readonly opportunity: InsightOpportunity;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-100">{opportunity.title}</p>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityTone(opportunity.priority)}`}
        >
          {opportunity.priority}
        </span>
      </div>

      <p className="mt-1 text-sm text-slate-300">{opportunity.summary}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">Category: {opportunity.category}</p>

      <div className="mt-3 rounded-md border border-slate-800 bg-slate-900/60 p-2.5">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Recommended Action</p>
        <p className="mt-1 text-sm text-slate-300">{opportunity.recommendedAction}</p>
      </div>
    </article>
  );
}
