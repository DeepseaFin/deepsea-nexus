"use client";

import { useMemo, useState } from "react";
import DocumentCategorySection from "@/components/customer/documents/DocumentCategorySection";
import DocumentToolbar, { type DocumentToolbarValue } from "@/components/customer/documents/DocumentToolbar";
import SectionCard from "@/components/ui/SectionCard";
import type {
  RelationshipDocumentBusinessCategory,
  RelationshipDocumentExplorerCategoryViewModel,
  RelationshipDocumentExplorerDocumentViewModel,
  RelationshipDocumentExplorerViewModel,
} from "@/lib/customer/RelationshipDocumentExplorerViewModel";

export interface RelationshipDocumentExplorerProps {
  readonly explorer: RelationshipDocumentExplorerViewModel;
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

export default function RelationshipDocumentExplorer({ explorer }: RelationshipDocumentExplorerProps) {
  const [toolbarValue, setToolbarValue] = useState<DocumentToolbarValue>({
    search: "",
    category: "all",
    status: "all",
    sortOrder: "newest",
  });

  const categories = useMemo<readonly RelationshipDocumentBusinessCategory[]>(
    () => explorer.categories.map((category) => category.key),
    [explorer.categories],
  );

  const statuses = useMemo<readonly string[]>(() => {
    const statusSet = new Set<string>();
    for (const category of explorer.categories) {
      for (const document of category.documents) {
        statusSet.add(document.processingStatus);
      }
    }

    return [...statusSet].sort((left, right) => left.localeCompare(right));
  }, [explorer.categories]);

  const filteredCategories = useMemo<readonly RelationshipDocumentExplorerCategoryViewModel[]>(() => {
    const query = normalize(toolbarValue.search);

    const selectedCategories = toolbarValue.category === "all"
      ? explorer.categories
      : explorer.categories.filter((category) => category.key === toolbarValue.category);

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
  }, [explorer.categories, toolbarValue.category, toolbarValue.search, toolbarValue.sortOrder, toolbarValue.status]);

  const visibleDocumentCount = filteredCategories.reduce((count, category) => count + category.totalDocuments, 0);

  return (
    <div className="space-y-4">
      <SectionCard
        title="Relationship Document Explorer"
        subtitle={`${visibleDocumentCount} of ${explorer.totalDocuments} documents visible`}
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
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <DocumentCategorySection key={category.key} category={category} />
          ))}

          {filteredCategories.length === 0 ? (
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-500">
              No documents match the current search and filters.
            </div>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
