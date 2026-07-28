import type { Workflow } from "@/lib/workflow/Workflow";
import type { WorkflowAssignment } from "@/lib/workflow/WorkflowAssignment";
import type { WorkflowTask } from "@/lib/workflow/WorkflowTask";
import { WorkflowService } from "@/lib/workflow/WorkflowService";
import type { WorkflowOperationResult, WorkflowTimestamp } from "@/lib/workflow/types";

export interface WorkflowTaskCoordinator {
  addTask(workflow: Workflow, task: WorkflowTask, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow>;
  assignTask(
    workflow: Workflow,
    taskId: string,
    assignment: WorkflowAssignment,
    actorId?: string,
    occurredAt?: WorkflowTimestamp,
  ): WorkflowOperationResult<Workflow>;
  startTask(workflow: Workflow, taskId: string, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow>;
  blockTask(workflow: Workflow, taskId: string, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow>;
  completeTask(workflow: Workflow, taskId: string, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow>;
  cancelTask(workflow: Workflow, taskId: string, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow>;
}

function toOperationResult(workflow: Workflow): WorkflowOperationResult<Workflow> {
  return {
    value: workflow,
    validation: WorkflowService.validateWorkflow(workflow),
  };
}

export function createWorkflowTaskCoordinator(): WorkflowTaskCoordinator {
  return {
    addTask(workflow: Workflow, task: WorkflowTask, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow> {
      return toOperationResult(WorkflowService.addTask(workflow, task, actorId, occurredAt));
    },

    assignTask(
      workflow: Workflow,
      taskId: string,
      assignment: WorkflowAssignment,
      actorId?: string,
      occurredAt?: WorkflowTimestamp,
    ): WorkflowOperationResult<Workflow> {
      return toOperationResult(WorkflowService.assignTask(workflow, taskId, assignment, actorId, occurredAt));
    },

    startTask(workflow: Workflow, taskId: string, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow> {
      return toOperationResult(WorkflowService.startTask(workflow, taskId, actorId, occurredAt));
    },

    blockTask(workflow: Workflow, taskId: string, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow> {
      return toOperationResult(WorkflowService.blockTask(workflow, taskId, actorId, occurredAt));
    },

    completeTask(workflow: Workflow, taskId: string, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow> {
      return toOperationResult(WorkflowService.completeTask(workflow, taskId, actorId, occurredAt));
    },

    cancelTask(workflow: Workflow, taskId: string, actorId?: string, occurredAt?: WorkflowTimestamp): WorkflowOperationResult<Workflow> {
      return toOperationResult(WorkflowService.cancelTask(workflow, taskId, actorId, occurredAt));
    },
  };
}
