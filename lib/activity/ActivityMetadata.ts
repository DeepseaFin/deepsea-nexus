import type { ActivityAttributes, ActivityLabel, ActivityTag } from "@/lib/activity/types";

export interface ActivityMetadata {
  readonly title: ActivityLabel;
  readonly description?: string;
  readonly classification?: string;
  readonly tags: readonly ActivityTag[];
  readonly attributes?: ActivityAttributes;
}
