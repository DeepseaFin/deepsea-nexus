import type { CustomerOnboardingWorkflow } from "@/lib/workflows/CustomerOnboardingWorkflow";

export interface WorkflowRegistry {
  register(workflow: CustomerOnboardingWorkflow): void;
  get(workflowId: string): CustomerOnboardingWorkflow | null;
  has(workflowId: string): boolean;
  listWorkflowIds(): readonly string[];
}
