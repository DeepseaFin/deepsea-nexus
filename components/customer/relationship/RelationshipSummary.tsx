"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type {
  RelationshipPanelConfig,
  RelationshipSummaryModel,
} from "@/lib/customer/relationship/relationship-panel.types";

function toLabel(value: string): string {
  return value.replace(/_/g, " ");
}

export interface RelationshipSummaryProps {
  readonly config: RelationshipPanelConfig;
  readonly summary: RelationshipSummaryModel;
}

export default function RelationshipSummary({ config, summary }: RelationshipSummaryProps) {
  return (
    <SectionCard title={config.summaryTitle} subtitle={config.summarySubtitle}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Owner</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{summary.relationship.ownerDisplayName}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Stage</p>
          <p className="mt-1 text-sm font-semibold capitalize text-slate-100">{toLabel(summary.relationship.stage)}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Status</p>
          <div className="mt-1">
            <StatusChip label={toLabel(summary.relationship.status)} variant="info" />
          </div>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Primary Contact</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{summary.primaryContactName ?? "Not assigned"}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Institution ID</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{summary.relationship.institutionId}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Contacts</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{summary.contactCount}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Interactions</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{summary.interactionCount}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Updated</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{summary.relationship.updatedDate}</p>
        </article>
      </div>
    </SectionCard>
  );
}
