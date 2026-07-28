import type { WorkflowTaskViewModel, WorkflowViewModel } from "@/lib/workflow/application/WorkflowViewModel";
import type { WorkflowPresentationFormatOptions, WorkflowTaskPresentationModel } from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowTaskPresenter {
  present(viewModel: WorkflowViewModel, options?: WorkflowPresentationFormatOptions): readonly WorkflowTaskPresentationModel[];
}

function formatTimestamp(value: string | undefined, options?: WorkflowPresentationFormatOptions): string | undefined {
  if (!value) {
    return undefined;
  }

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

function statusTone(status: WorkflowTaskViewModel["status"]): "neutral" | "info" | "success" | "warning" | "danger" {
  if (status === "completed") {
    return "success";
  }

  if (status === "cancelled") {
    return "danger";
  }

  if (status === "blocked") {
    return "warning";
  }

  if (status === "in_progress") {
    return "info";
  }

  return "neutral";
}

function priorityTone(priority: WorkflowTaskViewModel["priority"]): "neutral" | "info" | "success" | "warning" | "danger" {
  if (priority === "critical") {
    return "danger";
  }

  if (priority === "high") {
    return "warning";
  }

  if (priority === "medium") {
    return "info";
  }

  if (priority === "low") {
    return "success";
  }

  return "neutral";
}

function mapTask(task: WorkflowTaskViewModel, options?: WorkflowPresentationFormatOptions): WorkflowTaskPresentationModel {
  return {
    taskId: task.taskId,
    title: task.title,
    description: task.description,
    stageLabel: task.stageLabel,
    statusLabel: task.statusLabel,
    statusTone: statusTone(task.status),
    priorityLabel: task.priorityLabel,
    priorityTone: priorityTone(task.priority),
    assignmentLabel: task.assignmentOwnerName ?? "Unassigned",
    dueAtIso: task.dueAt,
    dueAtDisplay: formatTimestamp(task.dueAt, options),
    startedAtIso: task.startedAt,
    startedAtDisplay: formatTimestamp(task.startedAt, options),
    completedAtIso: task.completedAt,
    completedAtDisplay: formatTimestamp(task.completedAt, options),
  };
}

export function createWorkflowTaskPresenter(): WorkflowTaskPresenter {
  return {
    present(viewModel: WorkflowViewModel, options?: WorkflowPresentationFormatOptions): readonly WorkflowTaskPresentationModel[] {
      return viewModel.tasks.map((task) => mapTask(task, options));
    },
  };
}
