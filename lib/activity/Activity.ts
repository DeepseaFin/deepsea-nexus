import type { ActivityActor } from "@/lib/activity/ActivityActor";
import type { ActivityContext } from "@/lib/activity/ActivityContext";
import type { ActivityMetadata } from "@/lib/activity/ActivityMetadata";
import { ActivitySeverity } from "@/lib/activity/ActivitySeverity";
import type { ActivityTarget } from "@/lib/activity/ActivityTarget";
import { ActivityType } from "@/lib/activity/ActivityType";
import type { ActivityId, ActivityRevision, ActivityTimestamp } from "@/lib/activity/types";

export interface Activity {
  readonly activityId: ActivityId;
  readonly type: ActivityType;
  readonly severity: ActivitySeverity;
  readonly actor: ActivityActor;
  readonly target: ActivityTarget;
  readonly context: ActivityContext;
  readonly metadata: ActivityMetadata;
  readonly occurredAt: ActivityTimestamp;
  readonly createdAt: ActivityTimestamp;
  readonly updatedAt: ActivityTimestamp;
  readonly revision: ActivityRevision;
  readonly acknowledged: boolean;
  readonly acknowledgedAt?: ActivityTimestamp;
  readonly acknowledgedBy?: string;
}

export interface ActivityInput {
  readonly activityId: ActivityId;
  readonly type: ActivityType;
  readonly severity?: ActivitySeverity;
  readonly actor: ActivityActor;
  readonly target: ActivityTarget;
  readonly context: ActivityContext;
  readonly metadata: ActivityMetadata;
  readonly occurredAt?: ActivityTimestamp;
  readonly createdAt?: ActivityTimestamp;
  readonly updatedAt?: ActivityTimestamp;
  readonly revision?: ActivityRevision;
  readonly acknowledged?: boolean;
  readonly acknowledgedAt?: ActivityTimestamp;
  readonly acknowledgedBy?: string;
}

function nowTimestamp(): ActivityTimestamp {
  return new Date().toISOString();
}

function copyTags(tags: readonly string[]): readonly string[] {
  return [...tags];
}

export function createActivity(input: ActivityInput): Activity {
  const occurredAt = input.occurredAt ?? input.actor.occurredAt ?? input.context.observedAt ?? nowTimestamp();
  const createdAt = input.createdAt ?? occurredAt;
  const updatedAt = input.updatedAt ?? createdAt;

  return {
    activityId: input.activityId,
    type: input.type,
    severity: input.severity ?? ActivitySeverity.Medium,
    actor: {
      ...input.actor,
    },
    target: {
      ...input.target,
    },
    context: {
      ...input.context,
      tags: copyTags(input.context.tags),
    },
    metadata: {
      ...input.metadata,
      tags: copyTags(input.metadata.tags),
    },
    occurredAt,
    createdAt,
    updatedAt,
    revision: input.revision ?? 0,
    acknowledged: input.acknowledged ?? false,
    acknowledgedAt: input.acknowledgedAt,
    acknowledgedBy: input.acknowledgedBy,
  };
}
