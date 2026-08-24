"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import type { EvidenceOverviewModel } from "@/lib/application/WorkspaceIntelligence";
import EvidenceTimelineItem from "@/components/customer/evidence/EvidenceTimelineItem";

export interface EvidenceTimelineProps {
  readonly items: EvidenceOverviewModel["timeline"];
  readonly isLoading?: boolean;
  readonly error?: string;
}

export default function EvidenceTimeline({ items, isLoading = false, error }: EvidenceTimelineProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-300">Loading evidence timeline...</p>;
  }

  if (error) {
    return <p className="text-sm text-rose-200">{error}</p>;
  }

  if (items.length === 0) {
    return <PanelEmptyState message="No evidence timeline entries are available." />;
  }

  return (
    <ol className="space-y-2.5">
      {items.map((item) => (
        <EvidenceTimelineItem key={item.id} item={item} />
      ))}
    </ol>
  );
}
