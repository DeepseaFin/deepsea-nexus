import type { WorkflowAttributes } from "@/lib/workflow/types";
import type { WorkflowTransition } from "@/lib/workflow/WorkflowTransition";

export enum WorkflowPolicyRuleType {
  Transition = "transition",
  Task = "task",
  Assignment = "assignment",
  Milestone = "milestone",
}

export interface WorkflowPolicyRule {
  readonly ruleId: string;
  readonly type: WorkflowPolicyRuleType;
  readonly description: string;
  readonly enabled: boolean;
  readonly metadata?: WorkflowAttributes;
}

export interface WorkflowPolicy {
  readonly policyId: string;
  readonly name: string;
  readonly description?: string;
  readonly allowedTransitions: readonly WorkflowTransition[];
  readonly rules: readonly WorkflowPolicyRule[];
  readonly metadata?: WorkflowAttributes;
}
