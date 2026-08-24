import { defaultAiInsightsModel } from "@/lib/customer/insights/insights.config";
import type { WorkflowPanelConfig, WorkflowPanelModel } from "@/lib/customer/workflow/workflow.types";

export const workflowPanelConfig: WorkflowPanelConfig = {
  priorityBannerTitle: "Priority Banner",
  priorityBannerSubtitle: "Immediate operational focus for this customer",
  healthTitle: "Customer Health",
  healthSubtitle: "Cross-capability execution health without business calculations",
  readinessTitle: "Readiness Progress",
  readinessSubtitle: "Configuration-driven readiness milestones",
  workflowStatusTitle: "Workflow Status",
  workflowStatusSubtitle: "Current workflow posture for team coordination",
  nextActionTitle: "Next Best Action",
  nextActionSubtitle: "Single owner action to move customer execution forward",
  insightBridgeTitle: "AI Insights",
  insightBridgeSubtitle: "Recommendation feed prepared for future orchestration",
};

export const defaultWorkflowPanelModel: WorkflowPanelModel = {
  priorityBanner: {
    title: "Finalize compliance evidence to unblock approval progression",
    summary: "One high-priority dependency is preventing transition into final approval confirmation.",
    priority: "critical",
    recommendedAction: "Request refreshed compliance certificate",
    estimatedImpact: "Removes approval bottleneck and shortens funding readiness handoff",
  },
  health: [
    {
      id: "business-passport",
      label: "Business Passport",
      status: "Stable",
      progress: "82%",
      trend: "Improving",
    },
    {
      id: "documents",
      label: "Documents",
      status: "Attention",
      progress: "71%",
      trend: "Flat",
    },
    {
      id: "relationship",
      label: "Relationship",
      status: "Strong",
      progress: "86%",
      trend: "Improving",
    },
    {
      id: "approvals",
      label: "Approvals",
      status: "In Review",
      progress: "64%",
      trend: "Improving",
    },
    {
      id: "funding",
      label: "Funding",
      status: "In Progress",
      progress: "69%",
      trend: "Flat",
    },
  ],
  readiness: [
    {
      id: "readiness-1",
      title: "Customer context initialized",
      state: "Completed",
      detail: "Identity, relationship, and workflow shell are active.",
    },
    {
      id: "readiness-2",
      title: "Document quality review",
      state: "Review Required",
      detail: "Compliance artifact refresh still pending validation.",
    },
    {
      id: "readiness-3",
      title: "Approval package progression",
      state: "In Progress",
      detail: "Credit review feedback has been captured.",
    },
    {
      id: "readiness-4",
      title: "Funding release readiness",
      state: "Ready",
      detail: "Funding lane prepared once approvals close.",
    },
  ],
  workflowStatus: {
    currentPhase: "Approval and Funding Coordination",
    owner: "Relationship Operations",
    queueStatus: "Active",
    dueWindow: "Next 3 business days",
  },
  nextBestAction: {
    title: "Close compliance evidence checkpoint",
    description:
      "Coordinate between operations and compliance to attach the refreshed certificate and re-open final approval gate.",
    owner: "Operations Lead",
    priority: "high",
    actionLabel: "Open Evidence Checklist",
  },
  recommendations: defaultAiInsightsModel.recommendations,
};
