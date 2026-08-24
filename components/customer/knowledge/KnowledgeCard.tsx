"use client";

import { memo } from "react";
import ConfidenceBadge from "@/components/atlas/intelligence/ConfidenceBadge";
import type { RelationshipKnowledgeItemViewModel } from "@/lib/customer/RelationshipKnowledgeExplorerViewModel";

export interface KnowledgeCardProps {
  readonly item: RelationshipKnowledgeItemViewModel;
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

function KnowledgeCard({ item }: KnowledgeCardProps) {
  return (
    <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-colors hover:border-slate-700 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-400/40">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-100">{item.businessConclusion}</h4>
        <ConfidenceBadge score={item.confidence.score} label={item.confidence.band} />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Supporting Evidence</p>
          <ul className="mt-1 space-y-1 text-sm text-slate-300">
            {item.supportingEvidence.length > 0 ? (
              item.supportingEvidence.slice(0, 5).map((evidence) => (
                <li key={evidence.evidenceId} className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1">
                  {evidence.evidenceType}
                </li>
              ))
            ) : (
              <li className="text-slate-500">No supporting evidence.</li>
            )}
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Related Documents</p>
          <ul className="mt-1 space-y-1 text-sm text-slate-300">
            {item.relatedDocuments.length > 0 ? (
              item.relatedDocuments.slice(0, 5).map((document) => (
                <li key={document.id} className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1">
                  {document.label}
                </li>
              ))
            ) : (
              <li className="text-slate-500">No related documents.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Business Passport References</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {item.businessPassportReferences.length > 0 ? (
            item.businessPassportReferences.map((reference) => (
              <span
                key={reference}
                className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-300"
              >
                {reference}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">No passport references.</span>
          )}
        </div>
      </div>

      <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-slate-500">
        Last Updated: <span className="normal-case text-slate-300">{formatDateTime(item.lastUpdated)}</span>
      </p>
    </article>
  );
}

const MemoizedKnowledgeCard = memo(KnowledgeCard);
MemoizedKnowledgeCard.displayName = "KnowledgeCard";

export default MemoizedKnowledgeCard;
