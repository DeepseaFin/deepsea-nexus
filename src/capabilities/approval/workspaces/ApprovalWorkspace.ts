import type { ApprovalPanel } from "@/src/capabilities/approval/panels/ApprovalPanel";
import type { ApprovalWorkspaceMetadata } from "@/src/capabilities/approval/workspaces/ApprovalWorkspaceMetadata";
import type { InstitutionalWorkspace } from "@/src/framework/workspaces/InstitutionalWorkspace";

export interface ApprovalWorkspace
  extends Omit<InstitutionalWorkspace<ApprovalPanel>, "panels" | "metadata"> {
  readonly workspaceId: string;
  readonly title: string;
  readonly panels: readonly ApprovalPanel[];
  readonly metadata: ApprovalWorkspaceMetadata;
}