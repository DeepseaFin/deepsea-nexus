"use client";

import type { RelationshipTimelineEventType } from "@/lib/customer/RelationshipTimelineViewModel";

export type TimelineDateRangeFilter = "all" | "7d" | "30d" | "90d";
export type TimelineBusinessDomainFilter = "all" | "corporate" | "financial" | "trade" | "compliance" | "operations";

export interface TimelineFiltersValue {
  readonly eventType: "all" | RelationshipTimelineEventType;
  readonly dateRange: TimelineDateRangeFilter;
  readonly businessDomain: TimelineBusinessDomainFilter;
}

export interface TimelineFiltersProps {
  readonly availableEventTypes: readonly RelationshipTimelineEventType[];
  readonly value: TimelineFiltersValue;
  readonly onChange: (next: TimelineFiltersValue) => void;
}

function toLabel(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (part) => part.toUpperCase());
}

const DATE_RANGES: readonly TimelineDateRangeFilter[] = ["all", "7d", "30d", "90d"] as const;
const BUSINESS_DOMAINS: readonly TimelineBusinessDomainFilter[] = [
  "all",
  "corporate",
  "financial",
  "trade",
  "compliance",
  "operations",
] as const;

export default function TimelineFilters({ availableEventTypes, value, onChange }: TimelineFiltersProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">Event Type</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...value, eventType: "all" })}
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
              value.eventType === "all"
                ? "border-cyan-600/55 bg-cyan-900/30 text-cyan-100"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
            }`}
          >
            All
          </button>
          {availableEventTypes.map((eventType) => {
            const isActive = value.eventType === eventType;
            return (
              <button
                key={eventType}
                type="button"
                onClick={() => onChange({ ...value, eventType })}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                  isActive
                    ? "border-cyan-600/55 bg-cyan-900/30 text-cyan-100"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
                }`}
              >
                {toLabel(eventType)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">Date Range</p>
        <div className="flex flex-wrap gap-2">
          {DATE_RANGES.map((dateRange) => {
            const isActive = value.dateRange === dateRange;
            return (
              <button
                key={dateRange}
                type="button"
                onClick={() => onChange({ ...value, dateRange })}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                  isActive
                    ? "border-cyan-600/55 bg-cyan-900/30 text-cyan-100"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
                }`}
              >
                {dateRange === "all" ? "All" : `Last ${dateRange.replace("d", " Days")}`}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">Business Domain</p>
        <div className="flex flex-wrap gap-2">
          {BUSINESS_DOMAINS.map((domain) => {
            const isActive = value.businessDomain === domain;
            return (
              <button
                key={domain}
                type="button"
                onClick={() => onChange({ ...value, businessDomain: domain })}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
                  isActive
                    ? "border-cyan-600/55 bg-cyan-900/30 text-cyan-100"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
                }`}
              >
                {toLabel(domain)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
