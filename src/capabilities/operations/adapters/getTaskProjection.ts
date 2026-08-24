import type { Task } from "@/lib/operations/task/Task";
import type {
  TaskProjection,
  TaskProjectionSummaryMetadata,
} from "@/src/capabilities/operations/projections/TaskProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(task: Task): TaskProjectionSummaryMetadata {
  return {
    sourceSystem: task.metadata.sourceSystem ?? "Unknown source",
    sourceReference: task.metadata.sourceReference ?? "Unavailable reference",
    tags: task.metadata.tags ?? [],
    attributeCount: Object.keys(task.metadata.attributes ?? {}).length,
  };
}

export function getTaskProjection(task: Task): TaskProjection {
  return {
    taskId: task.taskId.toString(),
    operationId: task.operationId.toString(),
    taskName: task.taskName,
    description: task.description,
    taskType: task.taskType,
    status: task.status,
    priority: task.priority,
    assignedTo: task.assignedTo,
    dueDate: formatTimestamp(task.dueDate),
    createdDate: formatTimestamp(task.createdAt),
    updatedDate: formatTimestamp(task.updatedAt),
    summaryMetadata: toSummaryMetadata(task),
  };
}