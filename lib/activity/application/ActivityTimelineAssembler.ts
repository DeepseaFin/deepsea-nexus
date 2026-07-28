import { ACTIVITY_SEVERITY_LABELS, ACTIVITY_TYPE_LABELS } from "@/lib/activity/constants";
import type { Activity } from "@/lib/activity/Activity";
import type {
  ActivityTimelineEntryViewModel,
  ActivityTimelineGroupViewModel,
} from "@/lib/activity/application/ActivityViewModel";

export interface ActivityTimelineAssembler {
  assemble(activities: readonly Activity[]): readonly ActivityTimelineGroupViewModel[];
}

function toLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (fragment) => fragment.toUpperCase());
}

function formatDayLabel(isoDate: string): string {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) {
    return isoDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "UTC",
  }).format(new Date(parsed));
}

function dayKey(occurredAt: string): string {
  const parsed = Date.parse(occurredAt);
  if (Number.isNaN(parsed)) {
    return occurredAt.slice(0, 10);
  }

  return new Date(parsed).toISOString().slice(0, 10);
}

function compareByOccurredAtAsc(left: Activity, right: Activity): number {
  const leftAt = Date.parse(left.occurredAt);
  const rightAt = Date.parse(right.occurredAt);

  if (Number.isNaN(leftAt) || Number.isNaN(rightAt)) {
    return left.activityId.localeCompare(right.activityId);
  }

  return leftAt - rightAt;
}

function toTimelineEntry(activity: Activity): ActivityTimelineEntryViewModel {
  const key = dayKey(activity.occurredAt);

  return {
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
    dayKey: key,
    dayLabel: formatDayLabel(key),
  };
}

export function createActivityTimelineAssembler(): ActivityTimelineAssembler {
  return {
    assemble(activities: readonly Activity[]): readonly ActivityTimelineGroupViewModel[] {
      const sorted = [...activities].sort(compareByOccurredAtAsc);
      const groups = new Map<string, ActivityTimelineEntryViewModel[]>();

      for (const activity of sorted) {
        const entry = toTimelineEntry(activity);
        const existing = groups.get(entry.dayKey);

        if (existing) {
          existing.push(entry);
          continue;
        }

        groups.set(entry.dayKey, [entry]);
      }

      return [...groups.entries()]
        .map(([key, entries]) => ({
          dayKey: key,
          dayLabel: formatDayLabel(key),
          entries,
        }))
        .sort((left, right) => left.dayKey.localeCompare(right.dayKey));
    },
  };
}
