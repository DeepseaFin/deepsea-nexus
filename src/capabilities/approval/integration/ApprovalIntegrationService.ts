import type { ApprovalRequest } from "@/src/capabilities/approval/integration/ApprovalRequest";
import type { ApprovalResponse } from "@/src/capabilities/approval/integration/ApprovalResponse";
import type { ApprovalDecision } from "@/src/capabilities/approval/ApprovalDecision";
import type { ApprovalStatus } from "@/src/capabilities/approval/ApprovalStatus";

export interface ListApprovalsQuery {
  readonly subjectId?: string;
  readonly approvalType?: string;
  readonly status?: ApprovalStatus;
  readonly decision?: ApprovalDecision;
}

export interface ApprovalIntegrationService {
  requestApproval(request: ApprovalRequest): Promise<ApprovalResponse>;
  getApproval(approvalId: string): Promise<ApprovalResponse | null>;
  listApprovals(query?: ListApprovalsQuery): Promise<readonly ApprovalResponse[]>;
}