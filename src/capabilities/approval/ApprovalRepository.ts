import type { Approval } from "@/src/capabilities/approval/Approval";
import type { ApprovalId } from "@/src/capabilities/approval/ApprovalId";
import type { ApprovalStatus } from "@/src/capabilities/approval/ApprovalStatus";

export interface ApprovalRepository {
  findById(id: ApprovalId): Promise<Approval | null>;
  save(approval: Approval): Promise<void>;
  listByStatus(status: ApprovalStatus): Promise<readonly Approval[]>;
}