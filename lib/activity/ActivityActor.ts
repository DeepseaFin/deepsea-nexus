import type { ActivityAttributes, ActivityActorId, ActivityLabel, ActivityTimestamp } from "@/lib/activity/types";

export enum ActivityActorType {
  User = "user",
  Team = "team",
  Role = "role",
  Institution = "institution",
  System = "system",
}

export interface ActivityActor {
  readonly actorId: ActivityActorId;
  readonly actorType: ActivityActorType;
  readonly displayName: ActivityLabel;
  readonly institutionId?: string;
  readonly occurredAt: ActivityTimestamp;
  readonly metadata?: ActivityAttributes;
}
