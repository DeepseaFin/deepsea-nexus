import type { ActivityViewModel } from "@/lib/activity/application/ActivityViewModel";
import { createActivityFeedPresenter, type ActivityFeedPresenter } from "@/lib/activity/presentation/ActivityFeedPresenter";
import type {
  ActivityFilterCollectionPresentationModel,
  ActivityFilterOptionPresentationModel,
  ActivityFilterPresentationModel,
  ActivityGroupPresentationModel,
  ActivityPresentationFormatOptions,
} from "@/lib/activity/presentation/ActivityPresentationModel";

export interface ActivityFilterPresenter {
  present(viewModel: ActivityViewModel, options?: ActivityPresentationFormatOptions): ActivityFilterPresentationModel;
}

export interface ActivityFilterPresenterDependencies {
  readonly feedPresenter: ActivityFeedPresenter;
}

interface CounterMaps {
  readonly types: Map<string, number>;
  readonly severities: Map<string, number>;
  readonly modules: Map<string, number>;
  readonly sources: Map<string, number>;
  readonly acknowledgement: Map<string, number>;
}

function pushCount(counter: Map<string, number>, key: string): void {
  counter.set(key, (counter.get(key) ?? 0) + 1);
}

function toOptionList(counter: Map<string, number>): readonly ActivityFilterOptionPresentationModel[] {
  return [...counter.entries()]
    .map(([value, count]) => ({
      value,
      label: value,
      count,
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

function buildCounters(viewModel: ActivityViewModel): CounterMaps {
  const types = new Map<string, number>();
  const severities = new Map<string, number>();
  const modules = new Map<string, number>();
  const sources = new Map<string, number>();
  const acknowledgement = new Map<string, number>();

  for (const item of viewModel.activities) {
    pushCount(types, item.typeLabel);
    pushCount(severities, item.severityLabel);
    pushCount(modules, item.module);
    pushCount(sources, item.source);
    pushCount(acknowledgement, item.acknowledged ? "Acknowledged" : "Unacknowledged");
  }

  return {
    types,
    severities,
    modules,
    sources,
    acknowledgement,
  };
}

function optionsFromCounters(counters: CounterMaps): ActivityFilterCollectionPresentationModel {
  return {
    types: toOptionList(counters.types),
    severities: toOptionList(counters.severities),
    modules: toOptionList(counters.modules),
    sources: toOptionList(counters.sources),
    acknowledgement: toOptionList(counters.acknowledgement),
  };
}

function groupItems(
  viewModel: ActivityViewModel,
  options: ActivityPresentationFormatOptions | undefined,
  feedPresenter: ActivityFeedPresenter,
): readonly ActivityGroupPresentationModel[] {
  return viewModel.groups.map((group) => ({
    groupKey: group.groupKey,
    groupLabel: group.groupLabel,
    countLabel: `${group.total} item(s)`,
    items: feedPresenter.present(
      {
        ...viewModel,
        feed: group.items.map((item, index) => ({
          ...item,
          relativeOrder: index,
        })),
      },
      options,
    ),
  }));
}

export function createActivityFilterPresenter(
  dependencies: ActivityFilterPresenterDependencies = {
    feedPresenter: createActivityFeedPresenter(),
  },
): ActivityFilterPresenter {
  return {
    present(viewModel: ActivityViewModel, options?: ActivityPresentationFormatOptions): ActivityFilterPresentationModel {
      const counters = buildCounters(viewModel);

      return {
        options: optionsFromCounters(counters),
        groups: groupItems(viewModel, options, dependencies.feedPresenter),
      };
    },
  };
}
