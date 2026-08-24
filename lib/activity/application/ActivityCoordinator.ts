import type { Activity, ActivityInput } from "@/lib/activity/Activity";
import type { ActivityMetadata } from "@/lib/activity/ActivityMetadata";
import { ActivitySeverity } from "@/lib/activity/ActivitySeverity";
import { ActivityService } from "@/lib/activity/ActivityService";
import type {
  ActivityOperationResult,
  ActivityTimestamp,
  ActivityValidationResult,
} from "@/lib/activity/types";
import {
  createActivityAssembler,
  type ActivityAssembler,
  type ActivityAssemblerInput,
} from "@/lib/activity/application/ActivityAssembler";
import {
  createActivityFilterCoordinator,
  type ActivityFilterCoordinator,
  type ActivityFilterCriteria,
  type ActivityGroupBy,
} from "@/lib/activity/application/ActivityFilterCoordinator";
import type { ActivityViewModel } from "@/lib/activity/application/ActivityViewModel";

export interface ActivityCoordinatorDependencies {
  readonly assembler: ActivityAssembler;
  readonly filterCoordinator: ActivityFilterCoordinator;
}

export interface BuildActivityViewModelInput {
  readonly activities: readonly Activity[];
  readonly criteria?: ActivityFilterCriteria;
  readonly groupBy?: ActivityGroupBy;
  readonly feedLimit?: number;
  readonly generatedAt?: string;
}

export interface ActivityCoordinator {
  create(input: ActivityInput): ActivityOperationResult<Activity>;
  validate(activity: Activity): ActivityValidationResult;
  acknowledge(activity: Activity, acknowledgedBy: string, acknowledgedAt?: ActivityTimestamp): ActivityOperationResult<Activity>;
  escalateSeverity(activity: Activity, nextSeverity: ActivitySeverity, occurredAt?: ActivityTimestamp): ActivityOperationResult<Activity>;
  replaceMetadata(activity: Activity, metadata: ActivityMetadata, occurredAt?: ActivityTimestamp): ActivityOperationResult<Activity>;
  filter(activities: readonly Activity[], criteria?: ActivityFilterCriteria): readonly Activity[];
  buildViewModel(input: BuildActivityViewModelInput): ActivityViewModel;
}

export function createActivityCoordinator(
  dependencies: ActivityCoordinatorDependencies = {
    assembler: createActivityAssembler(),
    filterCoordinator: createActivityFilterCoordinator(),
  },
): ActivityCoordinator {
  return {
    create(input: ActivityInput): ActivityOperationResult<Activity> {
      return ActivityService.createActivity(input);
    },

    validate(activity: Activity): ActivityValidationResult {
      return ActivityService.validateActivity(activity);
    },

    acknowledge(
      activity: Activity,
      acknowledgedBy: string,
      acknowledgedAt?: ActivityTimestamp,
    ): ActivityOperationResult<Activity> {
      return ActivityService.acknowledge(activity, acknowledgedBy, acknowledgedAt);
    },

    escalateSeverity(
      activity: Activity,
      nextSeverity: ActivitySeverity,
      occurredAt?: ActivityTimestamp,
    ): ActivityOperationResult<Activity> {
      return ActivityService.escalateSeverity(activity, nextSeverity, occurredAt);
    },

    replaceMetadata(
      activity: Activity,
      metadata: ActivityMetadata,
      occurredAt?: ActivityTimestamp,
    ): ActivityOperationResult<Activity> {
      return ActivityService.replaceMetadata(activity, metadata, occurredAt);
    },

    filter(activities: readonly Activity[], criteria?: ActivityFilterCriteria): readonly Activity[] {
      return dependencies.filterCoordinator.filter(activities, criteria);
    },

    buildViewModel(input: BuildActivityViewModelInput): ActivityViewModel {
      const assemblerInput: ActivityAssemblerInput = {
        activities: input.activities,
        criteria: input.criteria,
        groupBy: input.groupBy,
        feedLimit: input.feedLimit,
        generatedAt: input.generatedAt,
      };

      return dependencies.assembler.assemble(assemblerInput);
    },
  };
}
