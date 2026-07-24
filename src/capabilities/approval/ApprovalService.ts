import type { Approval } from "@/src/capabilities/approval/Approval";
import type { ApprovalDecision } from "@/src/capabilities/approval/ApprovalDecision";
import type { ApprovalId } from "@/src/capabilities/approval/ApprovalId";
import type { ApprovalMetadata } from "@/src/capabilities/approval/ApprovalMetadata";
import type { ApprovalStatus } from "@/src/capabilities/approval/ApprovalStatus";

export interface CreateApprovalInput {
  readonly id: ApprovalId;
  readonly status: ApprovalStatus;
  readonly decision: ApprovalDecision;
  readonly metadata: ApprovalMetadata;
}

export interface ApprovalService {
  create(input: CreateApprovalInput): Promise<Approval>;
  get(id: ApprovalId): Promise<Approval | null>;
  listByStatus(status: ApprovalStatus): Promise<readonly Approval[]>;
  listByDecision(decision: ApprovalDecision): Promise<readonly Approval[]>;
}