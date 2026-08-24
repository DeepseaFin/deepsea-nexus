import type { Activity } from "@/lib/activity/Activity";
import type { ActivityActorType } from "@/lib/activity/ActivityActor";
import type { ActivitySeverity } from "@/lib/activity/ActivitySeverity";
import type { ActivityTargetType } from "@/lib/activity/ActivityTarget";
import type { ActivityType } from "@/lib/activity/ActivityType";

export interface ActivityFilterCriteria {
  readonly types?: readonly ActivityType[];
  readonly severities?: readonly ActivitySeverity[];
  readonly actorTypes?: readonly ActivityActorType[];
  readonly targetTypes?: readonly ActivityTargetType[];
  readonly acknowledged?: boolean;
  readonly module?: string;
  readonly source?: string;
  readonly searchText?: string;
  readonly fromOccurredAt?: string;
  readonly toOccurredAt?: string;
  readonly tags?: readonly string[];
}

export type ActivityGroupBy = "type" | "severity" | "actorType" | "targetType" | "module" | "source";

export interface ActivityFilterGroup {
  readonly groupKey: string;
  readonly groupLabel: string;
  readonly activities: readonly Activity[];
}

export interface ActivityFilterCoordinator {
  filter(activities: readonly Activity[], criteria?: ActivityFilterCriteria): readonly Activity[];
  group(activities: readonly Activity[], groupBy: ActivityGroupBy): readonly ActivityFilterGroup[];
}

function toLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (fragment) => fragment.toUpperCase());
}

function containsSearchText(activity: Activity, searchText: string): boolean {
  const normalizedSearch = searchText.toLowerCase();
  const candidate = [
    activity.activityId,
    activity.metadata.title,
    activity.metadata.description ?? "",
    activity.actor.displayName,
    activity.target.targetLabel ?? "",
    activity.context.module,
    activity.context.source,
  ]
    .join(" ")
    .toLowerCase();

  return candidate.includes(normalizedSearch);
}

function inTimeRange(activity: Activity, fromOccurredAt?: string, toOccurredAt?: string): boolean {
  const occurredAt = Date.parse(activity.occurredAt);
  if (Number.isNaN(occurredAt)) {
    return true;
  }

  const from = fromOccurredAt ? Date.parse(fromOccurredAt) : Number.NEGATIVE_INFINITY;
  const to = toOccurredAt ? Date.parse(toOccurredAt) : Number.POSITIVE_INFINITY;

  return occurredAt >= from && occurredAt <= to;
}

function compareByOccurredAtDesc(left: Activity, right: Activity): number {
  const leftAt = Date.parse(left.occurredAt);
  const rightAt = Date.parse(right.occurredAt);

  if (Number.isNaN(leftAt) || Number.isNaN(rightAt)) {
    return right.activityId.localeCompare(left.activityId);
  }

  return rightAt - leftAt;
}

function groupLabel(activity: Activity, groupBy: ActivityGroupBy): string {
  if (groupBy === "module") {
    return activity.context.module;
  }

  if (groupBy === "source") {
    return activity.context.source;
  }

  if (groupBy === "type") {
    return toLabel(activity.type);
  }

  if (groupBy === "severity") {
    return toLabel(activity.severity);
  }

  if (groupBy === "actorType") {
    return toLabel(activity.actor.actorType);
  }

  return toLabel(activity.target.targetType);
}

function groupKey(activity: Activity, groupBy: ActivityGroupBy): string {
  if (groupBy === "module") {
    return activity.context.module;
  }

  if (groupBy === "source") {
    return activity.context.source;
  }

  if (groupBy === "type") {
    return activity.type;
  }

  if (groupBy === "severity") {
    return activity.severity;
  }

  if (groupBy === "actorType") {
    return activity.actor.actorType;
  }

  return activity.target.targetType;
}

export function createActivityFilterCoordinator(): ActivityFilterCoordinator {
  return {
    filter(activities: readonly Activity[], criteria?: ActivityFilterCriteria): readonly Activity[] {
      const filtered = activities.filter((activity) => {
        if (criteria?.types && criteria.types.length > 0 && !criteria.types.includes(activity.type)) {
          return false;
        }

        if (criteria?.severities && criteria.severities.length > 0 && !criteria.severities.includes(activity.severity)) {
          return false;
        }

        if (criteria?.actorTypes && criteria.actorTypes.length > 0 && !criteria.actorTypes.includes(activity.actor.actorType)) {
          return false;
        }

        if (criteria?.targetTypes && criteria.targetTypes.length > 0 && !criteria.targetTypes.includes(activity.target.targetType)) {
          return false;
        }

        if (typeof criteria?.acknowledged === "boolean" && criteria.acknowledged !== activity.acknowledged) {
          return false;
        }

        if (criteria?.module && criteria.module !== activity.context.module) {
          return false;
        }

        if (criteria?.source && criteria.source !== activity.context.source) {
          return false;
        }

        if (criteria?.searchText && !containsSearchText(activity, criteria.searchText)) {
          return false;
        }

        if (!inTimeRange(activity, criteria?.fromOccurredAt, criteria?.toOccurredAt)) {
          return false;
        }

        if (criteria?.tags && criteria.tags.length > 0) {
          const tagSet = new Set(activity.context.tags);
          const matchesTag = criteria.tags.some((tag) => tagSet.has(tag));
          if (!matchesTag) {
            return false;
          }
        }

        return true;
      });

      return [...filtered].sort(compareByOccurredAtDesc);
    },

    group(activities: readonly Activity[], groupBy: ActivityGroupBy): readonly ActivityFilterGroup[] {
      const grouped = new Map<string, Activity[]>();

      for (const activity of activities) {
        const key = groupKey(activity, groupBy);
        const existing = grouped.get(key);

        if (existing) {
          existing.push(activity);
          continue;
        }

        grouped.set(key, [activity]);
      }

      return [...grouped.entries()]
        .map(([key, groupedActivities]) => ({
          groupKey: key,
          groupLabel: groupedActivities.length > 0 ? groupLabel(groupedActivities[0], groupBy) : key,
          activities: [...groupedActivities].sort(compareByOccurredAtDesc),
        }))
        .sort((left, right) => left.groupLabel.localeCompare(right.groupLabel));
    },
  };
}
