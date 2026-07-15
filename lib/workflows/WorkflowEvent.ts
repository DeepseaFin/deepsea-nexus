import type { WorkflowStep } from "@/lib/workflows/WorkflowStep";
import type { OpportunityLifecycle } from "@/lib/workflows/WorkflowTransition";

export enum WorkflowEventType {
  ExecutionStarted = "execution_started",
  StepStarted = "step_started",
  StepCompleted = "step_completed",
  StepFailed = "step_failed",
  Transitioned = "transitioned",
  CheckpointRecorded = "checkpoint_recorded",
  RecommendationGenerated = "recommendation_generated",
  ExecutionCompleted = "execution_completed",
  ExecutionFailed = "execution_failed",
  OpportunityLifecycleTransitioned = "opportunity_lifecycle_transitioned",
}

export interface WorkflowEvent {
  readonly eventId: string;
  readonly workflowId: string;
  readonly executionId: string;
  readonly type: WorkflowEventType;
  readonly step: WorkflowStep | null;
  readonly occurredAt: string;
  readonly actorId: string;
  readonly message: string | null;
  readonly metadata: Readonly<Record<string, string>>;
}

export interface OpportunityLifecycleAuditEvent extends WorkflowEvent {
  readonly type: WorkflowEventType.OpportunityLifecycleTransitioned;
  readonly step: null;
  readonly opportunityId: string;
  readonly institutionId: string;
  readonly previousLifecycle: OpportunityLifecycle;
  readonly currentLifecycle: OpportunityLifecycle;
  readonly actor: string;
  readonly remarks?: string;
}
