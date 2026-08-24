"use client";

import React from "react";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { MissingEvidenceAssessmentModel } from "@/lib/application/WorkspaceIntelligence";

export interface MissingEvidenceCardProps {
  readonly model?: MissingEvidenceAssessmentModel | null;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export default function MissingEvidenceCard({ model, isLoading, error }: MissingEvidenceCardProps) {
  if (isLoading) {
    return (
      <PanelLoadingState
        title="Missing Mandatory Evidence"
        subtitle="Outstanding evidence requirements blocking verification confidence"
        message="Loading missing evidence..."
      />
    );
  }

  if (error) {
    return (
      <PanelErrorState
        title="Missing Mandatory Evidence"
        subtitle="Outstanding evidence requirements blocking verification confidence"
        message={error}
      />
    );
  }

  if (!model) {
    return (
      <SectionCard
        title="Missing Mandatory Evidence"
        subtitle="Outstanding evidence requirements blocking verification confidence"
      >
        <PanelEmptyState message="Missing evidence assessment is not available." />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Missing Mandatory Evidence"
      subtitle="Outstanding evidence requirements blocking verification confidence"
    >
      {model.missingMandatoryEvidence.length > 0 ? (
        <ul className="space-y-2.5">
          {model.missingMandatoryEvidence.map((item) => (
            <li key={item.id} className="rounded-lg border border-rose-800/45 bg-rose-950/15 p-3">
              <p className="text-sm font-semibold text-rose-100">{item.name}</p>
              <p className="mt-1 text-sm text-rose-200/90">{item.reason}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-rose-200/80">
                Due: {item.dueLabel ?? "Not specified"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <PanelEmptyState message="No mandatory evidence is currently missing." />
      )}
    </SectionCard>
  );
}
