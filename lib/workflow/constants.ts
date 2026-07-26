import { WorkflowStage } from "@/lib/workflow/WorkflowStage";
import { WorkflowAssignmentType, WorkflowTaskPriority, WorkflowTaskStatus } from "@/lib/workflow/WorkflowTask";
import { WorkflowMilestoneStatus } from "@/lib/workflow/WorkflowMilestone";

export const WORKFLOW_STAGE_SEQUENCE = [
  WorkflowStage.Draft,
  WorkflowStage.Intake,
  WorkflowStage.Assessment,
  WorkflowStage.Review,
  WorkflowStage.Approval,
  WorkflowStage.Execution,
  WorkflowStage.Closure,
  WorkflowStage.Completed,
] as const;

export const WORKFLOW_TERMINAL_STAGES = [WorkflowStage.Completed, WorkflowStage.Cancelled] as const;

export const WORKFLOW_TASK_STATUSES = [
  WorkflowTaskStatus.Pending,
  WorkflowTaskStatus.InProgress,
  WorkflowTaskStatus.Blocked,
  WorkflowTaskStatus.Completed,
  WorkflowTaskStatus.Cancelled,
] as const;

export const WORKFLOW_TASK_PRIORITIES = [
  WorkflowTaskPriority.Low,
  WorkflowTaskPriority.Medium,
  WorkflowTaskPriority.High,
  WorkflowTaskPriority.Critical,
] as const;

export const WORKFLOW_ASSIGNMENT_TYPES = [
  WorkflowAssignmentType.User,
  WorkflowAssignmentType.Team,
  WorkflowAssignmentType.Role,
  WorkflowAssignmentType.System,
] as const;

export const WORKFLOW_MILESTONE_STATUSES = [
  WorkflowMilestoneStatus.Pending,
  WorkflowMilestoneStatus.Achieved,
  WorkflowMilestoneStatus.Overdue,
  WorkflowMilestoneStatus.Cancelled,
] as const;

export const WORKFLOW_STAGE_LABELS: Readonly<Record<WorkflowStage, string>> = {
  [WorkflowStage.Draft]: "Draft",
  [WorkflowStage.Intake]: "Intake",
  [WorkflowStage.Assessment]: "Assessment",
  [WorkflowStage.Review]: "Review",
  [WorkflowStage.Approval]: "Approval",
  [WorkflowStage.Execution]: "Execution",
  [WorkflowStage.Closure]: "Closure",
  [WorkflowStage.Completed]: "Completed",
  [WorkflowStage.Cancelled]: "Cancelled",
};
