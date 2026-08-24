import { WorkflowStage } from "@/lib/workflow/WorkflowStage";
import { WorkflowTaskPriority, WorkflowTaskStatus } from "@/lib/workflow/WorkflowTask";
import { WorkflowMilestoneStatus } from "@/lib/workflow/WorkflowMilestone";
import type { WorkflowEventType } from "@/lib/workflow/WorkflowEvent";
import type { WorkflowValidationIssue } from "@/lib/workflow/types";

export interface WorkflowSummaryViewModel {
  readonly totalTasks: number;
  readonly pendingTasks: number;
  readonly inProgressTasks: number;
  readonly blockedTasks: number;
  readonly completedTasks: number;
  readonly cancelledTasks: number;
  readonly totalMilestones: number;
  readonly achievedMilestones: number;
  readonly overdueMilestones: number;
  readonly completionPercent: number;
  readonly openTaskPercent: number;
  readonly isTerminal: boolean;
  readonly lastUpdatedAt: string;
}

export interface WorkflowTimelineEntryViewModel {
  readonly eventId: string;
  readonly type: WorkflowEventType;
  readonly typeLabel: string;
  readonly occurredAt: string;
  readonly actorId?: string;
  readonly message?: string;
  readonly fromStage?: WorkflowStage;
  readonly toStage?: WorkflowStage;
  readonly fromStageLabel?: string;
  readonly toStageLabel?: string;
  readonly taskId?: string;
  readonly milestoneId?: string;
  readonly assignmentId?: string;
}

export interface WorkflowTaskViewModel {
  readonly taskId: string;
  readonly title: string;
  readonly description?: string;
  readonly stage: WorkflowStage;
  readonly stageLabel: string;
  readonly status: WorkflowTaskStatus;
  readonly statusLabel: string;
  readonly priority: WorkflowTaskPriority;
  readonly priorityLabel: string;
  readonly assignmentOwnerName?: string;
  readonly assignmentOwnerId?: string;
  readonly dueAt?: string;
  readonly startedAt?: string;
  readonly completedAt?: string;
}

export interface WorkflowMilestoneViewModel {
  readonly milestoneId: string;
  readonly title: string;
  readonly description?: string;
  readonly stage: WorkflowStage;
  readonly stageLabel: string;
  readonly status: WorkflowMilestoneStatus;
  readonly statusLabel: string;
  readonly dueAt?: string;
  readonly achievedAt?: string;
  readonly taskIds: readonly string[];
}

export interface WorkflowAssignmentViewModel {
  readonly assignmentId: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerType: string;
  readonly assignedAt: string;
  readonly assignedBy?: string;
  readonly active: boolean;
}

export interface WorkflowTransitionViewModel {
  readonly transitionId: string;
  readonly fromStage: WorkflowStage;
  readonly toStage: WorkflowStage;
  readonly fromStageLabel: string;
  readonly toStageLabel: string;
  readonly description?: string;
  readonly requiredTaskIds: readonly string[];
  readonly requiredMilestoneIds: readonly string[];
  readonly conditionCount: number;
}

export interface WorkflowViewModel {
  readonly generatedAt: string;
  readonly workflowId: string;
  readonly name: string;
  readonly description?: string;
  readonly revision: number;
  readonly currentStage: WorkflowStage;
  readonly currentStageLabel: string;
  readonly previousStage?: WorkflowStage;
  readonly previousStageLabel?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly completedAt?: string;
  readonly cancelledAt?: string;
  readonly summary: WorkflowSummaryViewModel;
  readonly tasks: readonly WorkflowTaskViewModel[];
  readonly milestones: readonly WorkflowMilestoneViewModel[];
  readonly assignments: readonly WorkflowAssignmentViewModel[];
  readonly timeline: readonly WorkflowTimelineEntryViewModel[];
  readonly availableTransitions: readonly WorkflowTransitionViewModel[];
  readonly validationIssues: readonly WorkflowValidationIssue[];
}
