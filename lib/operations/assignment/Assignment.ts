import type { OperationId } from "@/lib/operations/OperationId";
import type { TaskId } from "@/lib/operations/task/TaskId";
import type { AssignmentId } from "@/lib/operations/assignment/AssignmentId";
import type { AssignmentMetadata } from "@/lib/operations/assignment/AssignmentMetadata";
import type { AssignmentStatus } from "@/lib/operations/assignment/AssignmentStatus";
import type { AssignmentType } from "@/lib/operations/assignment/AssignmentType";

export interface Assignment {
  readonly assignmentId: AssignmentId;
  readonly operationId: OperationId;
  readonly taskId?: TaskId;
  readonly assigneeId: string;
  readonly assigneeName: string;
  readonly assignmentType: AssignmentType;
  readonly status: AssignmentStatus;
  readonly assignedAt: string;
  readonly completedAt?: string;
  readonly metadata: AssignmentMetadata;
}