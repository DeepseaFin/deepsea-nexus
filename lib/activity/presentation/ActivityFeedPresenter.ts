import type { ActivityViewModel } from "@/lib/activity/application/ActivityViewModel";
import type {
  ActivityFeedPresentationModel,
  ActivityPresentationActorModel,
  ActivityPresentationFormatOptions,
  ActivityPresentationTargetModel,
} from "@/lib/activity/presentation/ActivityPresentationModel";

export interface ActivityFeedPresenter {
  present(viewModel: ActivityViewModel, options?: ActivityPresentationFormatOptions): readonly ActivityFeedPresentationModel[];
}

function formatTimestamp(value: string, options?: ActivityPresentationFormatOptions): string {
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

function severityTone(severity: string): "neutral" | "info" | "success" | "warning" | "danger" {
  if (severity === "critical") {
    return "danger";
  }

  if (severity === "high") {
    return "warning";
  }

  if (severity === "medium") {
    return "info";
  }

  if (severity === "low") {
    return "success";
  }

  return "neutral";
}

function actorModel(item: ActivityViewModel["feed"][number]): ActivityPresentationActorModel {
  return {
    actorId: item.actor.actorId,
    actorTypeLabel: item.actor.actorTypeLabel,
    displayName: item.actor.displayName,
    institutionId: item.actor.institutionId,
  };
}

function targetModel(item: ActivityViewModel["feed"][number]): ActivityPresentationTargetModel {
  return {
    targetId: item.target.targetId,
    targetTypeLabel: item.target.targetTypeLabel,
    targetLabel: item.target.targetLabel ?? item.target.targetId,
    externalRef: item.target.externalRef,
  };
}

function mapFeedItem(
  item: ActivityViewModel["feed"][number],
  options?: ActivityPresentationFormatOptions,
): ActivityFeedPresentationModel {
  return {
    activityId: item.activityId,
    typeLabel: item.typeLabel,
    severityLabel: item.severityLabel,
    severityTone: severityTone(item.severity),
    actor: actorModel(item),
    target: targetModel(item),
    title: item.title,
    description: item.description,
    moduleLabel: item.module,
    sourceLabel: item.source,
    channelLabel: item.channel,
    tags: [...item.tags],
    occurredAtIso: item.occurredAt,
    occurredAtDisplay: formatTimestamp(item.occurredAt, options),
    acknowledgedLabel: item.acknowledged ? "Acknowledged" : "Unacknowledged",
    relativeOrder: item.relativeOrder,
  };
}

export function createActivityFeedPresenter(): ActivityFeedPresenter {
  return {
    present(viewModel: ActivityViewModel, options?: ActivityPresentationFormatOptions): readonly ActivityFeedPresentationModel[] {
      return viewModel.feed.map((item) => mapFeedItem(item, options));
    },
  };
}
