import type { OperationId } from "@/lib/operations/OperationId";
import type { Assignment } from "@/lib/operations/assignment/Assignment";
import type { AssignmentId } from "@/lib/operations/assignment/AssignmentId";
import type { AssignmentMetadata } from "@/lib/operations/assignment/AssignmentMetadata";
import type { AssignmentStatus } from "@/lib/operations/assignment/AssignmentStatus";
import type { AssignmentType } from "@/lib/operations/assignment/AssignmentType";
import type { TaskId } from "@/lib/operations/task/TaskId";

export interface CreateAssignmentInput {
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

export interface AssignmentService {
  create(input: CreateAssignmentInput): Promise<Assignment>;
  get(assignmentId: AssignmentId): Promise<Assignment | null>;
  listByOperationId(operationId: OperationId): Promise<readonly Assignment[]>;
  listByTaskId(taskId: TaskId): Promise<readonly Assignment[]>;
  listByAssigneeId(assigneeId: string): Promise<readonly Assignment[]>;
  listByType(assignmentType: AssignmentType): Promise<readonly Assignment[]>;
  listByStatus(status: AssignmentStatus): Promise<readonly Assignment[]>;
}