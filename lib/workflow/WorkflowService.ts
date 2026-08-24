import { WORKFLOW_STAGE_SEQUENCE, WORKFLOW_TERMINAL_STAGES } from "@/lib/workflow/constants";
import { createWorkflow, isWorkflowTerminal, type Workflow, type WorkflowInput } from "@/lib/workflow/Workflow";
import { WorkflowAssignment } from "@/lib/workflow/WorkflowAssignment";
import { WorkflowEvent, WorkflowEventType } from "@/lib/workflow/WorkflowEvent";
import { WorkflowMilestone, WorkflowMilestoneStatus } from "@/lib/workflow/WorkflowMilestone";
import { WorkflowPolicy } from "@/lib/workflow/WorkflowPolicy";
import { WorkflowStage } from "@/lib/workflow/WorkflowStage";
import { WorkflowTask, WorkflowTaskStatus } from "@/lib/workflow/WorkflowTask";
import type { WorkflowValidationIssue, WorkflowValidationResult, WorkflowTimestamp } from "@/lib/workflow/types";
import { WorkflowTransition } from "@/lib/workflow/WorkflowTransition";

export class WorkflowDomainError extends Error {
  readonly issues: readonly WorkflowValidationIssue[];

  constructor(message: string, issues: readonly WorkflowValidationIssue[]) {
    super(message);
    this.name = "WorkflowDomainError";
    this.issues = issues;
  }
}

function issue(code: string, message: string, target?: string): WorkflowValidationIssue {
  return { code, message, target };
}

function validationResult(issues: readonly WorkflowValidationIssue[]): WorkflowValidationResult {
  return { valid: issues.length === 0, issues };
}

function assertValid(result: WorkflowValidationResult, message: string): void {
  if (!result.valid) {
    throw new WorkflowDomainError(message, result.issues);
  }
}

function nowTimestamp(occurredAt?: WorkflowTimestamp): WorkflowTimestamp {
  return occurredAt ?? new Date().toISOString();
}

function replaceTask(workflow: Workflow, task: WorkflowTask): Workflow {
  return {
    ...workflow,
    tasks: workflow.tasks.map((current) => (current.taskId === task.taskId ? task : current)),
  };
}

function replaceMilestone(workflow: Workflow, milestone: WorkflowMilestone): Workflow {
  return {
    ...workflow,
    milestones: workflow.milestones.map((current) => (current.milestoneId === milestone.milestoneId ? milestone : current)),
  };
}

function appendEvent(workflow: Workflow, event: WorkflowEvent): Workflow {
  return {
    ...workflow,
    events: [...workflow.events, event],
    updatedAt: event.occurredAt,
    revision: workflow.revision + 1,
  };
}

function findTransition(workflow: Workflow, toStage: WorkflowStage): WorkflowTransition | undefined {
  return workflow.policy.allowedTransitions.find(
    (transition) => transition.fromStage === workflow.currentStage && transition.toStage === toStage,
  );
}

function stageIndex(stage: WorkflowStage): number {
  return WORKFLOW_STAGE_SEQUENCE.indexOf(stage as (typeof WORKFLOW_STAGE_SEQUENCE)[number]);
}

function uniqueIds<T extends { readonly [key: string]: string }>(items: readonly T[], key: keyof T): string[] {
  return items.map((item) => item[key]).filter((id, index, values) => values.indexOf(id) !== index);
}

export class WorkflowService {
  static createWorkflow(input: WorkflowInput): Workflow {
    return createWorkflow(input);
  }

