"use client";

import { memo } from "react";
import FilterPanel from "@/components/customer/shared/FilterPanel";
import SearchBar from "@/components/customer/shared/SearchBar";
import Toolbar from "@/components/customer/shared/Toolbar";
import type { RelationshipDocumentBusinessCategory } from "@/lib/customer/RelationshipDocumentExplorerViewModel";

export type DocumentSortOrder = "newest" | "oldest" | "type";

export interface DocumentToolbarValue {
  readonly search: string;
  readonly category: "all" | RelationshipDocumentBusinessCategory;
  readonly status: "all" | string;
  readonly sortOrder: DocumentSortOrder;
}

export interface DocumentToolbarProps {
  readonly value: DocumentToolbarValue;
  readonly categories: readonly RelationshipDocumentBusinessCategory[];
  readonly statuses: readonly string[];
  readonly onChange: (next: DocumentToolbarValue) => void;
}

function toLabel(value: string): string {
  return value.replace(/-/g, " ").replace(/_/g, " ").replace(/\b\w/g, (part) => part.toUpperCase());
}

const SELECT_CLASS = "rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 transition-colors hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70";

function DocumentToolbar({
  value,
  categories,
  statuses,
  onChange,
}: DocumentToolbarProps) {
  return (
    <Toolbar
      title="Document Filters"
      subtitle="Search documents and narrow by category, status, or sort order"
      search={
        <SearchBar
          value={value.search}
          onChange={(search) => onChange({ ...value, search })}
          label="Search Documents"
          placeholder="Search documents, references"
        />
      }
      filters={
        <FilterPanel title="Controls" subtitle="Category, status, and sort order">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Category</span>
              <select
                value={value.category}
                onChange={(event) => onChange({ ...value, category: event.target.value as DocumentToolbarValue["category"] })}
                className={SELECT_CLASS}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {toLabel(category)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Status</span>
              <select
                value={value.status}
                onChange={(event) => onChange({ ...value, status: event.target.value })}
                className={SELECT_CLASS}
              >
                <option value="all">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {toLabel(status)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Sort Order</span>
              <select
                value={value.sortOrder}
                onChange={(event) => onChange({ ...value, sortOrder: event.target.value as DocumentSortOrder })}
                className={SELECT_CLASS}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="type">Document Type</option>
              </select>
            </label>
          </div>
        </FilterPanel>
      }
    />
  );
}

const MemoizedDocumentToolbar = memo(DocumentToolbar);
MemoizedDocumentToolbar.displayName = "DocumentToolbar";

export default MemoizedDocumentToolbar;
