"use client";

import StatusBadge from "@/components/customer/shared/StatusBadge";
import type { RelationshipActionCenterItemViewModel } from "@/lib/customer/RelationshipActionCenterViewModel";

export interface ActionCardProps {
  readonly item: RelationshipActionCenterItemViewModel;
  readonly dueDate?: string;
}

function toLabel(value: string): string {
  return value.replace(/-/g, " ").replace(/_/g, " ").replace(/\b\w/g, (part) => part.toUpperCase());
}

function priorityTone(priority: string): "neutral" | "success" | "warning" | "danger" | "info" {
  if (priority === "high") {
    return "danger";
  }

  if (priority === "medium") {
    return "warning";
  }

  if (priority === "low") {
    return "info";
  }

  return "neutral";
}

export default function ActionCard({ item, dueDate }: ActionCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-100">{item.title}</h4>
        <div className="flex items-center gap-2">
          <StatusBadge label={toLabel(item.priority)} tone={priorityTone(item.priority)} />
          <StatusBadge label={toLabel(item.source)} tone="neutral" />
        </div>
      </div>

      <p className="mt-2 text-sm text-slate-300">{item.description}</p>

      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Related Documents</p>
        <ul className="mt-1 space-y-1 text-sm text-slate-300">
          {item.relatedDocuments.length > 0 ? (
            item.relatedDocuments.map((document) => (
              <li key={document.id} className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1">
                {document.label}
              </li>
            ))
          ) : (
            <li className="text-slate-500">No related documents.</li>
          )}
        </ul>
      </div>

      <div className="mt-3 grid gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500 sm:grid-cols-2">
        <p>
          Suggested Next Step: <span className="normal-case text-slate-300">{item.suggestedNextStep}</span>
        </p>
        <p>
          Due Date: <span className="normal-case text-slate-300">{dueDate ?? "Not available"}</span>
        </p>
      </div>

      <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
        Intelligence Reference: <span className="normal-case text-slate-300">{item.supportingIntelligence.reference}</span>
      </p>
    </article>
  );
}
