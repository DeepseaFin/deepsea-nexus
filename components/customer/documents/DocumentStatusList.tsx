"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { DocumentStatusItem } from "@/lib/customer/documents/documents-panel.types";

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

function statusTone(status: DocumentStatusItem["uiStatus"]): string {
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

export interface DocumentStatusListProps {
  readonly title: string;
  readonly subtitle: string;
  readonly items: readonly DocumentStatusItem[];
}

export default function DocumentStatusList({ title, subtitle, items }: DocumentStatusListProps) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      <div className="space-y-2.5">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">
                  {item.document_code} • {item.document_type}
                </p>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusTone(item.uiStatus)}`}
              >
                {item.uiStatus}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400">Last updated: {formatDate(item.updated_at)}</p>
          </article>
        ))}

        {items.length === 0 ? <PanelEmptyState message="No document status items provided." /> : null}
      </div>
    </SectionCard>
  );
}
