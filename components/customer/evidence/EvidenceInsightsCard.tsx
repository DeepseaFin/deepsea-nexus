"use client";

import React from "react";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { EvidenceInsightsModel } from "@/lib/application/WorkspaceIntelligence";

export interface EvidenceInsightsCardProps {
  readonly model?: EvidenceInsightsModel | null;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export default function EvidenceInsightsCard({ model, isLoading, error }: EvidenceInsightsCardProps) {
  if (isLoading) {
    return (
      <PanelLoadingState
        title="Institutional Evidence Insights"
        subtitle="Concise, actionable interpretation of current evidence posture"
        message="Loading evidence insights..."
      />
    );
  }

  if (error) {
    return (
      <PanelErrorState
        title="Institutional Evidence Insights"
        subtitle="Concise, actionable interpretation of current evidence posture"
        message={error}
      />
    );
  }

  if (!model) {
    return (
      <SectionCard
        title="Institutional Evidence Insights"
        subtitle="Concise, actionable interpretation of current evidence posture"
      >
        <PanelEmptyState message="Evidence insights are not available for this customer yet." />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Institutional Evidence Insights"
      subtitle="Concise, actionable interpretation of current evidence posture"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Strongest Supporting Evidence</p>
          {model.strongestSupportingEvidence.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {model.strongestSupportingEvidence.map((item) => (
                <li key={item} className="text-sm text-emerald-200">{item}</li>
              ))}
            </ul>
          ) : (
            <PanelEmptyState message="No strong supporting evidence identified yet." />
          )}
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Weak Or Incomplete Evidence</p>
          {model.weakOrIncompleteEvidence.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {model.weakOrIncompleteEvidence.map((item) => (
                <li key={item} className="text-sm text-amber-200">{item}</li>
              ))}
            </ul>
          ) : (
            <PanelEmptyState message="No weak or incomplete evidence is currently flagged." />
          )}
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Recently Improved Evidence</p>
          {model.recentlyImprovedEvidence.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {model.recentlyImprovedEvidence.map((item) => (
                <li key={item} className="text-sm text-cyan-200">{item}</li>
              ))}
            </ul>
          ) : (
            <PanelEmptyState message="No recent evidence improvements are available." />
          )}
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Evidence Requiring Attention</p>
          {model.evidenceRequiringAttention.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {model.evidenceRequiringAttention.map((item) => (
                <li key={item} className="text-sm text-rose-200">{item}</li>
              ))}
            </ul>
          ) : (
            <PanelEmptyState message="No evidence items currently require immediate attention." />
          )}
        </article>
      </div>

      <article className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">High-Priority Evidence Actions</p>
        {model.highPriorityEvidenceActions.length > 0 ? (
          <ol className="mt-2 space-y-2.5">
            {model.highPriorityEvidenceActions.map((action, index) => (
              <li key={`${action.title}-${index}`} className="rounded-md border border-slate-800 bg-slate-900/60 p-2.5">
                <p className="text-sm font-semibold text-slate-100">{action.title}</p>
                <p className="mt-1 text-sm text-slate-300">{action.description}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  Owner: {action.owner} • Priority: {action.priority}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <PanelEmptyState message="No high-priority evidence actions are currently queued." />
        )}
      </article>
    </SectionCard>
  );
}
