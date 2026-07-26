"use client";

import StatusBadge from "@/components/customer/shared/StatusBadge";
import type { RelationshipDocumentExplorerDocumentViewModel } from "@/lib/customer/RelationshipDocumentExplorerViewModel";

export interface DocumentCardProps {
  readonly document: RelationshipDocumentExplorerDocumentViewModel;
}

function toLabel(value: string): string {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (part) => part.toUpperCase());
}

function statusTone(status: string): "neutral" | "success" | "warning" | "danger" | "info" {
  const normalized = status.toLowerCase();

  if (normalized.includes("complete") || normalized.includes("processed") || normalized.includes("success")) {
    return "success";
  }

  if (normalized.includes("pending") || normalized.includes("queued")) {
    return "warning";
  }

  if (normalized.includes("error") || normalized.includes("failed")) {
    return "danger";
  }

  return "info";
}

function formatDateTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-100">{document.documentType}</h4>
        <StatusBadge label={toLabel(document.processingStatus)} tone={statusTone(document.processingStatus)} />
      </div>

      <dl className="mt-3 grid gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500 sm:grid-cols-2">
        <div>
          <dt>Processing Date</dt>
          <dd className="mt-1 text-sm font-semibold normal-case text-slate-100">{formatDateTime(document.processingDate)}</dd>
        </div>
        <div>
          <dt>Document Type</dt>
          <dd className="mt-1 text-sm font-semibold normal-case text-slate-100">{document.documentType}</dd>
        </div>
        <div>
          <dt>Related Evidence Count</dt>
          <dd className="mt-1 text-sm font-semibold normal-case text-slate-100">{document.relatedEvidence.length}</dd>
        </div>
        <div>
          <dt>Related Knowledge Count</dt>
          <dd className="mt-1 text-sm font-semibold normal-case text-slate-100">{document.relatedKnowledge.length}</dd>
        </div>
      </dl>

      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Business Passport References</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {document.businessPassportReferences.length > 0 ? (
            document.businessPassportReferences.map((reference) => (
              <span
                key={reference}
                className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-300"
              >
                {reference}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">No references</span>
          )}
        </div>
      </div>
    </article>
  );
}
