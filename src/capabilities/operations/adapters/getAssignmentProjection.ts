import type { Assignment } from "@/lib/operations/assignment/Assignment";
import type {
  AssignmentProjection,
  AssignmentProjectionSummaryMetadata,
} from "@/src/capabilities/operations/projections/AssignmentProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(assignment: Assignment): AssignmentProjectionSummaryMetadata {
  return {
    sourceSystem: assignment.metadata.sourceSystem ?? "Unknown source",
    sourceReference: assignment.metadata.sourceReference ?? "Unavailable reference",
    tags: assignment.metadata.tags ?? [],
    attributeCount: Object.keys(assignment.metadata.attributes ?? {}).length,
  };
}

export function getAssignmentProjection(assignment: Assignment): AssignmentProjection {
  return {
    assignmentId: assignment.assignmentId.toString(),
    operationId: assignment.operationId.toString(),
    taskId: assignment.taskId?.toString(),
    assigneeId: assignment.assigneeId,
    assigneeName: assignment.assigneeName,
    assignmentType: assignment.assignmentType,
    status: assignment.status,
    assignedAt: formatTimestamp(assignment.assignedAt),
    completedAt: assignment.completedAt ? formatTimestamp(assignment.completedAt) : undefined,
    summaryMetadata: toSummaryMetadata(assignment),
  };
}