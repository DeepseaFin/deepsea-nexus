"use client";

import React from "react";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { EvidenceQualityAssessmentModel } from "@/lib/application/WorkspaceIntelligence";

export interface EvidenceQualityCardProps {
  readonly model?: EvidenceQualityAssessmentModel | null;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export default function EvidenceQualityCard({ model, isLoading, error }: EvidenceQualityCardProps) {
  if (isLoading) {
    return (
      <PanelLoadingState
        title="Evidence Quality & Trust"
        subtitle="Completeness, coverage, freshness, and confidence indicators"
        message="Loading evidence quality assessment..."
      />
    );
  }

  if (error) {
    return (
      <PanelErrorState
        title="Evidence Quality & Trust"
        subtitle="Completeness, coverage, freshness, and confidence indicators"
        message={error}
      />
    );
  }

  if (!model) {
    return (
      <SectionCard
        title="Evidence Quality & Trust"
        subtitle="Completeness, coverage, freshness, and confidence indicators"
      >
        <PanelEmptyState message="Evidence quality indicators are not available." />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Evidence Quality & Trust"
      subtitle="Completeness, coverage, freshness, and confidence indicators"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Evidence Completeness</p>
          <div className="mt-1">
            <StatusChip label={model.evidenceCompleteness.value} variant={model.evidenceCompleteness.variant} />
          </div>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Verification Coverage</p>
          <div className="mt-1">
            <StatusChip label={model.verificationCoverage.value} variant={model.verificationCoverage.variant} />
          </div>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Evidence Freshness</p>
          <p className="mt-1 text-sm text-slate-100">{model.evidenceFreshness ?? "Not available"}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Overall Evidence Confidence</p>
          <p className="mt-1 text-sm text-slate-100">{model.overallEvidenceConfidence ?? "Not available"}</p>
        </article>
      </div>
    </SectionCard>
  );
}
