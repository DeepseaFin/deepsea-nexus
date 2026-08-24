import type { ProjectionMetadata } from "@/src/framework/projections/ProjectionMetadata";

export interface ApprovalProjectionMetadata extends ProjectionMetadata {
  readonly approvalId: string;
  readonly participantCount: number;
}