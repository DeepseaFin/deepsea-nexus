import type { Workflow } from "@/lib/workflow/Workflow";
import { WorkflowService } from "@/lib/workflow/WorkflowService";
import { WorkflowStage } from "@/lib/workflow/WorkflowStage";
import type { WorkflowOperationResult, WorkflowTimestamp, WorkflowValidationResult } from "@/lib/workflow/types";

export interface WorkflowTransitionCoordinator {
  validateTransition(workflow: Workflow, toStage: WorkflowStage): WorkflowValidationResult;
  transition(
    workflow: Workflow,
    toStage: WorkflowStage,
    actorId?: string,
    occurredAt?: WorkflowTimestamp,
    message?: string,
  ): WorkflowOperationResult<Workflow>;
}

export function createWorkflowTransitionCoordinator(): WorkflowTransitionCoordinator {
  return {
    validateTransition(workflow: Workflow, toStage: WorkflowStage): WorkflowValidationResult {
      return WorkflowService.validateTransition(workflow, toStage);
    },

    transition(
      workflow: Workflow,
      toStage: WorkflowStage,
      actorId?: string,
      occurredAt?: WorkflowTimestamp,
      message?: string,
    ): WorkflowOperationResult<Workflow> {
      const nextWorkflow = WorkflowService.transitionWorkflow(workflow, toStage, actorId, occurredAt, message);

      return {
        value: nextWorkflow,
        validation: WorkflowService.validateWorkflow(nextWorkflow),
      };
    },
  };
}
