import { WorkflowStage } from "@/lib/workflow/WorkflowStage";
import type { WorkflowAttributes, WorkflowTimestamp } from "@/lib/workflow/types";

export enum WorkflowEventType {
  Created = "created",
  StageTransitioned = "stage_transitioned",
  TaskCreated = "task_created",
  TaskAssigned = "task_assigned",
  TaskStarted = "task_started",
  TaskCompleted = "task_completed",
  TaskBlocked = "task_blocked",
  TaskCancelled = "task_cancelled",
  MilestoneAchieved = "milestone_achieved",
  PolicyEvaluated = "policy_evaluated",
  Completed = "completed",
  Cancelled = "cancelled",
}

export interface WorkflowEvent {
  readonly eventId: string;
  readonly workflowId: string;
  readonly type: WorkflowEventType;
  readonly occurredAt: WorkflowTimestamp;
  readonly actorId?: string;
  readonly message?: string;
  readonly fromStage?: WorkflowStage;
  readonly toStage?: WorkflowStage;
  readonly taskId?: string;
  readonly milestoneId?: string;
  readonly assignmentId?: string;
  readonly metadata?: WorkflowAttributes;
}
