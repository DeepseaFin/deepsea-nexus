"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type {
  RelationshipInsightRecommendation,
  RelationshipPanelConfig,
} from "@/lib/customer/relationship/relationship-panel.types";

export interface RelationshipInsightsProps {
  readonly config: RelationshipPanelConfig;
  readonly insights: readonly RelationshipInsightRecommendation[];
}

export default function RelationshipInsights({ config, insights }: RelationshipInsightsProps) {
  return (
    <SectionCard title={config.insightsTitle} subtitle={config.insightsSubtitle}>
      <div className="space-y-2.5">
        {insights.map((insight) => (
          <article key={insight.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-sm font-semibold text-slate-100">{insight.title}</p>
            <p className="mt-1 text-sm text-slate-300">{insight.summary}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
              {insight.category ? <span>Category: {insight.category}</span> : null}
              {insight.confidence ? <span>Confidence: {insight.confidence}</span> : null}
            </div>
          </article>
        ))}

        {insights.length === 0 ? <PanelEmptyState message="No insights provided for this relationship." /> : null}
      </div>
    </SectionCard>
  );
}
