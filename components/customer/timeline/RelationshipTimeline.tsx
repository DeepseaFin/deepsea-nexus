"use client";

import { useMemo, useState } from "react";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import TimelineDateGroup, { type TimelineDateGroupItem } from "@/components/customer/timeline/TimelineDateGroup";
import TimelineFilters, {
  type TimelineDateRangeFilter,
  type TimelineFiltersValue,
} from "@/components/customer/timeline/TimelineFilters";
import type {
  RelationshipTimelineEventType,
  RelationshipTimelineEventViewModel,
  RelationshipTimelineViewModel,
} from "@/lib/customer/RelationshipTimelineViewModel";

export interface RelationshipTimelineProps {
  readonly timeline?: RelationshipTimelineViewModel;
  readonly isLoading?: boolean;
  readonly error?: string;
}

type TimelineDomain = "corporate" | "financial" | "trade" | "compliance" | "operations";

interface EnrichedTimelineEvent {
  readonly event: RelationshipTimelineEventViewModel;
  readonly businessDomain: TimelineDomain;
  readonly relatedDocument?: string;
  readonly relatedEvidence?: string;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function toDateRangeDays(range: TimelineDateRangeFilter): number | null {
  if (range === "7d") {
    return 7;
  }

  if (range === "30d") {
    return 30;
  }

  if (range === "90d") {
    return 90;
  }

  return null;
}

function inferBusinessDomain(event: RelationshipTimelineEventViewModel): TimelineDomain {
  const text = normalize(`${event.title} ${event.description}`);

  if (text.includes("compliance") || text.includes("aml") || text.includes("kyc") || text.includes("sanction")) {
    return "compliance";
  }

  if (text.includes("financial") || text.includes("bank") || text.includes("turnover") || text.includes("revenue")) {
    return "financial";
  }

  if (
    text.includes("trade") ||
    text.includes("invoice") ||
    text.includes("shipment") ||
    text.includes("bill of lading") ||
    text.includes("packing list")
  ) {
    return "trade";
  }

  if (event.type === "customer-created" || event.type === "business-passport-updated" || event.type === "knowledge-generated") {
    return "corporate";
  }

  return "operations";
}

function inferRelatedDocument(event: RelationshipTimelineEventViewModel): string | undefined {
  if (event.type !== "document-received" && event.type !== "document-processed") {
    return undefined;
  }

  const documentPart = event.description.split(" received.")[0]?.split(" processed.")[0]?.trim();
  if (documentPart && documentPart.length > 0) {
    return documentPart;
  }

  return event.id.includes("document") ? event.id : undefined;
}

function inferRelatedEvidence(event: RelationshipTimelineEventViewModel): string | undefined {
  if (event.type !== "evidence-generated") {
    return undefined;
  }

  return event.id.includes("event-evidence-") ? event.id.replace("event-evidence-", "") : "evidence-generated";
}

function toDateLabel(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

function filterByDateRange(events: readonly EnrichedTimelineEvent[], range: TimelineDateRangeFilter): readonly EnrichedTimelineEvent[] {
  const days = toDateRangeDays(range);
  if (!days) {
    return events;
  }

  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
  return events.filter((entry) => {
    const eventTime = Date.parse(entry.event.occurredAt);
    if (Number.isNaN(eventTime)) {
      return false;
    }

    return eventTime >= threshold;
  });
}

export default function RelationshipTimeline({ timeline, isLoading = false, error }: RelationshipTimelineProps) {
  const resolvedTimeline: RelationshipTimelineViewModel = timeline ?? {
    generatedAt: "",
    customerId: undefined,
    events: [],
  };

  const [filters, setFilters] = useState<TimelineFiltersValue>({
    eventType: "all",
    dateRange: "all",
    businessDomain: "all",
  });

  const allTypes = useMemo<readonly RelationshipTimelineEventType[]>(() => {
    return [...new Set(resolvedTimeline.events.map((event) => event.type))];
  }, [resolvedTimeline.events]);

  const enriched = useMemo<readonly EnrichedTimelineEvent[]>(() => {
    return resolvedTimeline.events
      .map((event) => ({
        event,
        businessDomain: inferBusinessDomain(event),
        relatedDocument: inferRelatedDocument(event),
        relatedEvidence: inferRelatedEvidence(event),
      }))
      .sort((left, right) => Date.parse(right.event.occurredAt) - Date.parse(left.event.occurredAt));
  }, [resolvedTimeline.events]);

  const filtered = useMemo(() => {
    const byType = filters.eventType === "all"
      ? enriched
      : enriched.filter((entry) => entry.event.type === filters.eventType);

    const byDomain = filters.businessDomain === "all"
      ? byType
      : byType.filter((entry) => entry.businessDomain === filters.businessDomain);

    return filterByDateRange(byDomain, filters.dateRange);
  }, [enriched, filters.businessDomain, filters.dateRange, filters.eventType]);

  const grouped = useMemo(() => {
    const map = new Map<string, TimelineDateGroupItem[]>();

    for (const entry of filtered) {
      const label = toDateLabel(entry.event.occurredAt);
      const current = map.get(label) ?? [];
      current.push(entry);
      map.set(label, current);
    }

    return [...map.entries()].map(([dateLabel, items]) => ({
      dateLabel,
      items,
    }));
  }, [filtered]);

  if (isLoading) {
    return <PanelLoadingState title="Relationship Timeline" subtitle="Loading timeline events" />;
  }

  if (error) {
    return <PanelErrorState title="Relationship Timeline" subtitle="Unable to render timeline" message={error} />;
  }

  if (!timeline) {
    return (
      <SectionCard title="Relationship Timeline" subtitle="No timeline is currently available">
        <PanelEmptyState message="Timeline data is not available in this workspace." />
      </SectionCard>
    );
  }

  return (
    <div className="space-y-5">
      <SectionCard
        title="Relationship Timeline"
        subtitle="Chronological relationship history with presentation-level filtering"
      >
        <TimelineFilters availableEventTypes={allTypes} value={filters} onChange={setFilters} />
      </SectionCard>

      <SectionCard
        title="Timeline History"
        subtitle={`${filtered.length} events across ${grouped.length} date group(s)`}
      >
        <div className="space-y-5">
          {grouped.map((group) => (
            <TimelineDateGroup key={group.dateLabel} dateLabel={group.dateLabel} items={group.items} />
          ))}

          {grouped.length === 0 ? (
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
              <PanelEmptyState message="No timeline events match the selected filters." />
            </div>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
