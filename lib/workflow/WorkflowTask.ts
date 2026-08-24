import type { WorkflowAssignment } from "@/lib/workflow/WorkflowAssignment";
import { WorkflowStage } from "@/lib/workflow/WorkflowStage";
import type { WorkflowAttributes, WorkflowTimestamp } from "@/lib/workflow/types";

export enum WorkflowTaskStatus {
  Pending = "pending",
  InProgress = "in_progress",
  Blocked = "blocked",
  Completed = "completed",
  Cancelled = "cancelled",
}

export enum WorkflowTaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Critical = "critical",
}

export interface WorkflowTask {
  readonly taskId: string;
  readonly title: string;
  readonly description?: string;
  readonly stage: WorkflowStage;
  readonly status: WorkflowTaskStatus;
  readonly priority: WorkflowTaskPriority;
  readonly assignment?: WorkflowAssignment;
  readonly dueAt?: WorkflowTimestamp;
  readonly startedAt?: WorkflowTimestamp;
  readonly completedAt?: WorkflowTimestamp;
  readonly metadata?: WorkflowAttributes;
}