  static validateWorkflow(workflow: Workflow): WorkflowValidationResult {
    const issues: WorkflowValidationIssue[] = [];

    if (!workflow.workflowId.trim()) {
      issues.push(issue("workflow_id_required", "Workflow id is required.", "workflowId"));
    }

    if (!workflow.name.trim()) {
      issues.push(issue("workflow_name_required", "Workflow name is required.", "name"));
    }

    if (!workflow.policy.policyId.trim()) {
      issues.push(issue("workflow_policy_required", "Workflow policy is required.", "policy.policyId"));
    }

    for (const duplicateId of uniqueIds(workflow.tasks, "taskId")) {
      issues.push(issue("duplicate_task_id", `Duplicate task id detected: ${duplicateId}.`, "tasks"));
    }

    for (const duplicateId of uniqueIds(workflow.assignments, "assignmentId")) {
      issues.push(issue("duplicate_assignment_id", `Duplicate assignment id detected: ${duplicateId}.`, "assignments"));
    }

    for (const duplicateId of uniqueIds(workflow.milestones, "milestoneId")) {
      issues.push(issue("duplicate_milestone_id", `Duplicate milestone id detected: ${duplicateId}.`, "milestones"));
    }

    for (const duplicateId of uniqueIds(workflow.events, "eventId")) {
      issues.push(issue("duplicate_event_id", `Duplicate event id detected: ${duplicateId}.`, "events"));
    }

    for (const task of workflow.tasks) {
      if (!task.title.trim()) {
        issues.push(issue("task_title_required", "Task title is required.", `tasks.${task.taskId}.title`));
      }
    }

    if (workflow.completedAt && workflow.currentStage !== WorkflowStage.Completed) {
      issues.push(issue("completed_stage_mismatch", "Completed workflows must end in the completed stage.", "completedAt"));
    }

    if (workflow.cancelledAt && workflow.currentStage !== WorkflowStage.Cancelled) {
      issues.push(issue("cancelled_stage_mismatch", "Cancelled workflows must end in the cancelled stage.", "cancelledAt"));
    }

    for (let index = 1; index < workflow.events.length; index += 1) {
      const previous = Date.parse(workflow.events[index - 1].occurredAt);
      const current = Date.parse(workflow.events[index].occurredAt);

      if (!Number.isNaN(previous) && !Number.isNaN(current) && current < previous) {
        issues.push(issue("event_order_invalid", "Workflow events must be in chronological order.", `events.${index}`));
        break;
      }
    }

    return validationResult(issues);
  }

  static validateTransition(workflow: Workflow, toStage: WorkflowStage): WorkflowValidationResult {
    const issues: WorkflowValidationIssue[] = [];

    if (workflow.currentStage === toStage) {
      issues.push(issue("transition_noop", "Workflow is already in the requested stage.", "currentStage"));
    }

    if (WORKFLOW_TERMINAL_STAGES.includes(workflow.currentStage as (typeof WORKFLOW_TERMINAL_STAGES)[number])) {
      issues.push(issue("transition_terminal_stage", "Terminal workflows cannot transition to another stage.", "currentStage"));
    }

    const transition = findTransition(workflow, toStage);
    if (!transition) {
      issues.push(issue("transition_not_allowed", `Transition from ${workflow.currentStage} to ${toStage} is not allowed.`, "policy.allowedTransitions"));
    } else {
      for (const taskId of transition.requiredTaskIds) {
        const task = workflow.tasks.find((candidate) => candidate.taskId === taskId);
        if (!task || task.status !== WorkflowTaskStatus.Completed) {
          issues.push(issue("transition_task_incomplete", `Required task ${taskId} must be completed before this transition.`, `tasks.${taskId}`));
        }
      }

      for (const milestoneId of transition.requiredMilestoneIds) {
        const milestone = workflow.milestones.find((candidate) => candidate.milestoneId === milestoneId);
        if (!milestone || milestone.status !== WorkflowMilestoneStatus.Achieved) {
          issues.push(issue("transition_milestone_incomplete", `Required milestone ${milestoneId} must be achieved before this transition.`, `milestones.${milestoneId}`));
        }
      }
    }

    const currentIndex = stageIndex(workflow.currentStage);
    const nextIndex = stageIndex(toStage);
    if (currentIndex >= 0 && nextIndex >= 0 && nextIndex < currentIndex) {
      issues.push(issue("transition_backwards_not_allowed", "Backward stage transitions are not allowed.", "toStage"));
    }

    return validationResult(issues);
  }

  static transitionWorkflow(
    workflow: Workflow,
    toStage: WorkflowStage,
    actorId?: string,
    occurredAt?: WorkflowTimestamp,
    message?: string,
  ): Workflow {
    const validation = this.validateTransition(workflow, toStage);
    assertValid(validation, "Workflow transition is not allowed.");

    const timestamp = nowTimestamp(occurredAt);
    const nextWorkflow: Workflow = {
      ...workflow,
      previousStage: workflow.currentStage,
      currentStage: toStage,
      updatedAt: timestamp,
      revision: workflow.revision + 1,
      completedAt: toStage === WorkflowStage.Completed ? timestamp : workflow.completedAt,
      cancelledAt: toStage === WorkflowStage.Cancelled ? timestamp : workflow.cancelledAt,
    };

    return appendEvent(nextWorkflow, {
      eventId: `${workflow.workflowId}:${workflow.revision + 1}:${toStage}`,
      workflowId: workflow.workflowId,
      type: toStage === WorkflowStage.Completed ? WorkflowEventType.Completed : toStage === WorkflowStage.Cancelled ? WorkflowEventType.Cancelled : WorkflowEventType.StageTransitioned,
      occurredAt: timestamp,
      actorId,
      message,
      fromStage: workflow.currentStage,
      toStage,
    });
  }

