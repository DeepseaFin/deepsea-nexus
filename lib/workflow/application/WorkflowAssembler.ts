import { WORKFLOW_STAGE_LABELS } from "@/lib/workflow/constants";
import type { Workflow } from "@/lib/workflow/Workflow";
import { WorkflowService } from "@/lib/workflow/WorkflowService";
import { createWorkflowSummaryAssembler, type WorkflowSummaryAssembler } from "@/lib/workflow/application/WorkflowSummaryAssembler";
import { createWorkflowTimelineAssembler, type WorkflowTimelineAssembler } from "@/lib/workflow/application/WorkflowTimelineAssembler";
import type {
  WorkflowAssignmentViewModel,
  WorkflowMilestoneViewModel,
  WorkflowTaskViewModel,
  WorkflowTransitionViewModel,
  WorkflowViewModel,
} from "@/lib/workflow/application/WorkflowViewModel";

export interface WorkflowAssemblerDependencies {
  readonly timelineAssembler: WorkflowTimelineAssembler;
  readonly summaryAssembler: WorkflowSummaryAssembler;
}

export interface WorkflowAssemblerInput {
  readonly workflow: Workflow;
  readonly generatedAt?: string;
}

export interface WorkflowAssembler {
  assemble(input: WorkflowAssemblerInput): WorkflowViewModel;
}

function toLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (fragment) => fragment.toUpperCase());
}

function mapTasks(workflow: Workflow): readonly WorkflowTaskViewModel[] {
  return workflow.tasks.map((task) => ({
    taskId: task.taskId,
    title: task.title,
    description: task.description,
    stage: task.stage,
    stageLabel: WORKFLOW_STAGE_LABELS[task.stage],
    status: task.status,
    statusLabel: toLabel(task.status),
    priority: task.priority,
    priorityLabel: toLabel(task.priority),
    assignmentOwnerName: task.assignment?.ownerName,
    assignmentOwnerId: task.assignment?.ownerId,
    dueAt: task.dueAt,
    startedAt: task.startedAt,
    completedAt: task.completedAt,
  }));
}

function mapAssignments(workflow: Workflow): readonly WorkflowAssignmentViewModel[] {
  return workflow.assignments.map((assignment) => ({
    assignmentId: assignment.assignmentId,
    ownerId: assignment.ownerId,
    ownerName: assignment.ownerName,
    ownerType: toLabel(assignment.ownerType),
    assignedAt: assignment.assignedAt,
    assignedBy: assignment.assignedBy,
    active: assignment.active,
  }));
}

function mapMilestones(workflow: Workflow): readonly WorkflowMilestoneViewModel[] {
  return workflow.milestones.map((milestone) => ({
    milestoneId: milestone.milestoneId,
    title: milestone.title,
    description: milestone.description,
    stage: milestone.stage,
    stageLabel: WORKFLOW_STAGE_LABELS[milestone.stage],
    status: milestone.status,
    statusLabel: toLabel(milestone.status),
    dueAt: milestone.dueAt,
    achievedAt: milestone.achievedAt,
    taskIds: [...milestone.taskIds],
  }));
}

function mapTransitions(workflow: Workflow): readonly WorkflowTransitionViewModel[] {
  return workflow.policy.allowedTransitions
    .filter((transition) => transition.fromStage === workflow.currentStage)
    .map((transition) => ({
      transitionId: transition.transitionId,
      fromStage: transition.fromStage,
      toStage: transition.toStage,
      fromStageLabel: WORKFLOW_STAGE_LABELS[transition.fromStage],
      toStageLabel: WORKFLOW_STAGE_LABELS[transition.toStage],
      description: transition.description,
      requiredTaskIds: [...transition.requiredTaskIds],
      requiredMilestoneIds: [...transition.requiredMilestoneIds],
      conditionCount: transition.conditions.length,
    }));
}

export function createWorkflowAssembler(
  dependencies: WorkflowAssemblerDependencies = {
    timelineAssembler: createWorkflowTimelineAssembler(),
    summaryAssembler: createWorkflowSummaryAssembler(),
  },
): WorkflowAssembler {
  return {
    assemble(input: WorkflowAssemblerInput): WorkflowViewModel {
      const generatedAt = input.generatedAt ?? new Date().toISOString();
      const validation = WorkflowService.validateWorkflow(input.workflow);

      return {
        generatedAt,
        workflowId: input.workflow.workflowId,
        name: input.workflow.name,
        description: input.workflow.description,
        revision: input.workflow.revision,
        currentStage: input.workflow.currentStage,
        currentStageLabel: WORKFLOW_STAGE_LABELS[input.workflow.currentStage],
        previousStage: input.workflow.previousStage,
        previousStageLabel: input.workflow.previousStage ? WORKFLOW_STAGE_LABELS[input.workflow.previousStage] : undefined,
        createdAt: input.workflow.createdAt,
        updatedAt: input.workflow.updatedAt,
        completedAt: input.workflow.completedAt,
        cancelledAt: input.workflow.cancelledAt,
        summary: dependencies.summaryAssembler.assemble(input.workflow),
        tasks: mapTasks(input.workflow),
        milestones: mapMilestones(input.workflow),
        assignments: mapAssignments(input.workflow),
        timeline: dependencies.timelineAssembler.assemble(input.workflow),
        availableTransitions: mapTransitions(input.workflow),
        validationIssues: [...validation.issues],
      };
    },
  };
}
