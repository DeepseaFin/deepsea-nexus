import type { WorkflowEvent } from "@/lib/workflows/WorkflowEvent";

export const TIMELINE_EVENT_TYPES = [
  "Customer Created",
  "Passport Updated",
  "Document Uploaded",
  "Document Verified",
  "Relationship Updated",
  "Approval Requested",
  "Approval Completed",
  "Funding Approved",
  "Funding Released",
] as const;

export type TimelineEventType = (typeof TIMELINE_EVENT_TYPES)[number];

export const TIMELINE_FILTERS = ["All", "Documents", "Relationship", "Approvals", "Funding", "AI"] as const;

export type TimelineFilterValue = (typeof TIMELINE_FILTERS)[number];

export interface InstitutionalTimelineEvent {
  readonly id: string;
  readonly eventType: TimelineEventType;
  readonly occurredAt: string;
  readonly title: string;
  readonly description: string;
  readonly actor?: string;
  readonly filter: Exclude<TimelineFilterValue, "All">;
  readonly sourceEvent?: WorkflowEvent;
}

export interface TimelineSummaryMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export interface TimelineConfig {
  readonly title: string;
  readonly subtitle: string;
  readonly filterTitle: string;
  readonly summaryTitle: string;
  readonly summarySubtitle: string;
  readonly timelineTitle: string;
  readonly timelineSubtitle: string;
  readonly filters: readonly TimelineFilterValue[];
}

export interface InstitutionalTimelineModel {
  readonly summary: readonly TimelineSummaryMetric[];
  readonly events: readonly InstitutionalTimelineEvent[];
}