  static addTask(workflow: Workflow, task: WorkflowTask, actorId?: string, occurredAt?: WorkflowTimestamp): Workflow {
    const existingTask = workflow.tasks.find((candidate) => candidate.taskId === task.taskId);
    if (existingTask) {
      throw new WorkflowDomainError("Task already exists on workflow.", [issue("duplicate_task_id", `Task ${task.taskId} already exists.`, `tasks.${task.taskId}`)]);
    }

    const timestamp = nowTimestamp(occurredAt);
    const nextWorkflow: Workflow = {
      ...workflow,
      tasks: [...workflow.tasks, task],
      updatedAt: timestamp,
      revision: workflow.revision + 1,
    };

    return appendEvent(nextWorkflow, {
      eventId: `${workflow.workflowId}:${workflow.revision + 1}:task:${task.taskId}`,
      workflowId: workflow.workflowId,
      type: WorkflowEventType.TaskCreated,
      occurredAt: timestamp,
      actorId,
      taskId: task.taskId,
      message: `Task ${task.title} added to workflow.`,
    });
  }

  static assignTask(
    workflow: Workflow,
    taskId: string,
    assignment: WorkflowAssignment,
    actorId?: string,
    occurredAt?: WorkflowTimestamp,
  ): Workflow {
    const task = workflow.tasks.find((candidate) => candidate.taskId === taskId);
    if (!task) {
      throw new WorkflowDomainError("Task cannot be assigned because it does not exist.", [issue("task_not_found", `Task ${taskId} was not found.`, `tasks.${taskId}`)]);
    }

    const timestamp = nowTimestamp(occurredAt);
    const updatedTask: WorkflowTask = {
      ...task,
      assignment,
    };

    const nextWorkflow: Workflow = {
      ...replaceTask(workflow, updatedTask),
      assignments: [...workflow.assignments.filter((candidate) => candidate.assignmentId !== assignment.assignmentId), assignment],
      updatedAt: timestamp,
      revision: workflow.revision + 1,
    };

    return appendEvent(nextWorkflow, {
      eventId: `${workflow.workflowId}:${workflow.revision + 1}:assignment:${assignment.assignmentId}`,
      workflowId: workflow.workflowId,
      type: WorkflowEventType.TaskAssigned,
      occurredAt: timestamp,
      actorId,
      taskId,
      assignmentId: assignment.assignmentId,
      message: `Task ${taskId} assigned to ${assignment.ownerName}.`,
    });
  }

  static startTask(workflow: Workflow, taskId: string, actorId?: string, occurredAt?: WorkflowTimestamp): Workflow {
    return this.updateTaskStatus(workflow, taskId, WorkflowTaskStatus.InProgress, WorkflowEventType.TaskStarted, actorId, occurredAt);
  }

  static blockTask(workflow: Workflow, taskId: string, actorId?: string, occurredAt?: WorkflowTimestamp): Workflow {
    return this.updateTaskStatus(workflow, taskId, WorkflowTaskStatus.Blocked, WorkflowEventType.TaskBlocked, actorId, occurredAt);
  }

  static completeTask(workflow: Workflow, taskId: string, actorId?: string, occurredAt?: WorkflowTimestamp): Workflow {
    return this.updateTaskStatus(workflow, taskId, WorkflowTaskStatus.Completed, WorkflowEventType.TaskCompleted, actorId, occurredAt);
  }

  static cancelTask(workflow: Workflow, taskId: string, actorId?: string, occurredAt?: WorkflowTimestamp): Workflow {
    return this.updateTaskStatus(workflow, taskId, WorkflowTaskStatus.Cancelled, WorkflowEventType.TaskCancelled, actorId, occurredAt);
  }

  static addMilestone(workflow: Workflow, milestone: WorkflowMilestone, actorId?: string, occurredAt?: WorkflowTimestamp): Workflow {
    const existingMilestone = workflow.milestones.find((candidate) => candidate.milestoneId === milestone.milestoneId);
    if (existingMilestone) {
      throw new WorkflowDomainError("Milestone already exists on workflow.", [issue("duplicate_milestone_id", `Milestone ${milestone.milestoneId} already exists.`, `milestones.${milestone.milestoneId}`)]);
    }

    const timestamp = nowTimestamp(occurredAt);
    const nextWorkflow: Workflow = {
      ...workflow,
      milestones: [...workflow.milestones, milestone],
      updatedAt: timestamp,
      revision: workflow.revision + 1,
    };

    return appendEvent(nextWorkflow, {
      eventId: `${workflow.workflowId}:${workflow.revision + 1}:milestone:${milestone.milestoneId}`,
      workflowId: workflow.workflowId,
      type: WorkflowEventType.PolicyEvaluated,
      occurredAt: timestamp,
      actorId,
      milestoneId: milestone.milestoneId,
      message: `Milestone ${milestone.title} added to workflow.`,
    });
  }

