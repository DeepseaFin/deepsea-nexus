import type { ActivityViewModel } from "@/lib/activity/application/ActivityViewModel";
import {
  createActivityFeedPresenter,
  type ActivityFeedPresenter,
} from "@/lib/activity/presentation/ActivityFeedPresenter";
import {
  createActivityFilterPresenter,
  type ActivityFilterPresenter,
} from "@/lib/activity/presentation/ActivityFilterPresenter";
import type {
  ActivityPresentationFormatOptions,
  ActivityPresentationModel,
} from "@/lib/activity/presentation/ActivityPresentationModel";
import {
  createActivitySummaryPresenter,
  type ActivitySummaryPresenter,
} from "@/lib/activity/presentation/ActivitySummaryPresenter";
import {
  createActivityTimelinePresenter,
  type ActivityTimelinePresenter,
} from "@/lib/activity/presentation/ActivityTimelinePresenter";

export interface ActivityPresentationAssemblerDependencies {
  readonly feedPresenter: ActivityFeedPresenter;
  readonly summaryPresenter: ActivitySummaryPresenter;
  readonly timelinePresenter: ActivityTimelinePresenter;
  readonly filterPresenter: ActivityFilterPresenter;
}

export interface ActivityPresentationAssemblerInput {
  readonly viewModel: ActivityViewModel;
  readonly options?: ActivityPresentationFormatOptions;
}

export interface ActivityPresentationAssembler {
  assemble(input: ActivityPresentationAssemblerInput): ActivityPresentationModel;
}

function formatGeneratedAt(value: string, options?: ActivityPresentationFormatOptions): string {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Intl.DateTimeFormat(options?.locale ?? "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: options?.timeZone,
  }).format(new Date(parsed));
}

export function createActivityPresentationAssembler(
  dependencies: ActivityPresentationAssemblerDependencies = {
    feedPresenter: createActivityFeedPresenter(),
    summaryPresenter: createActivitySummaryPresenter(),
    timelinePresenter: createActivityTimelinePresenter(),
    filterPresenter: createActivityFilterPresenter(),
  },
): ActivityPresentationAssembler {
  return {
    assemble(input: ActivityPresentationAssemblerInput): ActivityPresentationModel {
      const viewModel = input.viewModel;
      const options = input.options;

      return {
        generatedAtIso: viewModel.generatedAt,
        generatedAtDisplay: formatGeneratedAt(viewModel.generatedAt, options),
        totalLabel: `${viewModel.total} activity item(s)`,
        feed: dependencies.feedPresenter.present(viewModel, options),
        summary: dependencies.summaryPresenter.present(viewModel, options),
        timeline: dependencies.timelinePresenter.present(viewModel, options),
        filters: dependencies.filterPresenter.present(viewModel, options),
        validationWarnings: viewModel.validationIssues.map((issue) => issue.message),
      };
    },
  };
}
