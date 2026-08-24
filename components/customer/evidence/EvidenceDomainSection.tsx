"use client";

import { memo } from "react";
import EvidenceCard from "@/components/customer/evidence/EvidenceCard";
import type { RelationshipEvidenceDomainGroupViewModel } from "@/lib/customer/RelationshipEvidenceExplorerViewModel";

export interface EvidenceDomainSectionProps {
  readonly domain: RelationshipEvidenceDomainGroupViewModel;
}

function EvidenceDomainSection({ domain }: EvidenceDomainSectionProps) {
  return (
    <section className="space-y-3" aria-label={domain.title}>
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">
        <h3 className="text-sm font-semibold text-slate-100">{domain.title}</h3>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          {domain.totalEvidenceItems} items
        </span>
      </div>

      {domain.evidenceItems.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {domain.evidenceItems.map((item) => (
            <EvidenceCard key={item.businessFact} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-500">
          No evidence items in this domain.
        </div>
      )}
    </section>
  );
}

const MemoizedEvidenceDomainSection = memo(EvidenceDomainSection);
MemoizedEvidenceDomainSection.displayName = "EvidenceDomainSection";

export default MemoizedEvidenceDomainSection;
