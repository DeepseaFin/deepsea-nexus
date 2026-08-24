import type { WorkflowApprovalRequirement } from "@/lib/orchestration/workflow/WorkflowApprovalRequirement";
import type { WorkflowStage } from "@/lib/orchestration/workflow/WorkflowStage";
import type { WorkflowTransition } from "@/lib/orchestration/workflow/WorkflowTransition";

export interface WorkflowContractMetadata {
  readonly name: string;
  readonly description: string;
  readonly owner: string;
  readonly tags: readonly string[];
  readonly additional?: Readonly<Record<string, string>>;
}

export interface WorkflowContract {
  readonly workflowId: string;
  readonly workflowVersion: string;
  readonly stages: readonly WorkflowStage[];
  readonly transitions: readonly WorkflowTransition[];
  readonly approvalRequirements: readonly WorkflowApprovalRequirement[];
  readonly metadata: WorkflowContractMetadata;
}
