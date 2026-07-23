import type { Operation } from "@/lib/operations/Operation";
import type { Assignment } from "@/lib/operations/assignment/Assignment";
import type { Task } from "@/lib/operations/task/Task";
import type { TimelineEvent } from "@/lib/operations/timeline/TimelineEvent";
import { getOperationProjection } from "@/src/capabilities/operations/adapters/getOperationProjection";
import { getAssignmentProjection } from "@/src/capabilities/operations/adapters/getAssignmentProjection";
import { getTaskProjection } from "@/src/capabilities/operations/adapters/getTaskProjection";
import { getTimelineEventProjection } from "@/src/capabilities/operations/adapters/getTimelineEventProjection";
import type { OperationsWorkspaceProjection } from "@/src/capabilities/operations/projections/OperationsWorkspaceProjection";

export function getOperationsWorkspaceProjection(
  operation: Operation,
  tasks: readonly Task[],
  assignments: readonly Assignment[],
  timelineEvents: readonly TimelineEvent[],
): OperationsWorkspaceProjection {
  return {
    operation: getOperationProjection(operation),
    tasks: tasks.map(getTaskProjection),
    assignments: assignments.map(getAssignmentProjection),
    timeline: timelineEvents.map(getTimelineEventProjection),
  };
}