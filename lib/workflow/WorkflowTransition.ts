import type { WorkflowAttributes } from "@/lib/workflow/types";
import { WorkflowStage } from "@/lib/workflow/WorkflowStage";

export interface WorkflowTransitionCondition {
  readonly conditionId: string;
  readonly description: string;
  readonly metadata?: WorkflowAttributes;
}

export interface WorkflowTransition {
  readonly transitionId: string;
  readonly fromStage: WorkflowStage;
  readonly toStage: WorkflowStage;
  readonly description?: string;
  readonly requiredTaskIds: readonly string[];
  readonly requiredMilestoneIds: readonly string[];
  readonly conditions: readonly WorkflowTransitionCondition[];
  readonly metadata?: WorkflowAttributes;
}
