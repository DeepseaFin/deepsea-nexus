"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionCard from "@/components/ui/SectionCard";
import TimelineEvent from "@/components/customer/timeline/TimelineEvent";
import TimelineFilter from "@/components/customer/timeline/TimelineFilter";
import TimelineSummary from "@/components/customer/timeline/TimelineSummary";
import {
  defaultInstitutionalTimelineModel,
  institutionalTimelineConfig,
} from "@/lib/customer/timeline/timeline.config";
import type {
  InstitutionalTimelineModel,
  TimelineConfig,
  TimelineFilterValue,
} from "@/lib/customer/timeline/timeline.types";

export interface InstitutionalTimelineProps {
  readonly config?: TimelineConfig;
  readonly model?: InstitutionalTimelineModel;
}

export default function InstitutionalTimeline({
  config = institutionalTimelineConfig,
  model = defaultInstitutionalTimelineModel,
}: InstitutionalTimelineProps) {
  const [activeFilter, setActiveFilter] = useState<TimelineFilterValue>("All");

  const visibleEvents = useMemo(() => {
    if (activeFilter === "All") {
      return model.events;
    }

    return model.events.filter((event) => event.filter === activeFilter);
  }, [activeFilter, model.events]);

  return (
    <div className="space-y-4">
      <SectionCard title={config.title} subtitle={config.subtitle}>
        <TimelineFilter
          title={config.filterTitle}
          filters={config.filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </SectionCard>

      <TimelineSummary title={config.summaryTitle} subtitle={config.summarySubtitle} metrics={model.summary} />

      <SectionCard title={config.timelineTitle} subtitle={config.timelineSubtitle}>
        <AnimatePresence mode="wait">
          <motion.ol
            key={activeFilter}
            className="space-y-2.5"
            aria-label="Institutional timeline"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {visibleEvents.map((event) => (
              <TimelineEvent key={event.id} event={event} />
            ))}

            {visibleEvents.length === 0 ? (
              <li className="text-sm text-slate-400">No events for the selected filter.</li>
            ) : null}
          </motion.ol>
        </AnimatePresence>
      </SectionCard>
    </div>
  );
}
