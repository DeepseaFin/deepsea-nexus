"use client";

import { useMemo, useState } from "react";
import KnowledgeDomainSection from "@/components/customer/knowledge/KnowledgeDomainSection";
import KnowledgeToolbar, { type KnowledgeToolbarValue } from "@/components/customer/knowledge/KnowledgeToolbar";
import EmptyState from "@/components/customer/shared/EmptyState";
import ErrorState from "@/components/customer/shared/ErrorState";
import LoadingState from "@/components/customer/shared/LoadingState";
import SectionCard from "@/components/ui/SectionCard";
import type {
  RelationshipKnowledgeBusinessDomain,
  RelationshipKnowledgeDomainGroupViewModel,
  RelationshipKnowledgeExplorerViewModel,
  RelationshipKnowledgeItemViewModel,
} from "@/lib/customer/RelationshipKnowledgeExplorerViewModel";

export interface RelationshipKnowledgeExplorerProps {
  readonly explorer?: RelationshipKnowledgeExplorerViewModel;
  readonly isLoading?: boolean;
  readonly error?: string;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function sortItems(
  items: readonly RelationshipKnowledgeItemViewModel[],
  sortOrder: KnowledgeToolbarValue["sortOrder"],
): RelationshipKnowledgeItemViewModel[] {
  return [...items].sort((left, right) => {
    if (sortOrder === "confidence-high") {
      return right.confidence.score - left.confidence.score;
    }

    if (sortOrder === "confidence-low") {
      return left.confidence.score - right.confidence.score;
    }

    const leftTime = Date.parse(left.lastUpdated);
    const rightTime = Date.parse(right.lastUpdated);

    if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
      return left.businessConclusion.localeCompare(right.businessConclusion);
    }

    return sortOrder === "newest" ? rightTime - leftTime : leftTime - rightTime;
  });
}

function matchesSearch(item: RelationshipKnowledgeItemViewModel, query: string): boolean {
  if (!query) {
    return true;
  }

  const evidenceLabels = item.supportingEvidence.map((evidence) => evidence.evidenceType).join(" ");
  const documentLabels = item.relatedDocuments.map((document) => document.label).join(" ");
  const passportLabels = item.businessPassportReferences.join(" ");
  const haystack = normalize(`${item.businessConclusion} ${item.confidence.band} ${evidenceLabels} ${documentLabels} ${passportLabels}`);
  return haystack.includes(query);
}

export default function RelationshipKnowledgeExplorer({ explorer, isLoading = false, error }: RelationshipKnowledgeExplorerProps) {
  const resolvedExplorer: RelationshipKnowledgeExplorerViewModel = explorer ?? {
    generatedAt: "",
    totalKnowledgeItems: 0,
    domains: [],
  };

  const [toolbarValue, setToolbarValue] = useState<KnowledgeToolbarValue>({
    search: "",
    domain: "all",
    confidence: "all",
    sortOrder: "newest",
  });

  const domains = useMemo<readonly RelationshipKnowledgeBusinessDomain[]>(
    () => resolvedExplorer.domains.map((domain) => domain.key),
    [resolvedExplorer.domains],
  );

  const filteredDomains = useMemo<readonly RelationshipKnowledgeDomainGroupViewModel[]>(() => {
    const query = normalize(toolbarValue.search);

    const scopedDomains = toolbarValue.domain === "all"
      ? resolvedExplorer.domains
      : resolvedExplorer.domains.filter((domain) => domain.key === toolbarValue.domain);

    return scopedDomains
      .map((domain) => {
        const filteredItems = domain.knowledgeItems
          .filter((item) => matchesSearch(item, query))
          .filter((item) => toolbarValue.confidence === "all" || item.confidence.band === toolbarValue.confidence);

        return {
          ...domain,
          knowledgeItems: sortItems(filteredItems, toolbarValue.sortOrder),
          totalKnowledgeItems: filteredItems.length,
        };
      })
      .filter((domain) => domain.totalKnowledgeItems > 0 || toolbarValue.domain !== "all");
  }, [resolvedExplorer.domains, toolbarValue.confidence, toolbarValue.domain, toolbarValue.search, toolbarValue.sortOrder]);

  const visibleItemCount = filteredDomains.reduce((count, domain) => count + domain.totalKnowledgeItems, 0);

  if (isLoading) {
    return <LoadingState title="Relationship Knowledge Explorer" message="Loading knowledge explorer" />;
  }

  if (error) {
    return <ErrorState title="Relationship Knowledge Explorer" message={`Unable to render knowledge explorer: ${error}`} />;
  }

  if (!explorer) {
    return (
      <SectionCard title="Relationship Knowledge Explorer" subtitle="No knowledge explorer data is currently available">
        <EmptyState message="Knowledge explorer data is not available in this workspace." />
      </SectionCard>
    );
  }

  return (
    <div className="space-y-5">
      <SectionCard
        title="Relationship Knowledge Explorer"
        subtitle={`${visibleItemCount} of ${resolvedExplorer.totalKnowledgeItems} knowledge items visible`}
      >
        <KnowledgeToolbar value={toolbarValue} domains={domains} onChange={setToolbarValue} />
      </SectionCard>

      <SectionCard
        title="Knowledge Domains"
        subtitle="Corporate, Financial, Trade, Compliance, and Operations"
      >
        <div className="space-y-5">
          {filteredDomains.map((domain) => (
            <KnowledgeDomainSection key={domain.key} domain={domain} />
          ))}

          {filteredDomains.length === 0 ? (
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
              <EmptyState message="No knowledge items match the current search and filters." />
            </div>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
