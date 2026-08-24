import type { PassportTimelineItem } from "@/src/capabilities/institution-wizard/types/PassportTimelineItem";

export interface PassportTimeline {
  readonly items: readonly PassportTimelineItem[];
}