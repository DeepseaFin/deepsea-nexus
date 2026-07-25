"use client";

import type { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
import type { RelationshipKnowledgeBusinessDomain } from "@/lib/customer/RelationshipKnowledgeExplorerViewModel";

export type KnowledgeSortOrder = "newest" | "oldest" | "confidence-high" | "confidence-low";

export interface KnowledgeToolbarValue {
  readonly search: string;
  readonly domain: "all" | RelationshipKnowledgeBusinessDomain;
  readonly confidence: "all" | ConfidenceBand;
  readonly sortOrder: KnowledgeSortOrder;
}

export interface KnowledgeToolbarProps {
  readonly value: KnowledgeToolbarValue;
  readonly domains: readonly RelationshipKnowledgeBusinessDomain[];
  readonly onChange: (next: KnowledgeToolbarValue) => void;
}

function toLabel(value: string): string {
  return value.replace(/-/g, " ").replace(/_/g, " ").replace(/\b\w/g, (part) => part.toUpperCase());
}

const CONFIDENCE_OPTIONS: readonly Array<"all" | ConfidenceBand> = [
  "all",
  "very_high",
  "high",
  "moderate",
  "low",
  "very_low",
] as const;

export default function KnowledgeToolbar({ value, domains, onChange }: KnowledgeToolbarProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Search</span>
        <input
          value={value.search}
          onChange={(event) => onChange({ ...value, search: event.target.value })}
          placeholder="Search conclusions, evidence, documents"
          className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Domain</span>
        <select
          value={value.domain}
          onChange={(event) => onChange({ ...value, domain: event.target.value as KnowledgeToolbarValue["domain"] })}
          className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
          <option value="all">All Domains</option>
          {domains.map((domain) => (
            <option key={domain} value={domain}>
              {toLabel(domain)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Confidence</span>
        <select
          value={value.confidence}
          onChange={(event) => onChange({ ...value, confidence: event.target.value as KnowledgeToolbarValue["confidence"] })}
          className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
          {CONFIDENCE_OPTIONS.map((confidence) => (
            <option key={confidence} value={confidence}>
              {confidence === "all" ? "All Confidence" : toLabel(confidence)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Sort Order</span>
        <select
          value={value.sortOrder}
          onChange={(event) => onChange({ ...value, sortOrder: event.target.value as KnowledgeSortOrder })}
          className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="confidence-high">Confidence High to Low</option>
          <option value="confidence-low">Confidence Low to High</option>
        </select>
      </label>
    </div>
  );
}
