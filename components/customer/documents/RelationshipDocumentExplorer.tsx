"use client";

import { useMemo, useState } from "react";
import DocumentCategorySection from "@/components/customer/documents/DocumentCategorySection";
import DocumentToolbar, { type DocumentToolbarValue } from "@/components/customer/documents/DocumentToolbar";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type {
  RelationshipDocumentBusinessCategory,
  RelationshipDocumentExplorerCategoryViewModel,
  RelationshipDocumentExplorerDocumentViewModel,
  RelationshipDocumentExplorerViewModel,
} from "@/lib/customer/RelationshipDocumentExplorerViewModel";

export interface RelationshipDocumentExplorerProps {
  readonly explorer?: RelationshipDocumentExplorerViewModel;
  readonly isLoading?: boolean;
  readonly error?: string;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function sortDocuments(
  documents: readonly RelationshipDocumentExplorerDocumentViewModel[],
  order: DocumentToolbarValue["sortOrder"],
): RelationshipDocumentExplorerDocumentViewModel[] {
  if (order === "type") {
    return [...documents].sort((left, right) => left.documentType.localeCompare(right.documentType));
  }

  return [...documents].sort((left, right) => {
    const leftTime = Date.parse(left.processingDate);
    const rightTime = Date.parse(right.processingDate);

    if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
      return 0;
    }

    return order === "newest" ? rightTime - leftTime : leftTime - rightTime;
  });
}

function includesQuery(document: RelationshipDocumentExplorerDocumentViewModel, query: string): boolean {
  if (!query) {
    return true;
  }

  const haystack = normalize(
    `${document.documentType} ${document.processingStatus} ${document.businessPassportReferences.join(" ")}`,
  );
  return haystack.includes(query);
}

export default function RelationshipDocumentExplorer({ explorer, isLoading = false, error }: RelationshipDocumentExplorerProps) {
  const resolvedExplorer: RelationshipDocumentExplorerViewModel = explorer ?? {
    generatedAt: "",
    totalDocuments: 0,
    categories: [],
  };

  const [toolbarValue, setToolbarValue] = useState<DocumentToolbarValue>({
    search: "",
    category: "all",
    status: "all",
    sortOrder: "newest",
  });

  const categories = useMemo<readonly RelationshipDocumentBusinessCategory[]>(
    () => resolvedExplorer.categories.map((category) => category.key),
    [resolvedExplorer.categories],
  );

  const statuses = useMemo<readonly string[]>(() => {
    const statusSet = new Set<string>();
    for (const category of resolvedExplorer.categories) {
      for (const document of category.documents) {
        statusSet.add(document.processingStatus);
      }
    }

    return [...statusSet].sort((left, right) => left.localeCompare(right));
  }, [resolvedExplorer.categories]);

  const filteredCategories = useMemo<readonly RelationshipDocumentExplorerCategoryViewModel[]>(() => {
    const query = normalize(toolbarValue.search);

    const selectedCategories = toolbarValue.category === "all"
      ? resolvedExplorer.categories
      : resolvedExplorer.categories.filter((category) => category.key === toolbarValue.category);

    return selectedCategories
      .map((category) => {
        const filteredDocuments = category.documents
          .filter((document) => includesQuery(document, query))
          .filter((document) => toolbarValue.status === "all" || document.processingStatus === toolbarValue.status);

        return {
          ...category,
          documents: sortDocuments(filteredDocuments, toolbarValue.sortOrder),
          totalDocuments: filteredDocuments.length,
        };
      })
      .filter((category) => category.totalDocuments > 0 || toolbarValue.category !== "all");
  }, [resolvedExplorer.categories, toolbarValue.category, toolbarValue.search, toolbarValue.sortOrder, toolbarValue.status]);

  const visibleDocumentCount = filteredCategories.reduce((count, category) => count + category.totalDocuments, 0);

  if (isLoading) {
    return <PanelLoadingState title="Relationship Document Explorer" subtitle="Loading document explorer" />;
  }

  if (error) {
    return <PanelErrorState title="Relationship Document Explorer" subtitle="Unable to render document explorer" message={error} />;
  }

  if (!explorer) {
    return (
      <SectionCard title="Relationship Document Explorer" subtitle="No document explorer data is currently available">
        <PanelEmptyState message="Document explorer data is not available in this workspace." />
      </SectionCard>
    );
  }

  return (
    <div className="space-y-5">
      <SectionCard
        title="Relationship Document Explorer"
        subtitle={`${visibleDocumentCount} of ${resolvedExplorer.totalDocuments} documents visible`}
      >
        <DocumentToolbar
          value={toolbarValue}
          categories={categories}
          statuses={statuses}
          onChange={setToolbarValue}
        />
      </SectionCard>

      <SectionCard
        title="Document Categories"
        subtitle="Corporate, Financial, Trade, Compliance, Legal, and Other"
      >
        <div className="space-y-5">
          {filteredCategories.map((category) => (
            <DocumentCategorySection key={category.key} category={category} />
          ))}

          {filteredCategories.length === 0 ? (
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
              <PanelEmptyState message="No documents match the current search and filters." />
            </div>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
