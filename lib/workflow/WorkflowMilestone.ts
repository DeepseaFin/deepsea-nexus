import { WorkflowStage } from "@/lib/workflow/WorkflowStage";
import type { WorkflowAttributes, WorkflowTimestamp } from "@/lib/workflow/types";

export enum WorkflowMilestoneStatus {
  Pending = "pending",
  Achieved = "achieved",
  Overdue = "overdue",
  Cancelled = "cancelled",
}

export interface WorkflowMilestone {
  readonly milestoneId: string;
  readonly title: string;
  readonly description?: string;
  readonly stage: WorkflowStage;
  readonly status: WorkflowMilestoneStatus;
  readonly taskIds: readonly string[];
  readonly dueAt?: WorkflowTimestamp;
  readonly achievedAt?: WorkflowTimestamp;
  readonly metadata?: WorkflowAttributes;
}
