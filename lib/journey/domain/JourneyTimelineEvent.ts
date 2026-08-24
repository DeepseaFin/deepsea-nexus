export interface JourneyTimelineEvent {
  readonly timestamp: string;
  readonly event: string;
  readonly performedBy: string;
  readonly notes: string;
}