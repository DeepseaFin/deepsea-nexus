import React from "react";
import DashboardSection from "@/components/dashboard/DashboardSection";
import EmptyState from "@/components/ui/EmptyState";
import StatusChip from "@/components/ui/StatusChip";
import type { DashboardInsightItem } from "@/lib/dashboard/dashboard.types";

export interface AiInsightsPanelProps {
  readonly recommendations: readonly DashboardInsightItem[];
}

export default function AiInsightsPanel({ recommendations }: AiInsightsPanelProps) {
  return (
    <DashboardSection
      title="AI Insights"
      subtitle="Presentation layer for future recommendation feed integrations"
    >
      {recommendations.length === 0 ? (
        <EmptyState
          title="No insight recommendations"
          description="Insight recommendations will appear here once connected providers publish summary items."
        />
      ) : (
        <ul className="space-y-3">
          {recommendations.map((recommendation) => (
            <li key={recommendation.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-100">{recommendation.title}</h3>
                <div className="flex items-center gap-2">
                  {recommendation.category ? (
                    <StatusChip label={recommendation.category} variant="info" />
                  ) : null}
                  {recommendation.confidence ? (
                    <span className="text-xs text-slate-400">Confidence {recommendation.confidence}</span>
                  ) : null}
                </div>
              </div>
              <p className="mt-1 text-sm text-slate-400">{recommendation.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </DashboardSection>
  );
}
