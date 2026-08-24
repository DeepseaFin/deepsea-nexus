import { ACTIVITY_SEVERITY_LABELS, ACTIVITY_TYPE_LABELS } from "@/lib/activity/constants";
import type { Activity } from "@/lib/activity/Activity";
import type { ActivityFeedItemViewModel } from "@/lib/activity/application/ActivityViewModel";

export interface ActivityFeedAssembler {
  assemble(activities: readonly Activity[], limit?: number): readonly ActivityFeedItemViewModel[];
}

function toLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (fragment) => fragment.toUpperCase());
}

function compareByOccurredAtDesc(left: Activity, right: Activity): number {
  const leftAt = Date.parse(left.occurredAt);
  const rightAt = Date.parse(right.occurredAt);

  if (Number.isNaN(leftAt) || Number.isNaN(rightAt)) {
    return right.activityId.localeCompare(left.activityId);
  }

  return rightAt - leftAt;
}

export function createActivityFeedAssembler(): ActivityFeedAssembler {
  return {
    assemble(activities: readonly Activity[], limit?: number): readonly ActivityFeedItemViewModel[] {
      const sorted = [...activities].sort(compareByOccurredAtDesc);
      const sliced = typeof limit === "number" && limit > 0 ? sorted.slice(0, limit) : sorted;

      return sliced.map((activity, index) => ({
        activityId: activity.activityId,
        type: activity.type,
        typeLabel: ACTIVITY_TYPE_LABELS[activity.type],
        severity: activity.severity,
        severityLabel: ACTIVITY_SEVERITY_LABELS[activity.severity],
        actor: {
          actorId: activity.actor.actorId,
          actorType: activity.actor.actorType,
          actorTypeLabel: toLabel(activity.actor.actorType),
          displayName: activity.actor.displayName,
          institutionId: activity.actor.institutionId,
        },
        target: {
          targetId: activity.target.targetId,
          targetType: activity.target.targetType,
          targetTypeLabel: toLabel(activity.target.targetType),
          targetLabel: activity.target.targetLabel,
          externalRef: activity.target.externalRef,
        },
        title: activity.metadata.title,
        description: activity.metadata.description,
        module: activity.context.module,
        source: activity.context.source,
        channel: activity.context.channel,
        tags: [...activity.context.tags],
        occurredAt: activity.occurredAt,
        acknowledged: activity.acknowledged,
        acknowledgedAt: activity.acknowledgedAt,
        acknowledgedBy: activity.acknowledgedBy,
        relativeOrder: index,
      }));
    },
  };
}
