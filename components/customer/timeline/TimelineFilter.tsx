"use client";

import React from "react";
import type { TimelineFilterValue } from "@/lib/customer/timeline/timeline.types";

export interface TimelineFilterProps {
  readonly title: string;
  readonly filters: readonly TimelineFilterValue[];
  readonly activeFilter: TimelineFilterValue;
  readonly onFilterChange: (value: TimelineFilterValue) => void;
}

export default function TimelineFilter({ title, filters, activeFilter, onFilterChange }: TimelineFilterProps) {
  return (
    <section aria-label={title}>
      <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">{title}</p>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition ${
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
