import type { WorkflowAttributes, WorkflowTimestamp } from "@/lib/workflow/types";

export enum WorkflowAssignmentType {
  User = "user",
  Team = "team",
  Role = "role",
  System = "system",
}

export interface WorkflowAssignment {
  readonly assignmentId: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerType: WorkflowAssignmentType;
  readonly assignedAt: WorkflowTimestamp;
  readonly assignedBy?: string;
  readonly active: boolean;
  readonly metadata?: WorkflowAttributes;
}
