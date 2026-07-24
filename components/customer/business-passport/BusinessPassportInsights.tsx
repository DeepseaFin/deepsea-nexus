"use client";

import React from "react";
import { Lightbulb } from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";
import type {
  PassportPanelConfig,
  PassportPanelRecommendation,
} from "@/lib/customer/business-passport/passport-panel.types";

function priorityTone(priority?: PassportPanelRecommendation["priority"]): string {
  if (priority === "high") {
    return "border-rose-700/50 bg-rose-900/20 text-rose-200";
  }

  if (priority === "medium") {
    return "border-amber-700/50 bg-amber-900/20 text-amber-200";
  }

  if (priority === "low") {
    return "border-emerald-700/50 bg-emerald-900/20 text-emerald-200";
  }

  return "border-slate-700 bg-slate-900 text-slate-300";
}

export interface BusinessPassportInsightsProps {
  readonly config: PassportPanelConfig;
  readonly recommendations: readonly PassportPanelRecommendation[];
}

export default function BusinessPassportInsights({
  config,
  recommendations,
}: BusinessPassportInsightsProps) {
  return (
    <SectionCard title={config.insightsHeader.title} subtitle={config.insightsHeader.subtitle}>
      <div className="space-y-2.5">
        {recommendations.map((recommendation) => (
          <article key={recommendation.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-100">{recommendation.title}</p>
                <p className="mt-1 text-sm text-slate-300">{recommendation.summary}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {recommendation.priority ? (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityTone(recommendation.priority)}`}
                  >
                    {recommendation.priority}
                  </span>
                ) : null}
                {recommendation.category ? (
                  <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                    {recommendation.category}
                  </span>
                ) : null}
              </div>
            </div>

            {recommendation.actionLabel ? (
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300 transition hover:border-cyan-600/45 hover:text-cyan-100"
              >
                <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                {recommendation.actionLabel}
              </button>
            ) : null}
          </article>
        ))}

        {recommendations.length === 0 ? (
          <p className="text-sm text-slate-400">No recommendations provided for this workspace context.</p>
        ) : null}
      </div>
    </SectionCard>
  );
}
