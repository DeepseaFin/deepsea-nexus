import type { WorkflowTimelineEntryViewModel, WorkflowViewModel } from "@/lib/workflow/application/WorkflowViewModel";
import type {
  WorkflowPresentationFormatOptions,
  WorkflowTimelinePresentationModel,
} from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowTimelinePresenter {
  present(viewModel: WorkflowViewModel, options?: WorkflowPresentationFormatOptions): readonly WorkflowTimelinePresentationModel[];
}

function formatTimestamp(value: string, options?: WorkflowPresentationFormatOptions): string {
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

function stageChangeLabel(entry: WorkflowTimelineEntryViewModel): string | undefined {
  if (!entry.fromStageLabel && !entry.toStageLabel) {
    return undefined;
  }

  const fromLabel = entry.fromStageLabel ?? "Unknown";
  const toLabel = entry.toStageLabel ?? "Unknown";
  return `${fromLabel} -> ${toLabel}`;
}

function actorLabel(entry: WorkflowTimelineEntryViewModel): string {
  return entry.actorId ? `Actor ${entry.actorId}` : "System";
}

function mapTimelineEntry(
  entry: WorkflowTimelineEntryViewModel,
  options?: WorkflowPresentationFormatOptions,
): WorkflowTimelinePresentationModel {
  return {
    eventId: entry.eventId,
    typeLabel: entry.typeLabel,
    occurredAtIso: entry.occurredAt,
    occurredAtDisplay: formatTimestamp(entry.occurredAt, options),
    actorLabel: actorLabel(entry),
    message: entry.message ?? entry.typeLabel,
    stageChangeLabel: stageChangeLabel(entry),
    taskId: entry.taskId,
    milestoneId: entry.milestoneId,
    assignmentId: entry.assignmentId,
  };
}

export function createWorkflowTimelinePresenter(): WorkflowTimelinePresenter {
  return {
    present(viewModel: WorkflowViewModel, options?: WorkflowPresentationFormatOptions): readonly WorkflowTimelinePresentationModel[] {
      return viewModel.timeline.map((entry) => mapTimelineEntry(entry, options));
    },
  };
}
