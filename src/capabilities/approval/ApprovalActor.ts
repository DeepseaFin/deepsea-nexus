import type { ApprovalRole } from "@/src/capabilities/approval/ApprovalRole";

export interface ApprovalActor {
  readonly id: string;
  readonly name: string;
  readonly role: ApprovalRole;
}