import type { ActivityViewModel } from "@/lib/activity/application/ActivityViewModel";
import type {
  ActivityPresentationFormatOptions,
  ActivityTimelineEntryPresentationModel,
  ActivityTimelineGroupPresentationModel,
} from "@/lib/activity/presentation/ActivityPresentationModel";

export interface ActivityTimelinePresenter {
  present(viewModel: ActivityViewModel, options?: ActivityPresentationFormatOptions): readonly ActivityTimelineGroupPresentationModel[];
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

function toEntry(
  entry: ActivityViewModel["timeline"][number]["entries"][number],
  options?: ActivityPresentationFormatOptions,
): ActivityTimelineEntryPresentationModel {
  return {
    activityId: entry.activityId,
    title: entry.title,
    description: entry.description,
    typeLabel: entry.typeLabel,
    severityLabel: entry.severityLabel,
    severityTone: severityTone(entry.severity),
    actorLabel: entry.actor.displayName,
    targetLabel: entry.target.targetLabel ?? entry.target.targetId,
    occurredAtIso: entry.occurredAt,
    occurredAtDisplay: formatTimestamp(entry.occurredAt, options),
    moduleLabel: entry.module,
    sourceLabel: entry.source,
  };
}

function toGroup(
  group: ActivityViewModel["timeline"][number],
  options?: ActivityPresentationFormatOptions,
): ActivityTimelineGroupPresentationModel {
  return {
    dayKey: group.dayKey,
    dayLabel: group.dayLabel,
    countLabel: `${group.entries.length} item(s)`,
    entries: group.entries.map((entry) => toEntry(entry, options)),
  };
}

export function createActivityTimelinePresenter(): ActivityTimelinePresenter {
  return {
    present(viewModel: ActivityViewModel, options?: ActivityPresentationFormatOptions): readonly ActivityTimelineGroupPresentationModel[] {
      return viewModel.timeline.map((group) => toGroup(group, options));
    },
  };
}
