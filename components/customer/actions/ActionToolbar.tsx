"use client";

import type {
  RelationshipActionCategory,
  RelationshipActionPriority,
} from "@/lib/customer/RelationshipActionCenterViewModel";

export type ActionPriorityFilter = "all" | "critical" | RelationshipActionPriority;
export type ActionSortOrder = "priority" | "title";

export interface ActionToolbarValue {
  readonly search: string;
  readonly priority: ActionPriorityFilter;
  readonly category: "all" | RelationshipActionCategory;
  readonly sortOrder: ActionSortOrder;
}

export interface ActionToolbarProps {
  readonly value: ActionToolbarValue;
  readonly categories: readonly RelationshipActionCategory[];
  readonly onChange: (next: ActionToolbarValue) => void;
}

function toLabel(value: string): string {
  return value.replace(/-/g, " ").replace(/_/g, " ").replace(/\b\w/g, (part) => part.toUpperCase());
}

const PRIORITY_OPTIONS: readonly ActionPriorityFilter[] = ["all", "critical", "high", "medium", "low"] as const;

export default function ActionToolbar({ value, categories, onChange }: ActionToolbarProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Search</span>
        <input
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
          placeholder="Search actions, documents, source"
          className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Priority</span>
        <select
          value={value.priority}
          onChange={(event) => onChange({ ...value, priority: event.target.value as ActionPriorityFilter })}
          className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
          {PRIORITY_OPTIONS.map((priority) => (
            <option key={priority} value={priority}>
              {toLabel(priority)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Category</span>
        <select
          value={value.category}
          onChange={(event) => onChange({ ...value, category: event.target.value as ActionToolbarValue["category"] })}
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
        <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Sort Order</span>
        <select
          value={value.sortOrder}
          onChange={(event) => onChange({ ...value, sortOrder: event.target.value as ActionSortOrder })}
          className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </label>
    </div>
  );
}
