import type { Operation } from "@/lib/operations/Operation";
import type { Task } from "@/lib/operations/task/Task";
import type { TimelineEvent } from "@/lib/operations/timeline/TimelineEvent";
import { getOperationProjection } from "@/src/capabilities/operations/adapters/getOperationProjection";
import { getTaskProjection } from "@/src/capabilities/operations/adapters/getTaskProjection";
import { getTimelineEventProjection } from "@/src/capabilities/operations/adapters/getTimelineEventProjection";
import type { OperationsWorkspaceProjection } from "@/src/capabilities/operations/projections/OperationsWorkspaceProjection";

export function getOperationsWorkspaceProjection(
  operation: Operation,
  tasks: readonly Task[],
  timelineEvents: readonly TimelineEvent[],
): OperationsWorkspaceProjection {
  return {
    operation: getOperationProjection(operation),
    tasks: tasks.map(getTaskProjection),
    timeline: timelineEvents.map(getTimelineEventProjection),
  };
}