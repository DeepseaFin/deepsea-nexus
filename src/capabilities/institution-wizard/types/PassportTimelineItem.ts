import type { PassportTimelineEvent } from "@/src/capabilities/institution-wizard/types/PassportTimelineEvent";

export interface PassportTimelineItem {
  readonly timestamp: string;
  readonly event: PassportTimelineEvent;
  readonly detail: string;
}