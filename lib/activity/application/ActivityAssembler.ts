import { ACTIVITY_SEVERITY_LABELS, ACTIVITY_TYPE_LABELS } from "@/lib/activity/constants";
import type { Activity } from "@/lib/activity/Activity";
import { ActivityService } from "@/lib/activity/ActivityService";
import {
  createActivityFeedAssembler,
  type ActivityFeedAssembler,
} from "@/lib/activity/application/ActivityFeedAssembler";
import {
  createActivityFilterCoordinator,
  type ActivityFilterCoordinator,
  type ActivityFilterCriteria,
  type ActivityGroupBy,
} from "@/lib/activity/application/ActivityFilterCoordinator";
import {
  createActivitySummaryAssembler,
  type ActivitySummaryAssembler,
} from "@/lib/activity/application/ActivitySummaryAssembler";
import {
  createActivityTimelineAssembler,
  type ActivityTimelineAssembler,
} from "@/lib/activity/application/ActivityTimelineAssembler";
import type {
  ActivityGroupViewModel,
  ActivityItemViewModel,
  ActivityViewModel,
} from "@/lib/activity/application/ActivityViewModel";

export interface ActivityAssemblerDependencies {
  readonly feedAssembler: ActivityFeedAssembler;
  readonly summaryAssembler: ActivitySummaryAssembler;
  readonly timelineAssembler: ActivityTimelineAssembler;
  readonly filterCoordinator: ActivityFilterCoordinator;
}

export interface ActivityAssemblerInput {
  readonly activities: readonly Activity[];
  readonly criteria?: ActivityFilterCriteria;
  readonly groupBy?: ActivityGroupBy;
  readonly feedLimit?: number;
  readonly generatedAt?: string;
}

export interface ActivityAssembler {
  assemble(input: ActivityAssemblerInput): ActivityViewModel;
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

function toItemViewModel(activity: Activity): ActivityItemViewModel {
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
  };
}

function mapGroups(groups: readonly { groupKey: string; groupLabel: string; activities: readonly Activity[] }[]): readonly ActivityGroupViewModel[] {
  return groups.map((group) => ({
    groupKey: group.groupKey,
    groupLabel: group.groupLabel,
    total: group.activities.length,
    items: group.activities.map(toItemViewModel),
  }));
}

export function createActivityAssembler(
  dependencies: ActivityAssemblerDependencies = {
    feedAssembler: createActivityFeedAssembler(),
    summaryAssembler: createActivitySummaryAssembler(),
    timelineAssembler: createActivityTimelineAssembler(),
    filterCoordinator: createActivityFilterCoordinator(),
  },
): ActivityAssembler {
  return {
    assemble(input: ActivityAssemblerInput): ActivityViewModel {
      const generatedAt = input.generatedAt ?? new Date().toISOString();
      const filtered = dependencies.filterCoordinator.filter(input.activities, input.criteria);
      const sorted = [...filtered].sort(compareByOccurredAtDesc);
      const groups = input.groupBy ? dependencies.filterCoordinator.group(sorted, input.groupBy) : [];

      return {
        generatedAt,
        total: sorted.length,
        activities: sorted.map(toItemViewModel),
        feed: dependencies.feedAssembler.assemble(sorted, input.feedLimit),
        timeline: dependencies.timelineAssembler.assemble(sorted),
        summary: dependencies.summaryAssembler.assemble(sorted),
        groups: mapGroups(groups),
        validationIssues: sorted.flatMap((activity) => ActivityService.validateActivity(activity).issues),
      };
    },
  };
}
