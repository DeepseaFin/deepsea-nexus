import type { ApprovalAuthority } from "@/src/capabilities/approval/governance/ApprovalAuthority";
import type { ApprovalPolicy } from "@/src/capabilities/approval/governance/ApprovalPolicy";

export interface ApprovalGovernance {
  readonly governanceId: string;
  readonly name: string;
  readonly policies: readonly ApprovalPolicy[];
  readonly authorities: readonly ApprovalAuthority[];
  readonly version: string;
}