"use client";

import React from "react";
import ConfidenceIndicator from "@/components/customer/insights/ConfidenceIndicator";
import RiskIndicator from "@/components/customer/insights/RiskIndicator";
import type { AiRecommendation } from "@/lib/customer/insights/insights.types";

function priorityTone(priority: AiRecommendation["priority"]): string {
  if (priority === "high") {
    return "border-rose-700/50 bg-rose-900/25 text-rose-200";
  }

  if (priority === "medium") {
    return "border-amber-700/50 bg-amber-900/25 text-amber-200";
  }

  return "border-emerald-700/50 bg-emerald-900/25 text-emerald-200";
}

export interface AiRecommendationCardProps {
  readonly recommendation: AiRecommendation;
}

export default function AiRecommendationCard({ recommendation }: AiRecommendationCardProps) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-100">{recommendation.title}</p>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityTone(recommendation.priority)}`}
        >
          {recommendation.priority}
        </span>
      </div>

      <p className="mt-1 text-sm text-slate-300">{recommendation.summary}</p>

      <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
        <span>Category: {recommendation.category}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <ConfidenceIndicator value={recommendation.confidence} />
        <RiskIndicator level={recommendation.riskLevel} />
      </div>

      <div className="mt-3 rounded-md border border-slate-800 bg-slate-900/60 p-2.5">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Recommended Action</p>
        <p className="mt-1 text-sm text-slate-300">{recommendation.recommendedAction}</p>
      </div>
    </article>
  );
}
