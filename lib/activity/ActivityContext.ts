import type { ActivityAttributes, ActivityTag, ActivityTimestamp } from "@/lib/activity/types";

export interface ActivityContext {
  readonly institutionId: string;
  readonly businessId?: string;
  readonly relationshipId?: string;
  readonly workflowId?: string;
  readonly module: string;
  readonly source: string;
  readonly channel?: string;
  readonly correlationId?: string;
  readonly tags: readonly ActivityTag[];
  readonly observedAt: ActivityTimestamp;
  readonly metadata?: ActivityAttributes;
}
