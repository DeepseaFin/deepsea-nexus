"use client";

import ConfidenceBadge from "@/components/atlas/intelligence/ConfidenceBadge";
import type { RelationshipEvidenceItemViewModel } from "@/lib/customer/RelationshipEvidenceExplorerViewModel";

export interface EvidenceCardProps {
  readonly item: RelationshipEvidenceItemViewModel;
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

export default function EvidenceCard({ item }: EvidenceCardProps) {
  return (
    <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-colors hover:border-slate-700 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-400/40">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-100">{item.businessFact}</h4>
        <ConfidenceBadge score={item.confidence.score} label={item.confidence.band} />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Supporting Documents</p>
          <ul className="mt-1 space-y-1 text-sm text-slate-300">
            {item.supportingDocuments.length > 0 ? (
              item.supportingDocuments.map((document) => (
                <li key={document.id} className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1">
                  {document.label}
                </li>
              ))
            ) : (
              <li className="text-slate-500">No supporting documents.</li>
            )}
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Related Knowledge</p>
          <ul className="mt-1 space-y-1 text-sm text-slate-300">
            {item.relatedKnowledge.length > 0 ? (
              item.relatedKnowledge.slice(0, 4).map((knowledge) => (
                <li key={knowledge.knowledgeId} className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1">
                  {knowledge.factName}
                </li>
              ))
            ) : (
              <li className="text-slate-500">No related knowledge.</li>
            )}
          </ul>
        </div>
      </div>

      <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-slate-500">
        Last Updated: <span className="normal-case text-slate-300">{formatDateTime(item.lastUpdated)}</span>
      </p>
    </article>
  );
}
