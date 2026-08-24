"use client";

import React from "react";
import { UsersRound } from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";
import type {
  RelationshipPanelConfig,
  RelationshipSummaryModel,
} from "@/lib/customer/relationship/relationship-panel.types";

export interface RelationshipHeaderProps {
  readonly config: RelationshipPanelConfig;
  readonly summary: RelationshipSummaryModel;
}

export default function RelationshipHeader({ config, summary }: RelationshipHeaderProps) {
  return (
    <SectionCard title={config.title} subtitle={config.subtitle}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-100">{summary.relationship.relationshipName}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
            Relationship ID: {summary.relationship.relationshipId}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs uppercase tracking-[0.12em] text-slate-300">
          <UsersRound className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
          {config.workspaceLabel}
        </div>
      </div>
    </SectionCard>
  );
}
