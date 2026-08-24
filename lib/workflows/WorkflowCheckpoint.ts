import type { WorkflowStep } from "@/lib/workflows/WorkflowStep";

export enum WorkflowCheckpointStatus {
  Pending = "pending",
  Passed = "passed",
  Failed = "failed",
}

export interface WorkflowCheckpoint {
  readonly checkpointId: string;
  readonly workflowId: string;
  readonly executionId: string;
  readonly step: WorkflowStep;
  readonly status: WorkflowCheckpointStatus;
  readonly details: string;
  readonly recordedAt: string;
  readonly recordedBy: string;
}
