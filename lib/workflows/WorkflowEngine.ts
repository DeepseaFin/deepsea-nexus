import type { CustomerOnboardingWorkflow } from "@/lib/workflows/CustomerOnboardingWorkflow";
import type {
  CustomerOnboardingWorkflowInput,
  WorkflowContextServices,
} from "@/lib/workflows/WorkflowContext";
import type { WorkflowEvent } from "@/lib/workflows/WorkflowEvent";
import type { WorkflowExecutionResult } from "@/lib/workflows/WorkflowExecutionResult";
import type { WorkflowRegistry } from "@/lib/workflows/WorkflowRegistry";
import type { WorkflowStep } from "@/lib/workflows/WorkflowStep";

export interface WorkflowEngine {
  readonly registry: WorkflowRegistry;
  createCustomerOnboardingWorkflow(): CustomerOnboardingWorkflow;
  runCustomerOnboarding(
    input: CustomerOnboardingWorkflowInput,
    services: WorkflowContextServices,
  ): Promise<WorkflowExecutionResult>;
  runUntilStep(
    input: CustomerOnboardingWorkflowInput,
    services: WorkflowContextServices,
    terminalStep: WorkflowStep,
  ): Promise<WorkflowExecutionResult>;
  transition(
    workflow: CustomerOnboardingWorkflow,
    currentStep: WorkflowStep,
    event: WorkflowEvent,
  ): WorkflowStep | null;
}
