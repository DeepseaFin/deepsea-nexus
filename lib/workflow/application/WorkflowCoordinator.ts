import type { Workflow, WorkflowInput } from "@/lib/workflow/Workflow";
import type { WorkflowEvent } from "@/lib/workflow/WorkflowEvent";
import type { WorkflowMilestone } from "@/lib/workflow/WorkflowMilestone";
import { WorkflowService } from "@/lib/workflow/WorkflowService";
import { WorkflowStage } from "@/lib/workflow/WorkflowStage";
import type { WorkflowOperationResult, WorkflowTimestamp, WorkflowValidationResult } from "@/lib/workflow/types";
import {
  createWorkflowTaskCoordinator,
  type WorkflowTaskCoordinator,
} from "@/lib/workflow/application/WorkflowTaskCoordinator";
import {
  createWorkflowTransitionCoordinator,
  type WorkflowTransitionCoordinator,
} from "@/lib/workflow/application/WorkflowTransitionCoordinator";

export interface WorkflowCoordinatorDependencies {
  readonly taskCoordinator: WorkflowTaskCoordinator;
  readonly transitionCoordinator: WorkflowTransitionCoordinator;
}

export interface WorkflowCoordinator {
  create(input: WorkflowInput): WorkflowOperationResult<Workflow>;
  validate(workflow: Workflow): WorkflowValidationResult;
  cancel(workflow: Workflow, actorId?: string, occurredAt?: WorkflowTimestamp, message?: string): WorkflowOperationResult<Workflow>;
  complete(workflow: Workflow, actorId?: string, occurredAt?: WorkflowTimestamp, message?: string): WorkflowOperationResult<Workflow>;
  recordEvent(workflow: Workflow, event: WorkflowEvent): WorkflowOperationResult<Workflow>;
  addMilestone(workflow: Workflow, milestone: WorkflowMilestone, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow>;
  achieveMilestone(workflow: Workflow, milestoneId: string, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow>;
  readonly tasks: WorkflowTaskCoordinator;
  readonly transitions: WorkflowTransitionCoordinator;
}

function toOperationResult(workflow: Workflow): WorkflowOperationResult<Workflow> {
  return {
    value: workflow,
    validation: WorkflowService.validateWorkflow(workflow),
  };
}

export function createWorkflowCoordinator(
  dependencies: WorkflowCoordinatorDependencies = {
    taskCoordinator: createWorkflowTaskCoordinator(),
    transitionCoordinator: createWorkflowTransitionCoordinator(),
  },
): WorkflowCoordinator {
  return {
    create(input: WorkflowInput): WorkflowOperationResult<Workflow> {
      const workflow = WorkflowService.createWorkflow(input);
      return toOperationResult(workflow);
    },

    validate(workflow: Workflow): WorkflowValidationResult {
      return WorkflowService.validateWorkflow(workflow);
    },

    cancel(workflow: Workflow, actorId?: string, occurredAt?: WorkflowTimestamp, message?: string): WorkflowOperationResult<Workflow> {
      return toOperationResult(WorkflowService.cancelWorkflow(workflow, actorId, occurredAt, message));
    },

    complete(workflow: Workflow, actorId?: string, occurredAt?: WorkflowTimestamp, message?: string): WorkflowOperationResult<Workflow> {
      return dependencies.transitionCoordinator.transition(
        workflow,
        WorkflowStage.Completed,
        actorId,
        occurredAt,
        message ?? "Workflow completed.",
      );
    },

    recordEvent(workflow: Workflow, event: WorkflowEvent): WorkflowOperationResult<Workflow> {
      return toOperationResult(WorkflowService.recordEvent(workflow, event));
    },

    addMilestone(workflow: Workflow, milestone: WorkflowMilestone, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow> {
      return toOperationResult(WorkflowService.addMilestone(workflow, milestone, actorId, occurredAt));
    },

    achieveMilestone(workflow: Workflow, milestoneId: string, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow> {
      return toOperationResult(WorkflowService.achieveMilestone(workflow, milestoneId, actorId, occurredAt));
    },

    tasks: dependencies.taskCoordinator,
    transitions: dependencies.transitionCoordinator,
  };
}
