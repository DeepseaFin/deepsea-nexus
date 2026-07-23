import type { WorkflowApprovalRequirement } from "@/lib/orchestration/workflow/WorkflowApprovalRequirement";
import type { WorkflowStage } from "@/lib/orchestration/workflow/WorkflowStage";
import type { WorkflowState } from "@/lib/orchestration/workflow/WorkflowState";

export type TransitionConditionPrimitive = string | number | boolean;

export interface WorkflowTransitionCondition {
  readonly conditionId: string;
  readonly description: string;
  readonly metadata?: Readonly<Record<string, TransitionConditionPrimitive>>;
}

export interface WorkflowTransition {
  readonly fromStage: WorkflowStage;
  readonly toStage: WorkflowStage;
  readonly allowedStates: readonly WorkflowState[];
  readonly approvalRequirements: readonly WorkflowApprovalRequirement[];
  readonly transitionConditions: readonly WorkflowTransitionCondition[];
}
