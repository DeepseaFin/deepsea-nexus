import type { OperationId } from "@/lib/operations/OperationId";
import type { Task } from "@/lib/operations/task/Task";
import type { TaskId } from "@/lib/operations/task/TaskId";
import type { TaskPriority } from "@/lib/operations/task/TaskPriority";
import type { TaskStatus } from "@/lib/operations/task/TaskStatus";
import type { TaskType } from "@/lib/operations/task/TaskType";

export interface TaskRepository {
  findById(taskId: TaskId): Promise<Task | null>;
  save(task: Task): Promise<void>;
  listByOperationId(operationId: OperationId): Promise<readonly Task[]>;
  listByType(taskType: TaskType): Promise<readonly Task[]>;
  listByStatus(status: TaskStatus): Promise<readonly Task[]>;
  listByPriority(priority: TaskPriority): Promise<readonly Task[]>;
}