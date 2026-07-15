import type { WorkflowContext } from "@/lib/workflows/WorkflowContext";
import type { WorkflowEvent } from "@/lib/workflows/WorkflowEvent";
import type { WorkflowExecutionResult } from "@/lib/workflows/WorkflowExecutionResult";
import type { WorkflowStep } from "@/lib/workflows/WorkflowStep";
import type { WorkflowTransition } from "@/lib/workflows/WorkflowTransition";

export interface CustomerOnboardingWorkflow {
  readonly workflowId: string;
  readonly steps: readonly WorkflowStep[];
  readonly transitions: readonly WorkflowTransition[];
  execute(context: WorkflowContext): Promise<WorkflowExecutionResult>;
  canExecuteStep(step: WorkflowStep): boolean;
  resolveNextStep(step: WorkflowStep, event: WorkflowEvent): WorkflowStep | null;
}
