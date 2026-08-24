import type { OperationId } from "@/lib/operations/OperationId";
import type { Assignment } from "@/lib/operations/assignment/Assignment";
import type { AssignmentId } from "@/lib/operations/assignment/AssignmentId";
import type { AssignmentStatus } from "@/lib/operations/assignment/AssignmentStatus";
import type { AssignmentType } from "@/lib/operations/assignment/AssignmentType";
import type { TaskId } from "@/lib/operations/task/TaskId";

export interface AssignmentRepository {
  findById(assignmentId: AssignmentId): Promise<Assignment | null>;
  save(assignment: Assignment): Promise<void>;
  listByOperationId(operationId: OperationId): Promise<readonly Assignment[]>;
  listByTaskId(taskId: TaskId): Promise<readonly Assignment[]>;
  listByAssigneeId(assigneeId: string): Promise<readonly Assignment[]>;
  listByType(assignmentType: AssignmentType): Promise<readonly Assignment[]>;
  listByStatus(status: AssignmentStatus): Promise<readonly Assignment[]>;
}