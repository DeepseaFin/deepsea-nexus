import {
  createBusinessContext,
  transitionBusinessContext,
  type BusinessContext,
  serializeBusinessContext,
  workflowContextRepository,
} from "@/lib/workflows/WorkflowContext";
import { OpportunityLifecycle } from "@/lib/workflows/WorkflowTransition";
import {
  buildMockWorkflowEvents,
  buildMockWorkflowTimeline,
  type WorkflowTimeline,
} from "@/lib/workflows/WorkflowTimeline";
import {
  WorkflowEventType,
  type OpportunityLifecycleAuditEvent,
  type WorkflowEvent,
} from "@/lib/workflows/WorkflowEvent";

export enum DemoScenarioId {
  InstitutionOnboardingToForfaitting = "institution-onboarding-to-forfaitting",
}

export interface DemoScenario {
  readonly id: DemoScenarioId;
  readonly name: string;
  readonly institutionName: string;
  readonly opportunityId: string;
  readonly fundingAmount: string;
  readonly contexts: {
    readonly commercial: BusinessContext;
    readonly executive: BusinessContext;
    readonly treasury: BusinessContext;
    readonly forfaitting: BusinessContext;
  };
  readonly timeline: WorkflowTimeline;
}

function buildInstitutionOnboardingToForfaittingScenario(): DemoScenario {
  const commercial = createBusinessContext({
    institutionId: "INS-AL-NOOR",
    opportunityId: "OPP-7712",
    workflowId: "COM-ORIG-9001",
    opportunityLifecycle: OpportunityLifecycle.DRAFT,
    currentOwner: "Relationship Manager",
    currentWorkspace: "commercial",
  });

  const submitted = transitionBusinessContext({
    context: commercial,
    toLifecycle: OpportunityLifecycle.SUBMITTED,
    toWorkspace: "commercial",
    nextOwner: "Relationship Manager",
  });

  const executive = transitionBusinessContext({
    context: submitted,
    toLifecycle: OpportunityLifecycle.UNDER_REVIEW,
    toWorkspace: "executive",
    nextOwner: "Executive Credit Committee",
  });

  const approved = transitionBusinessContext({
    context: executive,
    toLifecycle: OpportunityLifecycle.APPROVED,
    toWorkspace: "executive",
    nextOwner: "Executive Credit Committee",
  });

  const treasury = transitionBusinessContext({
    context: approved,
    toLifecycle: OpportunityLifecycle.FUNDING_ALLOCATED,
    toWorkspace: "treasury",
    nextOwner: "Treasury Desk",
  });

  const released = transitionBusinessContext({
    context: treasury,
    toLifecycle: OpportunityLifecycle.RELEASED_FOR_PURCHASE,
    toWorkspace: "forfaitting",
    nextOwner: "Forfaitting Desk",
    receivableId: treasury.opportunityId,
  });

  const forfaitting = transitionBusinessContext({
    context: released,
    toLifecycle: OpportunityLifecycle.PURCHASED,
    toWorkspace: "forfaitting",
    nextOwner: "Forfaitting Desk",
    receivableId: treasury.opportunityId,
  });

  return {
    id: DemoScenarioId.InstitutionOnboardingToForfaitting,
    name: "Institution Onboarding to Forfaitting Purchase",
    institutionName: "Al Noor Trading LLC",
    opportunityId: commercial.opportunityId,
    fundingAmount: "USD 6,200,000",
    contexts: {
      commercial,
      executive,
      treasury,
      forfaitting,
    },
    timeline: buildMockWorkflowTimeline({
      workflowId: commercial.workflowId,
      executionId: "EXEC-PS01-DEMO",
      institutionName: "Al Noor Trading LLC",
      opportunityReference: commercial.opportunityId,
      fundingAmount: "USD 6,200,000",
      submittedBy: "Relationship Manager",
      baseDate: "2026-07-15T08:00:00Z",
    }),
  };
}

export function getDemoScenario(id: string | undefined): DemoScenario | undefined {
  if (id !== DemoScenarioId.InstitutionOnboardingToForfaitting) {
    return undefined;
  }

  return buildInstitutionOnboardingToForfaittingScenario();
}

