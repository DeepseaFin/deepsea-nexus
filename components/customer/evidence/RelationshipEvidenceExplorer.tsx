"use client";

import { useMemo, useState } from "react";
import EvidenceDomainSection from "@/components/customer/evidence/EvidenceDomainSection";
import EvidenceToolbar, { type EvidenceToolbarValue } from "@/components/customer/evidence/EvidenceToolbar";
import EmptyState from "@/components/customer/shared/EmptyState";
import ErrorState from "@/components/customer/shared/ErrorState";
import LoadingState from "@/components/customer/shared/LoadingState";
import SectionCard from "@/components/ui/SectionCard";
import type {
  RelationshipEvidenceBusinessDomain,
  RelationshipEvidenceDomainGroupViewModel,
  RelationshipEvidenceExplorerViewModel,
  RelationshipEvidenceItemViewModel,
} from "@/lib/customer/RelationshipEvidenceExplorerViewModel";

export interface RelationshipEvidenceExplorerProps {
  readonly explorer?: RelationshipEvidenceExplorerViewModel;
  readonly isLoading?: boolean;
  readonly error?: string;
}

const EMPTY_EVIDENCE_EXPLORER: RelationshipEvidenceExplorerViewModel = {
  generatedAt: "",
  totalEvidenceItems: 0,
  domains: [],
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function sortItems(
  items: readonly RelationshipEvidenceItemViewModel[],
  sortOrder: EvidenceToolbarValue["sortOrder"],
): RelationshipEvidenceItemViewModel[] {
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
      return left.businessFact.localeCompare(right.businessFact);
    }

    return sortOrder === "newest" ? rightTime - leftTime : leftTime - rightTime;
  });
}

function matchesSearch(item: RelationshipEvidenceItemViewModel, query: string): boolean {
  if (!query) {
    return true;
  }

  const documentLabels = item.supportingDocuments.map((document) => document.label).join(" ");
  const knowledgeLabels = item.relatedKnowledge.map((knowledge) => knowledge.factName).join(" ");
  const haystack = normalize(`${item.businessFact} ${item.confidence.band} ${documentLabels} ${knowledgeLabels}`);
  return haystack.includes(query);
}

export default function RelationshipEvidenceExplorer({ explorer, isLoading = false, error }: RelationshipEvidenceExplorerProps) {
  const resolvedExplorer: RelationshipEvidenceExplorerViewModel = explorer ?? EMPTY_EVIDENCE_EXPLORER;

  const [toolbarValue, setToolbarValue] = useState<EvidenceToolbarValue>({
    search: "",
    domain: "all",
    confidence: "all",
    sortOrder: "newest",
  });

  const domains = useMemo<readonly RelationshipEvidenceBusinessDomain[]>(
    () => resolvedExplorer.domains.map((domain) => domain.key),
    [resolvedExplorer.domains],
  );

  const filteredDomains = useMemo<readonly RelationshipEvidenceDomainGroupViewModel[]>(() => {
    const query = normalize(toolbarValue.search);

    const scopedDomains = toolbarValue.domain === "all"
      ? resolvedExplorer.domains
      : resolvedExplorer.domains.filter((domain) => domain.key === toolbarValue.domain);

    return scopedDomains
      .map((domain) => {
        const filteredItems = domain.evidenceItems
          .filter((item) => matchesSearch(item, query))
          .filter((item) => toolbarValue.confidence === "all" || item.confidence.band === toolbarValue.confidence);

        return {
          ...domain,
          evidenceItems: sortItems(filteredItems, toolbarValue.sortOrder),
          totalEvidenceItems: filteredItems.length,
        };
      })
      .filter((domain) => domain.totalEvidenceItems > 0 || toolbarValue.domain !== "all");
  }, [resolvedExplorer.domains, toolbarValue.confidence, toolbarValue.domain, toolbarValue.search, toolbarValue.sortOrder]);

  const visibleItemCount = useMemo(
    () => filteredDomains.reduce((count, domain) => count + domain.totalEvidenceItems, 0),
    [filteredDomains],
  );

  if (isLoading) {
    return <LoadingState title="Relationship Evidence Explorer" message="Loading evidence explorer" />;
  }

  if (error) {
    return <ErrorState title="Relationship Evidence Explorer" message={`Unable to render evidence explorer: ${error}`} />;
  }

  if (!explorer) {
    return (
      <SectionCard title="Relationship Evidence Explorer" subtitle="No evidence explorer data is currently available">
        <EmptyState message="Evidence explorer data is not available in this workspace." />
      </SectionCard>
    );
  }

  return (
    <div className="space-y-5">
      <SectionCard
        title="Relationship Evidence Explorer"
        subtitle={`${visibleItemCount} of ${resolvedExplorer.totalEvidenceItems} evidence items visible`}
      >
        <EvidenceToolbar value={toolbarValue} domains={domains} onChange={setToolbarValue} />
      </SectionCard>

      <SectionCard
        title="Evidence Domains"
        subtitle="Corporate Identity, Financial Profile, Trade Activity, Compliance, and Operations"
      >
        <div className="space-y-5">
          {filteredDomains.map((domain) => (
            <EvidenceDomainSection key={domain.key} domain={domain} />
          ))}

          {filteredDomains.length === 0 ? (
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
              <EmptyState message="No evidence items match the current search and filters." />
            </div>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
