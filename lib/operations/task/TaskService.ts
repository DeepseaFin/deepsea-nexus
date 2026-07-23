import type { OperationId } from "@/lib/operations/OperationId";
import type { Task } from "@/lib/operations/task/Task";
import type { TaskId } from "@/lib/operations/task/TaskId";
import type { TaskMetadata } from "@/lib/operations/task/TaskMetadata";
import type { TaskPriority } from "@/lib/operations/task/TaskPriority";
import type { TaskStatus } from "@/lib/operations/task/TaskStatus";
import type { TaskType } from "@/lib/operations/task/TaskType";

export interface CreateTaskInput {
  readonly taskId: TaskId;
  readonly operationId: OperationId;
  readonly taskName: string;
  readonly description: string;
  readonly taskType: TaskType;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly assignedTo: string;
  readonly dueDate: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata: TaskMetadata;
}

export interface TaskService {
  create(input: CreateTaskInput): Promise<Task>;
  get(taskId: TaskId): Promise<Task | null>;
  listByOperationId(operationId: OperationId): Promise<readonly Task[]>;
  listByType(taskType: TaskType): Promise<readonly Task[]>;
  listByStatus(status: TaskStatus): Promise<readonly Task[]>;
  listByPriority(priority: TaskPriority): Promise<readonly Task[]>;
}