function buildOperationsCenterContexts(): readonly BusinessContext[] {
  const scenario = buildInstitutionOnboardingToForfaittingScenario();

  const submittedOnly = createBusinessContext({
    institutionId: "INS-CRESCENT-44",
    opportunityId: "OPP-8801",
    workflowId: "COM-ORIG-9102",
    opportunityLifecycle: OpportunityLifecycle.SUBMITTED,
    currentOwner: "Relationship Manager",
    currentWorkspace: "commercial",
  });

  const underReview = createBusinessContext({
    institutionId: "INS-FALCON-72",
    opportunityId: "OPP-8802",
    workflowId: "COM-ORIG-9103",
    opportunityLifecycle: OpportunityLifecycle.UNDER_REVIEW,
    currentOwner: "Executive Credit Committee",
    currentWorkspace: "executive",
  });

  const fundingAllocated = createBusinessContext({
    institutionId: "INS-SUMMIT-56",
    opportunityId: "OPP-8803",
    workflowId: "COM-ORIG-9104",
    opportunityLifecycle: OpportunityLifecycle.FUNDING_ALLOCATED,
    currentOwner: "Treasury Desk",
    currentWorkspace: "treasury",
  });

  const releasedForPurchase = createBusinessContext({
    institutionId: "INS-BLUEHORIZON-18",
    opportunityId: "OPP-8804",
    workflowId: "COM-ORIG-9105",
    receivableId: "RCV-8804",
    opportunityLifecycle: OpportunityLifecycle.RELEASED_FOR_PURCHASE,
    currentOwner: "Forfaitting Desk",
    currentWorkspace: "forfaitting",
  });

  const settling = createBusinessContext({
    institutionId: "INS-APEX-20",
    opportunityId: "OPP-8805",
    workflowId: "COM-ORIG-9106",
    receivableId: "RCV-8805",
    opportunityLifecycle: OpportunityLifecycle.SETTLING,
    currentOwner: "Settlement Control",
    currentWorkspace: "forfaitting",
  });

  const settled = createBusinessContext({
    institutionId: "INS-GULF-31",
    opportunityId: "OPP-8806",
    workflowId: "COM-ORIG-9107",
    receivableId: "RCV-8806",
    opportunityLifecycle: OpportunityLifecycle.SETTLED,
    currentOwner: "Compliance Control",
    currentWorkspace: "forfaitting",
  });

  const closed = createBusinessContext({
    institutionId: "INS-NORTHERN-88",
    opportunityId: "OPP-8807",
    workflowId: "COM-ORIG-9108",
    receivableId: "RCV-8807",
    opportunityLifecycle: OpportunityLifecycle.CLOSED,
    currentOwner: "Compliance Control",
    currentWorkspace: "forfaitting",
  });

  return [
    scenario.contexts.commercial,
    scenario.contexts.executive,
    scenario.contexts.treasury,
    scenario.contexts.forfaitting,
    submittedOnly,
    underReview,
    fundingAllocated,
    releasedForPurchase,
    settling,
    settled,
    closed,
  ];
}

export function seedOperationsCenterRepository(): readonly BusinessContext[] {
  const contexts = buildOperationsCenterContexts();
  contexts.forEach((context) => {
    workflowContextRepository.save(context);
  });

  return workflowContextRepository.list();
}

export function getOperationsCenterContexts(): readonly BusinessContext[] {
  const contexts = workflowContextRepository.list();
  if (contexts.length > 0) {
    return contexts;
  }

  return seedOperationsCenterRepository();
}

export function getOperationsCenterAuditEvents(): readonly OpportunityLifecycleAuditEvent[] {
  const scenario = buildInstitutionOnboardingToForfaittingScenario();
  return scenario.timeline.events.filter(
    (event): event is OpportunityLifecycleAuditEvent =>
      event.type === WorkflowEventType.OpportunityLifecycleTransitioned,
  );
}

export function getOperationsNotificationEvents(): readonly WorkflowEvent[] {
  const contexts = getOperationsCenterContexts();
  return contexts.flatMap((context) => buildMockWorkflowEvents({
    workflowId: context.workflowId,
    executionId: `EXEC-${context.workflowId}`,
    institutionName: context.institutionId,
    opportunityReference: context.opportunityId,
  }));
}

export function mapLifecycleToWorkspaceHref(context: BusinessContext): string {
  if (context.opportunityLifecycle === OpportunityLifecycle.DRAFT || context.opportunityLifecycle === OpportunityLifecycle.SUBMITTED) {
    return `/atlas/commercial?workflowId=${context.workflowId}`;
  }

  if (
    context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW
    || context.opportunityLifecycle === OpportunityLifecycle.APPROVED
  ) {
    return `/executive?workflowId=${context.workflowId}&businessContext=${serializeBusinessContext(context)}`;
  }

  if (context.opportunityLifecycle === OpportunityLifecycle.FUNDING_ALLOCATED) {
    return `/atlas/treasury?workflowId=${context.workflowId}&businessContext=${serializeBusinessContext(context)}`;
  }

  return `/atlas/forfaiting?workflowId=${context.workflowId}&businessContext=${serializeBusinessContext(context)}`;
}
