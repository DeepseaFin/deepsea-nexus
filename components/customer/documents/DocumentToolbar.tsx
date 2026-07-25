"use client";

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

export default function DocumentToolbar({
  value,
  categories,
  statuses,
  onChange,
}: DocumentToolbarProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Search</span>
        <input
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
          placeholder="Search documents, references"
          className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Category</span>
        <select
          value={value.category}
          onChange={(event) => onChange({ ...value, category: event.target.value as DocumentToolbarValue["category"] })}
          className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
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
          className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
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
          className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="type">Document Type</option>
        </select>
      </label>
    </div>
  );
}
