import { ApprovalDecision } from "@/src/capabilities/approval/ApprovalDecision";
import { ApprovalId } from "@/src/capabilities/approval/ApprovalId";
import { ApprovalRole } from "@/src/capabilities/approval/ApprovalRole";
import { ApprovalStage } from "@/src/capabilities/approval/ApprovalStage";
import type { ApprovalPanelConfig, ApprovalPanelModel } from "@/lib/customer/approval/approval-panel.types";

export const approvalPanelConfig: ApprovalPanelConfig = {
  title: "Approval Workspace",
  subtitle: "Governance decision composition layer for the active customer",
  workspaceLabel: "Customer Approval Surface",
  summaryTitle: "Current Decision Summary",
  summarySubtitle: "Live approval context provided by capability projections",
  stagesTitle: "Approval Stages",
  stagesSubtitle: "Generic stage progression for current approval route",
  participantsTitle: "Participants",
  participantsSubtitle: "Configured participant matrix and current decision posture",
  historyTitle: "Decision History",
  historySubtitle: "Generic approval events prepared for future workflow integration",
  nextActionTitle: "Next Required Action",
  nextActionSubtitle: "Configuration-driven action with no workflow engine coupling",
};

export const defaultApprovalPanelModel: ApprovalPanelModel = {
  summary: {
    approval: {
      approvalId: "APR-NW-2026-001",
      title: "Funding readiness approval package",
      status: "pending",
      currentStage: "credit_review",
      currentDecision: ApprovalDecision.RequestChanges,
      createdAt: "2026-07-20T09:10:00.000Z",
    },
    requestedBy: "Ariane D.",
    submittedDate: "2026-07-20",
    dueDate: "2026-07-28",
    priority: "High",
  },
  stages: [
    {
      id: "stage-1",
      title: "Submission",
      state: "Completed",
      owner: "Relationship Manager",
      dueDate: "2026-07-20",
    },
    {
      id: "stage-2",
      title: "Credit Review",
      state: "In Review",
      owner: "Credit Committee",
      dueDate: "2026-07-24",
    },
    {
      id: "stage-3",
      title: "Compliance Review",
      state: "Pending",
      owner: "Compliance",
      dueDate: "2026-07-26",
    },
    {
      id: "stage-4",
      title: "Final Decision",
      state: "Pending",
      owner: "Executive Approver",
      dueDate: "2026-07-28",
    },
  ],
  participants: [
    {
      participant: {
        approvalId: ApprovalId.fromString("APR-NW-2026-001"),
        actor: {
          id: "actor-rm-1",
          name: "Ariane D.",
          role: ApprovalRole.Requester,
        },
        metadata: {
          notes: "Submission owner",
        },
      },
      status: "Submitted",
      decision: "pending",
    },
    {
      participant: {
        approvalId: ApprovalId.fromString("APR-NW-2026-001"),
        actor: {
          id: "actor-credit-1",
          name: "Credit Committee",
          role: ApprovalRole.Reviewer,
        },
        metadata: {
          notes: "Primary risk reviewer",
        },
      },
      status: "In Review",
      decision: ApprovalDecision.RequestChanges,
    },
    {
      participant: {
        approvalId: ApprovalId.fromString("APR-NW-2026-001"),
        actor: {
          id: "actor-comp-1",
          name: "Compliance Lead",
          role: ApprovalRole.Reviewer,
        },
        metadata: {
          notes: "Awaiting package handoff",
        },
      },
      status: "Pending",
      decision: "pending",
    },
    {
      participant: {
        approvalId: ApprovalId.fromString("APR-NW-2026-001"),
        actor: {
          id: "actor-exec-1",
          name: "Executive Approver",
          role: ApprovalRole.Approver,
        },
        metadata: {
          notes: "Final stage",
        },
      },
      status: "Queued",
      decision: "pending",
    },
  ],
  history: [
    {
      entry: {
        timestamp: "2026-07-20T09:10:00.000Z",
        actorId: "actor-rm-1",
        stage: ApprovalStage.fromString("submission"),
        decision: ApprovalDecision.RequestChanges,
        comment: "Initial package submitted with provisional metrics.",
      },
      actorName: "Ariane D.",
      title: "Approval package submitted",
      description: "Funding readiness package entered the governance queue.",
    },
    {
      entry: {
        timestamp: "2026-07-22T13:45:00.000Z",
        actorId: "actor-credit-1",
        stage: ApprovalStage.fromString("credit_review"),
        decision: ApprovalDecision.RequestChanges,
        comment: "Need updated compliance certificate and receivables aging.",
      },
      actorName: "Credit Committee",
      title: "Credit review feedback issued",
      description: "Reviewer requested additional evidence before progressing to compliance.",
    },
  ],
  nextAction: {
    id: "next-action-1",
    title: "Upload refreshed compliance certificate",
    owner: "Operations",
    dueDate: "2026-07-25",
    status: "Open",
    priority: "high",
  },
};
