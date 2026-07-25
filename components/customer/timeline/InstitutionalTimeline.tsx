"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
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
import type { InstitutionalTimelinePresentationViewModel } from "@/lib/presentation/presenters/InstitutionalTimelinePresenter";

export interface InstitutionalTimelineProps {
  readonly config?: TimelineConfig;
  readonly viewModel?: InstitutionalTimelinePresentationViewModel;
  readonly model?: InstitutionalTimelineModel;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export default function InstitutionalTimeline({
  config = institutionalTimelineConfig,
  viewModel,
  model = defaultInstitutionalTimelineModel,
  isLoading = false,
  error,
}: InstitutionalTimelineProps) {
  const [activeFilter, setActiveFilter] = useState<TimelineFilterValue>("All");
  const presentationModel = viewModel?.payload.panelModel ?? model;

  const visibleEvents = useMemo(() => {
    if (activeFilter === "All") {
      return presentationModel.events;
    }

    return presentationModel.events.filter((event) => event.filter === activeFilter);
  }, [activeFilter, presentationModel.events]);

  if (isLoading) {
    return <PanelLoadingState title={config.title} subtitle={config.subtitle} />;
  }

  if (error) {
    return <PanelErrorState title={config.title} subtitle={config.subtitle} message={error} />;
  }

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

      <TimelineSummary title={config.summaryTitle} subtitle={config.summarySubtitle} metrics={presentationModel.summary} />

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

            {visibleEvents.length === 0 ? <PanelEmptyState asListItem message="No events for the selected filter." /> : null}
          </motion.ol>
        </AnimatePresence>
      </SectionCard>
    </div>
  );
}
