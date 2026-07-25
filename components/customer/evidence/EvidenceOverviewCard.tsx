"use client";

import React from "react";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { EvidenceOverviewModel } from "@/lib/application/WorkspaceIntelligence";

export interface EvidenceOverviewCardProps {
  readonly model?: EvidenceOverviewModel | null;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export default function EvidenceOverviewCard({ model, isLoading, error }: EvidenceOverviewCardProps) {
  if (isLoading) {
    return (
      <PanelLoadingState
        title="Evidence Overview"
        subtitle="Evidence inventory and verification status across onboarding"
        message="Loading evidence overview..."
      />
    );
  }

  if (error) {
    return (
      <PanelErrorState
        title="Evidence Overview"
        subtitle="Evidence inventory and verification status across onboarding"
        message={error}
      />
    );
  }

  if (!model) {
    return (
      <SectionCard
        title="Evidence Overview"
        subtitle="Evidence inventory and verification status across onboarding"
      >
        <PanelEmptyState message="No evidence overview is available for this customer yet." />
      </SectionCard>
    );
  }

  const hasEvidence = model.totalEvidenceItems > 0;

  return (
    <SectionCard
      title="Evidence Overview"
      subtitle="Evidence inventory and verification status across onboarding"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Total Evidence</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.totalEvidenceItems}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Verified</p>
          <p className="mt-1 text-sm font-semibold text-emerald-200">{model.verifiedEvidence}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Pending Verification</p>
          <p className="mt-1 text-sm font-semibold text-amber-200">{model.pendingVerification}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Missing Evidence</p>
          <p className="mt-1 text-sm font-semibold text-rose-200">{model.missingEvidence}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Quality / Completeness</p>
          {model.evidenceQualityOrCompleteness ? (
            <div className="mt-1">
              <StatusChip label={model.evidenceQualityOrCompleteness} variant="info" />
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-400">Not available</p>
          )}
        </article>
      </div>

      <article className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Recently Uploaded Evidence</p>
        {hasEvidence && model.recentlyUploadedEvidence.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {model.recentlyUploadedEvidence.map((evidence) => (
              <li key={evidence.id} className="rounded-md border border-slate-800 bg-slate-900/60 p-2.5">
                <p className="text-sm text-slate-100">{evidence.label}</p>
                <p className="mt-1 text-xs text-slate-400">Uploaded: {evidence.uploadedAt}</p>
              </li>
            ))}
          </ul>
        ) : (
          <PanelEmptyState message="No recent evidence uploads are available." />
        )}
      </article>
    </SectionCard>
  );
}