  static achieveMilestone(workflow: Workflow, milestoneId: string, actorId?: string, occurredAt?: WorkflowTimestamp): Workflow {
    const milestone = workflow.milestones.find((candidate) => candidate.milestoneId === milestoneId);
    if (!milestone) {
      throw new WorkflowDomainError("Milestone cannot be achieved because it does not exist.", [issue("milestone_not_found", `Milestone ${milestoneId} was not found.`, `milestones.${milestoneId}`)]);
    }

    const timestamp = nowTimestamp(occurredAt);
    const updatedMilestone: WorkflowMilestone = {
      ...milestone,
      status: WorkflowMilestoneStatus.Achieved,
      achievedAt: timestamp,
    };

    const nextWorkflow: Workflow = {
      ...replaceMilestone(workflow, updatedMilestone),
      updatedAt: timestamp,
      revision: workflow.revision + 1,
    };

    return appendEvent(nextWorkflow, {
      eventId: `${workflow.workflowId}:${workflow.revision + 1}:milestone:${milestoneId}:achieved`,
      workflowId: workflow.workflowId,
      type: WorkflowEventType.MilestoneAchieved,
      occurredAt: timestamp,
      actorId,
      milestoneId,
      message: `Milestone ${milestoneId} achieved.`,
    });
  }

  static recordEvent(workflow: Workflow, event: WorkflowEvent): Workflow {
    if (event.workflowId !== workflow.workflowId) {
      throw new WorkflowDomainError("Workflow event does not belong to this workflow.", [issue("event_workflow_mismatch", "Workflow event workflow id mismatch.", "events")]);
    }

    if (workflow.events.some((candidate) => candidate.eventId === event.eventId)) {
      throw new WorkflowDomainError("Workflow event already exists.", [issue("duplicate_event_id", `Event ${event.eventId} already exists.`, `events.${event.eventId}`)]);
    }

    return appendEvent(workflow, event);
  }

  static cancelWorkflow(workflow: Workflow, actorId?: string, occurredAt?: WorkflowTimestamp, message?: string): Workflow {
    return this.transitionWorkflow(workflow, WorkflowStage.Cancelled, actorId, occurredAt, message ?? "Workflow cancelled.");
  }

  static isTerminal(workflow: Workflow): boolean {
    return isWorkflowTerminal(workflow);
  }

  static validatePolicy(policy: WorkflowPolicy): WorkflowValidationResult {
    const issues: WorkflowValidationIssue[] = [];

    if (!policy.policyId.trim()) {
      issues.push(issue("policy_id_required", "Workflow policy id is required.", "policyId"));
    }

    if (!policy.name.trim()) {
      issues.push(issue("policy_name_required", "Workflow policy name is required.", "name"));
    }

    for (const transition of policy.allowedTransitions) {
      if (transition.fromStage === transition.toStage) {
        issues.push(issue("transition_same_stage", "Transitions must move between distinct stages.", `allowedTransitions.${transition.transitionId}`));
      }
    }

    return validationResult(issues);
  }

  private static updateTaskStatus(
    workflow: Workflow,
    taskId: string,
    status: WorkflowTaskStatus,
    eventType: WorkflowEventType,
    actorId?: string,
    occurredAt?: WorkflowTimestamp,
  ): Workflow {
    const task = workflow.tasks.find((candidate) => candidate.taskId === taskId);
    if (!task) {
      throw new WorkflowDomainError("Task cannot be updated because it does not exist.", [issue("task_not_found", `Task ${taskId} was not found.`, `tasks.${taskId}`)]);
    }

    const timestamp = nowTimestamp(occurredAt);
    const updatedTask: WorkflowTask = {
      ...task,
      status,
      startedAt: status === WorkflowTaskStatus.InProgress ? timestamp : task.startedAt,
      completedAt: status === WorkflowTaskStatus.Completed ? timestamp : task.completedAt,
    };

    const nextWorkflow: Workflow = {
      ...replaceTask(workflow, updatedTask),
      updatedAt: timestamp,
      revision: workflow.revision + 1,
    };

    return appendEvent(nextWorkflow, {
      eventId: `${workflow.workflowId}:${workflow.revision + 1}:task:${taskId}:${status}`,
      workflowId: workflow.workflowId,
      type: eventType,
      occurredAt: timestamp,
      actorId,
      taskId,
      message: `Task ${taskId} marked as ${status}.`,
    });
  }
}
