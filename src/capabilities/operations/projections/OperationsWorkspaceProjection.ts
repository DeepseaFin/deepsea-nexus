import type { OperationProjection } from "@/src/capabilities/operations/projections/OperationProjection";
import type { TaskProjection } from "@/src/capabilities/operations/projections/TaskProjection";

export interface OperationsWorkspaceProjection {
  readonly operation: OperationProjection;
  readonly tasks: readonly TaskProjection[];
}