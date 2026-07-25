"use client";

import DocumentCard from "@/components/customer/documents/DocumentCard";
import type { RelationshipDocumentExplorerCategoryViewModel } from "@/lib/customer/RelationshipDocumentExplorerViewModel";

export interface DocumentCategorySectionProps {
  readonly category: RelationshipDocumentExplorerCategoryViewModel;
}

export default function DocumentCategorySection({ category }: DocumentCategorySectionProps) {
  return (
    <section className="space-y-3" aria-label={category.title}>
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">
        <h3 className="text-sm font-semibold text-slate-100">{category.title}</h3>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          {category.totalDocuments} docs
        </span>
      </div>

      {category.documents.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {category.documents.map((document) => (
            <DocumentCard key={document.documentId} document={document} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-500">
          No documents in this category.
        </div>
      )}
    </section>
  );
}
