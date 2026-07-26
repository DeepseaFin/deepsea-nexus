"use client";

import type { KeyboardEvent } from "react";
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

function focusAdjacentChip(event: KeyboardEvent<HTMLDivElement>): void {
  const container = event.currentTarget;
  const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>("button"));
  if (buttons.length === 0) {
    return;
  }

  const activeIndex = buttons.findIndex((button) => button === document.activeElement);
  if (activeIndex < 0) {
    return;
  }

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    buttons[(activeIndex + 1) % buttons.length]?.focus();
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    buttons[(activeIndex - 1 + buttons.length) % buttons.length]?.focus();
    return;
  }

  if (event.key === "Home") {
    event.preventDefault();
    buttons[0]?.focus();
    return;
  }

  if (event.key === "End") {
    event.preventDefault();
    buttons[buttons.length - 1]?.focus();
  }
}

const CHIP_CLASS = "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 disabled:cursor-not-allowed disabled:opacity-60";

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
    <div className="space-y-3" role="group" aria-label="Timeline filters">
      <fieldset>
        <legend className="mb-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">Event Type</legend>
        <div className="flex flex-wrap gap-2" onKeyDown={focusAdjacentChip} role="group" aria-label="Filter timeline by event type">
          <button
            type="button"
            onClick={() => onChange({ ...value, eventType: "all" })}
            aria-pressed={value.eventType === "all"}
            className={`${CHIP_CLASS} ${
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
                aria-pressed={isActive}
                className={`${CHIP_CLASS} ${
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
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">Date Range</legend>
        <div className="flex flex-wrap gap-2" onKeyDown={focusAdjacentChip} role="group" aria-label="Filter timeline by date range">
          {DATE_RANGES.map((dateRange) => {
            const isActive = value.dateRange === dateRange;
            return (
              <button
                key={dateRange}
                type="button"
                onClick={() => onChange({ ...value, dateRange })}
                aria-pressed={isActive}
                className={`${CHIP_CLASS} ${
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
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">Business Domain</legend>
        <div className="flex flex-wrap gap-2" onKeyDown={focusAdjacentChip} role="group" aria-label="Filter timeline by business domain">
          {BUSINESS_DOMAINS.map((domain) => {
            const isActive = value.businessDomain === domain;
            return (
              <button
                key={domain}
                type="button"
                onClick={() => onChange({ ...value, businessDomain: domain })}
                aria-pressed={isActive}
                className={`${CHIP_CLASS} ${
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
      </fieldset>
    </div>
  );
}
