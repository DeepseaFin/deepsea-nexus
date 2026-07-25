"use client";

import KnowledgeCard from "@/components/customer/knowledge/KnowledgeCard";
import type { RelationshipKnowledgeDomainGroupViewModel } from "@/lib/customer/RelationshipKnowledgeExplorerViewModel";

export interface KnowledgeDomainSectionProps {
  readonly domain: RelationshipKnowledgeDomainGroupViewModel;
}

export default function KnowledgeDomainSection({ domain }: KnowledgeDomainSectionProps) {
  return (
    <section className="space-y-3" aria-label={domain.title}>
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">
        <h3 className="text-sm font-semibold text-slate-100">{domain.title}</h3>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          {domain.totalKnowledgeItems} items
        </span>
      </div>

      {domain.knowledgeItems.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {domain.knowledgeItems.map((item) => (
            <KnowledgeCard key={item.knowledgeId} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-500">
          No knowledge items in this domain.
        </div>
      )}
    </section>
  );
}
