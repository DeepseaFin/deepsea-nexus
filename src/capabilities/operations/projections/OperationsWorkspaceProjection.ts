import type { OperationProjection } from "@/src/capabilities/operations/projections/OperationProjection";
import type { TaskProjection } from "@/src/capabilities/operations/projections/TaskProjection";
import type { TimelineEventProjection } from "@/src/capabilities/operations/projections/TimelineEventProjection";

export interface OperationsWorkspaceProjection {
  readonly operation: OperationProjection;
  readonly tasks: readonly TaskProjection[];
  readonly timeline: readonly TimelineEventProjection[];
}