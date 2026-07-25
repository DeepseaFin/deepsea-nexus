"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { DocumentChecklistItem } from "@/lib/customer/documents/documents-panel.types";

function formatDate(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function statusTone(status: DocumentChecklistItem["status"]): string {
  if (status === "Verified") {
    return "border-emerald-700/50 bg-emerald-900/25 text-emerald-200";
  }

  if (status === "Processing" || status === "Uploaded") {
    return "border-amber-700/50 bg-amber-900/25 text-amber-200";
  }

  if (status === "Rejected" || status === "Expired") {
    return "border-rose-700/50 bg-rose-900/25 text-rose-200";
  }

  return "border-cyan-700/50 bg-cyan-900/25 text-cyan-200";
}

export interface DocumentChecklistProps {
  readonly title: string;
  readonly subtitle: string;
  readonly items: readonly DocumentChecklistItem[];
}

export default function DocumentChecklist({ title, subtitle, items }: DocumentChecklistProps) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      <ul className="space-y-2.5" aria-label="Document checklist">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-100">{item.documentName}</p>
                <p className="mt-1 text-xs text-slate-400">Last updated: {formatDate(item.lastUpdated)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusTone(item.status)}`}
                >
                  {item.status}
                </span>
                {item.required ? (
                  <span className="rounded-full border border-cyan-700/50 bg-cyan-900/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-200">
                    Required
                  </span>
                ) : null}
              </div>
            </div>
          </li>
        ))}

        {items.length === 0 ? <PanelEmptyState asListItem message="No checklist items provided." /> : null}
      </ul>
    </SectionCard>
  );
}
