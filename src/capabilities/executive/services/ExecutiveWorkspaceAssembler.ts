import type { InstitutionalDigitalTwin } from "@/lib/runtime/InstitutionalDigitalTwin";
import type { InstitutionContext } from "@/lib/workspaces/InstitutionContext";
import type { InstitutionContextSummary } from "@/lib/workspaces/InstitutionContextSummary";
import type { ExecutiveWorkspaceViewModel } from "@/lib/workspaces/executiveWorkspaceViewModel";

function getInstitutionLabel(context: InstitutionContext, summary: InstitutionContextSummary): string {
  return context.institution.identity.displayName || summary.institutionName;
}

function getPassportStatus(context: InstitutionContext): string {
  return context.passport?.status ?? "unavailable";
}

function getHealthScore(context: InstitutionContext): string {
  return typeof context.health?.overallScore === "number"
    ? `${context.health.overallScore}`
    : "n/a";
}

function getExecutiveNarrative(context: InstitutionContext, summary: InstitutionContextSummary): string {
  return context.intelligence?.executiveSummary.narrative
    ?? `The live executive cockpit is assembled for ${summary.institutionName} with workflow progress ${summary.workflowProgress}.`;
}

function getPriorityDetail(summary: InstitutionContextSummary, context: InstitutionContext): string {
  const recommendation = context.intelligence?.recommendations[0]?.title;
  if (recommendation) {
    return recommendation;
  }

  return `Workflow progress is ${summary.workflowProgress} with ${summary.readyForApproval ? "approval ready" : "approval pending"} context.`;
}

export interface LiveExecutiveWorkspaceAssemblerInput {
  readonly institutionContext: InstitutionContext;
  readonly digitalTwin: InstitutionalDigitalTwin;
  readonly summary: InstitutionContextSummary;
  readonly approvalQueueSize: number;
}

export function createLiveExecutiveWorkspaceViewModel(
  input: LiveExecutiveWorkspaceAssemblerInput,
): ExecutiveWorkspaceViewModel {
  const institutionLabel = getInstitutionLabel(input.institutionContext, input.summary);

  return {
    greeting: `Good Morning, ${institutionLabel}.`,
    title: "Live Executive Cockpit",
    executiveBrief: `The executive cockpit is live with ${input.summary.workflowProgress} workflow progress, ${input.digitalTwin.permissions.granted.length} permissions, and ${input.summary.passportStatus ?? getPassportStatus(input.institutionContext)} passport status.`,
    kpis: [
      {
        label: "Institution",
        value: institutionLabel,
        detail: input.summary.jurisdiction,
      },
      {
        label: "Workflow Progress",
        value: input.summary.workflowProgress,
        detail: input.institutionContext.workflowStatus.workflowId ?? "Current runtime workflow",
      },
      {
        label: "Business Passport",
        value: input.summary.passportStatus ?? getPassportStatus(input.institutionContext),
        detail: input.institutionContext.passport?.lifecycle ?? "Live projection",
      },
      {
        label: "Institution Health",
        value: input.summary.healthStatus ?? getHealthScore(input.institutionContext),
        detail: input.institutionContext.health?.overallStatus ?? "Derived from live runtime",
      },
      {
        label: "Approval Queue",
        value: `${input.approvalQueueSize}`,
        detail: input.summary.readyForApproval ? "Ready for approval review" : "Linked to live workflow contexts",
      },
    ],
    aiChiefOfStaff: {
      title: "AI Chief of Staff",
      narrative: getExecutiveNarrative(input.institutionContext, input.summary),
    },
    todayPriority: {
      title: "Today's Priority",
      detail: getPriorityDetail(input.summary, input.institutionContext),
    },
    actions: [
      {
        label: "Review Live Queue",
        description: "Inspect the current workflow repository entries.",
        icon: "chart",
      },
      {
        label: "Open Institution Context",
        description: "See the canonical runtime institution aggregate.",
        icon: "sparkles",
      },
      {
        label: "Inspect Business Passport",
        description: "Review the live passport projection.",
        icon: "users",
      },
      {
        label: "Verify Permissions",
        description: "Confirm the active runtime access set.",
        icon: "message-square",
      },
    ],
  };
}