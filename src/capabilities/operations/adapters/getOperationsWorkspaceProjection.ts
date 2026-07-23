import type { Operation } from "@/lib/operations/Operation";
import type { Task } from "@/lib/operations/task/Task";
import { getOperationProjection } from "@/src/capabilities/operations/adapters/getOperationProjection";
import { getTaskProjection } from "@/src/capabilities/operations/adapters/getTaskProjection";
import type { OperationsWorkspaceProjection } from "@/src/capabilities/operations/projections/OperationsWorkspaceProjection";

export function getOperationsWorkspaceProjection(
  operation: Operation,
  tasks: readonly Task[],
): OperationsWorkspaceProjection {
  return {
    operation: getOperationProjection(operation),
    tasks: tasks.map(getTaskProjection),
  };
}