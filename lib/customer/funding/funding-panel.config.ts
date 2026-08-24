import { WorkflowEventType, type WorkflowEvent } from "@/lib/workflows/WorkflowEvent";
import { WorkflowStep } from "@/lib/workflows/WorkflowStep";
import type { FundingPanelConfig, FundingPanelModel } from "@/lib/customer/funding/funding-panel.types";

export const fundingPanelConfig: FundingPanelConfig = {
  title: "Funding Workspace",
  subtitle: "Funding capability composition layer for the active customer",
  workspaceLabel: "Customer Funding Surface",
  summaryTitle: "Facility Summary",
  summarySubtitle: "Funding amounts and facility posture from upstream capability projections",
  readinessTitle: "Funding Readiness",
  readinessSubtitle: "Configurable readiness state and confidence context",
  overviewTitle: "Facility Overview",
  overviewSubtitle: "Facilities available for this customer context",
  timelineTitle: "Funding Timeline",
  timelineSubtitle: "Generic funding events prepared for future funding engine integration",
  actionsTitle: "Available Actions",
  actionsSubtitle: "Configuration-driven funding actions with no workflow logic",
};

const defaultFundingTimelineEvents: readonly WorkflowEvent[] = [
  {
    eventId: "fund-evt-1",
    workflowId: "customer-funding",
    executionId: "exec-funding-001",
    type: WorkflowEventType.OpportunityLifecycleTransitioned,
    step: null,
    occurredAt: "2026-07-21T10:00:00.000Z",
    actorId: "relationship-manager",
    message: "Funding request submitted for institutional review.",
    metadata: {
      eventLabel: "Submitted",
      facility: "Working Capital Line",
    },
  },
  {
    eventId: "fund-evt-2",
    workflowId: "customer-funding",
    executionId: "exec-funding-001",
    type: WorkflowEventType.StepCompleted,
    step: WorkflowStep.Oracle,
    occurredAt: "2026-07-22T09:20:00.000Z",
    actorId: "oracle-engine",
    message: "Document checks completed for funding package.",
    metadata: {
      eventLabel: "Document Checks",
      source: "ORACLE",
    },
  },
  {
    eventId: "fund-evt-3",
    workflowId: "customer-funding",
    executionId: "exec-funding-001",
    type: WorkflowEventType.Transitioned,
    step: WorkflowStep.Journey,
    occurredAt: "2026-07-23T14:15:00.000Z",
    actorId: "credit-committee",
    message: "Funding moved to readiness review with conditional guidance.",
    metadata: {
      eventLabel: "Readiness Review",
      condition: "conditional",
    },
  },
];

export const defaultFundingPanelModel: FundingPanelModel = {
  summary: {
    requestedAmount: "4,500,000",
    approvedAmount: "3,600,000",
    availableLimit: "1,200,000",
    utilizedAmount: "2,400,000",
    currency: "USD",
    facilityStatus: "In Review",
  },
  readiness: {
    state: "In Progress",
    confidence: "High",
    trend: "Improving",
    lastUpdated: "2026-07-24T08:40:00.000Z",
    notes: [
      "Awaiting final compliance attachments.",
      "Credit review feedback already incorporated.",
    ],
  },
  facilities: [
    {
      id: "facility-1",
      facilityName: "Primary Working Capital Line",
      facilityType: "Revolving",
      status: "Active",
      limit: "5,000,000",
      utilized: "2,400,000",
      assessment: {
        recommendedFacility: "Working Capital Line",
        advanceRate: "76%",
        riskLevel: "MEDIUM",
        turnaround: "3-5 business days",
        recommendation:
          "Proceed with phased utilization and maintain evidence refresh cadence for governance continuity.",
      },
    },
    {
      id: "facility-2",
      facilityName: "Receivables Bridge Facility",
      facilityType: "Receivables",
      status: "Planned",
      limit: "2,000,000",
      utilized: "0",
    },
  ],
  timeline: defaultFundingTimelineEvents,
  actions: [
    {
      id: "fund-action-1",
      label: "Prepare Funding",
      description: "Prepare the funding package for the next review checkpoint.",
    },
    {
      id: "fund-action-2",
      label: "Generate Facility Letter",
      description: "Create a facility summary letter artifact.",
    },
    {
      id: "fund-action-3",
      label: "View Documents",
      description: "Open the linked document intelligence context.",
    },
    {
      id: "fund-action-4",
      label: "Export Summary",
      description: "Export funding summary for stakeholder circulation.",
    },
  ],
};
