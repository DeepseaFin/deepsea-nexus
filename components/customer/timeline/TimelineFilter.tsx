"use client";

import React from "react";
import type { TimelineFilterValue } from "@/lib/customer/timeline/timeline.types";

export interface TimelineFilterProps {
  readonly title: string;
  readonly filters: readonly TimelineFilterValue[];
  readonly activeFilter: TimelineFilterValue;
  readonly onFilterChange: (value: TimelineFilterValue) => void;
}

function focusAdjacentChip(event: React.KeyboardEvent<HTMLDivElement>): void {
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

function TimelineFilter({ title, filters, activeFilter, onFilterChange }: TimelineFilterProps) {
  return (
    <section aria-label={title}>
      <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">{title}</p>
      <div className="flex flex-wrap gap-2" onKeyDown={focusAdjacentChip} role="group" aria-label={title}>
        {filters.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              aria-pressed={isActive}
              className={`${CHIP_CLASS} ${
                isActive
                  ? "border-cyan-600/55 bg-cyan-900/30 text-cyan-100"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </section>
  );
}

const MemoizedTimelineFilter = React.memo(TimelineFilter);
MemoizedTimelineFilter.displayName = "TimelineFilter";

export default MemoizedTimelineFilter;
