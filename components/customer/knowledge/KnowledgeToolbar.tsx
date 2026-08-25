"use client";

import { memo } from "react";
import FilterPanel from "@/components/customer/shared/FilterPanel";
import SearchBar from "@/components/customer/shared/SearchBar";
import Toolbar from "@/components/customer/shared/Toolbar";
import { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
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

const SELECT_CLASS = "rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 transition-colors hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70";

const CONFIDENCE_OPTIONS: ReadonlyArray<"all" | ConfidenceBand> = [
  "all",
  ConfidenceBand.VeryHigh,
  ConfidenceBand.High,
  ConfidenceBand.Moderate,
  ConfidenceBand.Low,
  ConfidenceBand.VeryLow,
];

function KnowledgeToolbar({ value, domains, onChange }: KnowledgeToolbarProps) {
  return (
    <Toolbar
      title="Knowledge Filters"
      subtitle="Search knowledge and narrow by domain, confidence, or order"
      search={
        <SearchBar
          value={value.search}
          onChange={(search) => onChange({ ...value, search })}
          label="Search Knowledge"
          placeholder="Search conclusions, evidence, documents"
        />
      }
      filters={
        <FilterPanel title="Controls" subtitle="Domain, confidence, and sort order">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Domain</span>
              <select
                value={value.domain}
                onChange={(event) => onChange({ ...value, domain: event.target.value as KnowledgeToolbarValue["domain"] })}
                className={SELECT_CLASS}
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
                className={SELECT_CLASS}
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
                className={SELECT_CLASS}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="confidence-high">Confidence High to Low</option>
                <option value="confidence-low">Confidence Low to High</option>
              </select>
            </label>
          </div>
        </FilterPanel>
      }
    />
  );
}

const MemoizedKnowledgeToolbar = memo(KnowledgeToolbar);
MemoizedKnowledgeToolbar.displayName = "KnowledgeToolbar";

export default MemoizedKnowledgeToolbar;
