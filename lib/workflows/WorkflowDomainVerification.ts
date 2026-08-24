import {
  createBusinessContext,
  createInMemoryWorkflowContextRepository,
  transitionBusinessContext,
} from "@/lib/workflows/WorkflowContext";
import { WorkflowEventType } from "@/lib/workflows/WorkflowEvent";
import { buildMockWorkflowTimeline } from "@/lib/workflows/WorkflowTimeline";
import {
  OpportunityLifecycle,
  canTransitionOpportunityLifecycle,
  createOpportunityLifecycleAuditEvent,
  getOpportunityLifecycleTransitions,
  transitionOpportunityLifecycle,
  transitionOpportunityLifecycleWithAudit,
} from "@/lib/workflows/WorkflowTransition";

export type WorkflowDomainVerificationCheckName =
  | "opportunity-lifecycle-transitions"
  | "invalid-transitions"
  | "reverse-transitions"
  | "immutable-audit-generation"
  | "business-context-propagation"
  | "workflow-repository-behavior"
  | "timeline-generation";

export interface WorkflowDomainVerificationCheckResult {
  readonly name: WorkflowDomainVerificationCheckName;
  readonly passed: boolean;
  readonly detail: string;
}

export interface WorkflowDomainVerificationReport {
  readonly passed: boolean;
  readonly checks: readonly WorkflowDomainVerificationCheckResult[];
}

export class WorkflowDomainVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkflowDomainVerificationError";
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new WorkflowDomainVerificationError(message);
  }
}

function verifyOpportunityLifecycleTransitions(): WorkflowDomainVerificationCheckResult {
  const expectedTransitions: Readonly<Record<OpportunityLifecycle, readonly OpportunityLifecycle[]>> = {
    [OpportunityLifecycle.DRAFT]: [OpportunityLifecycle.SUBMITTED],
    [OpportunityLifecycle.SUBMITTED]: [OpportunityLifecycle.UNDER_REVIEW],
    [OpportunityLifecycle.UNDER_REVIEW]: [
      OpportunityLifecycle.SUBMITTED,
      OpportunityLifecycle.APPROVED,
    ],
    [OpportunityLifecycle.APPROVED]: [
      OpportunityLifecycle.UNDER_REVIEW,
      OpportunityLifecycle.FUNDING_ALLOCATED,
    ],
    [OpportunityLifecycle.FUNDING_ALLOCATED]: [
      OpportunityLifecycle.APPROVED,
      OpportunityLifecycle.RELEASED_FOR_PURCHASE,
    ],
    [OpportunityLifecycle.RELEASED_FOR_PURCHASE]: [
      OpportunityLifecycle.FUNDING_ALLOCATED,
      OpportunityLifecycle.PURCHASED,
    ],
    [OpportunityLifecycle.PURCHASED]: [OpportunityLifecycle.SETTLING],
    [OpportunityLifecycle.SETTLING]: [OpportunityLifecycle.SETTLED],
    [OpportunityLifecycle.SETTLED]: [OpportunityLifecycle.CLOSED],
    [OpportunityLifecycle.CLOSED]: [],
  };

  for (const [from, expected] of Object.entries(expectedTransitions) as Array<[
    OpportunityLifecycle,
    readonly OpportunityLifecycle[],
  ]>) {
    const actual = getOpportunityLifecycleTransitions(from);
    assert(
      actual.length === expected.length
      && actual.every((lifecycle) => expected.includes(lifecycle)),
      `Expected transitions for ${from} to match configured workflow contract.`,
    );

    for (const to of actual) {
      assert(
        transitionOpportunityLifecycle(from, to) === to,
        `Expected transition from ${from} to ${to} to succeed.`,
      );
    }
  }

  return {
    name: "opportunity-lifecycle-transitions",
    passed: true,
    detail: "Forward and controlled transition map is valid and executable.",
  };
}

function verifyInvalidTransitions(): WorkflowDomainVerificationCheckResult {
  const invalidTransitions: ReadonlyArray<readonly [OpportunityLifecycle, OpportunityLifecycle]> = [
    [OpportunityLifecycle.DRAFT, OpportunityLifecycle.UNDER_REVIEW],
    [OpportunityLifecycle.SUBMITTED, OpportunityLifecycle.APPROVED],
    [OpportunityLifecycle.APPROVED, OpportunityLifecycle.RELEASED_FOR_PURCHASE],
    [OpportunityLifecycle.CLOSED, OpportunityLifecycle.SETTLED],
  ];

  for (const [from, to] of invalidTransitions) {
    assert(
      !canTransitionOpportunityLifecycle(from, to),
      `Transition from ${from} to ${to} must be rejected by guard logic.`,
    );

    let thrown = false;
    try {
      transitionOpportunityLifecycle(from, to);
    } catch {
      thrown = true;
    }

    assert(
      thrown,
      `Transition from ${from} to ${to} must throw for invalid transition protection.`,
    );
  }

  return {
    name: "invalid-transitions",
    passed: true,
    detail: "Invalid transitions are guarded and throw deterministically.",
  };
}

function verifyReverseTransitions(): WorkflowDomainVerificationCheckResult {
  const reverseTransitions: ReadonlyArray<readonly [OpportunityLifecycle, OpportunityLifecycle]> = [
    [OpportunityLifecycle.UNDER_REVIEW, OpportunityLifecycle.SUBMITTED],
    [OpportunityLifecycle.APPROVED, OpportunityLifecycle.UNDER_REVIEW],
    [OpportunityLifecycle.FUNDING_ALLOCATED, OpportunityLifecycle.APPROVED],
    [OpportunityLifecycle.RELEASED_FOR_PURCHASE, OpportunityLifecycle.FUNDING_ALLOCATED],
  ];

  for (const [from, to] of reverseTransitions) {
    assert(
      canTransitionOpportunityLifecycle(from, to),
      `Reverse transition from ${from} to ${to} must be explicitly allowed.`,
    );

    const transitioned = transitionOpportunityLifecycle(from, to);
    assert(
      transitioned === to,
      `Reverse transition from ${from} to ${to} must resolve to ${to}.`,
    );
  }

  return {
    name: "reverse-transitions",
    passed: true,
    detail: "Controlled reverse transitions execute through existing lifecycle helper.",
  };
}

function verifyImmutableAuditGeneration(): WorkflowDomainVerificationCheckResult {
  const reverseAudit = transitionOpportunityLifecycleWithAudit({
    workflowId: "WF-VERIFY",
    executionId: "EX-VERIFY",
    opportunityId: "OPP-VERIFY",
    institutionId: "INS-VERIFY",
    from: OpportunityLifecycle.APPROVED,
    to: OpportunityLifecycle.UNDER_REVIEW,
    actor: "verification-runner",
    occurredAt: "2026-07-15T00:00:00.000Z",
  }).auditEvent;

  const explicitAudit = createOpportunityLifecycleAuditEvent({
    workflowId: "WF-VERIFY",
    executionId: "EX-VERIFY",
    opportunityId: "OPP-VERIFY",
    institutionId: "INS-VERIFY",
    previousLifecycle: OpportunityLifecycle.FUNDING_ALLOCATED,
    currentLifecycle: OpportunityLifecycle.APPROVED,
    actor: "verification-runner",
    occurredAt: "2026-07-15T00:10:00.000Z",
    remarks: "Reverse review requested by treasury.",
  });

  assert(Object.isFrozen(reverseAudit), "Audit event object must be immutable.");
  assert(Object.isFrozen(reverseAudit.metadata), "Audit metadata must be immutable.");
  assert(
    reverseAudit.type === WorkflowEventType.OpportunityLifecycleTransitioned,
    "Audit event must use opportunity lifecycle transitioned event type.",
  );
  assert(
    reverseAudit.metadata.transitionDirection === "reverse",
    "Reverse transition must be tagged as reverse in metadata.",
  );
  assert(
    reverseAudit.message !== null && reverseAudit.message.length > 0,
    "Audit event must include non-empty remarks message.",
  );
  assert(
    explicitAudit.remarks === "Reverse review requested by treasury.",
    "Explicit remarks must be preserved in audit event.",
  );

  return {
    name: "immutable-audit-generation",
    passed: true,
    detail: "Audit events are immutable and include direction-aware metadata.",
  };
}

function verifyBusinessContextPropagation(): WorkflowDomainVerificationCheckResult {
  const initial = createBusinessContext({
    institutionId: "INS-VERIFY",
    opportunityId: "OPP-VERIFY",
    workflowId: "WF-VERIFY",
    opportunityLifecycle: OpportunityLifecycle.APPROVED,
    currentOwner: "Executive Desk",
    currentWorkspace: "executive",
  });

  const reversed = transitionBusinessContext({
    context: initial,
    toLifecycle: OpportunityLifecycle.UNDER_REVIEW,
    toWorkspace: "executive",
    nextOwner: "Executive Desk",
  });

  assert(
    reversed.institutionId === initial.institutionId,
    "BusinessContext must retain institutionId across transitions.",
  );
  assert(
    reversed.opportunityId === initial.opportunityId,
    "BusinessContext must retain opportunityId across transitions.",
  );
  assert(
    reversed.workflowId === initial.workflowId,
    "BusinessContext must retain workflowId across transitions.",
  );
  assert(
    reversed.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW,
    "BusinessContext lifecycle must reflect target reverse transition.",
  );
  assert(
    reversed.currentWorkspace === "executive",
    "BusinessContext workspace must propagate requested workspace.",
  );

  return {
    name: "business-context-propagation",
    passed: true,
    detail: "BusinessContext propagates identity fields while applying lifecycle/workspace changes.",
  };
}

function verifyWorkflowRepositoryBehavior(): WorkflowDomainVerificationCheckResult {
  const repository = createInMemoryWorkflowContextRepository();
  const initial = createBusinessContext({
    institutionId: "INS-VERIFY",
    opportunityId: "OPP-VERIFY",
    workflowId: "WF-VERIFY",
    opportunityLifecycle: OpportunityLifecycle.SUBMITTED,
    currentOwner: "RM",
    currentWorkspace: "commercial",
  });
  const updated = createBusinessContext({
    ...initial,
    opportunityLifecycle: OpportunityLifecycle.UNDER_REVIEW,
    currentOwner: "Executive Desk",
    currentWorkspace: "executive",
  });

  repository.save(initial);
  const firstFetch = repository.findByWorkflowId(initial.workflowId);
  assert(firstFetch !== undefined, "Repository must return saved workflow context.");
  assert(
    repository.list().length === 1,
    "Repository list must contain exactly one context after initial save.",
  );

  repository.save(updated);
  const secondFetch = repository.findByWorkflowId(initial.workflowId);
  assert(secondFetch !== undefined, "Repository must return updated context by workflowId.");
  assert(
    secondFetch?.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW,
    "Repository save must overwrite existing workflow key with latest context.",
  );
  assert(
    repository.list().length === 1,
    "Repository overwrite must not duplicate entries for same workflowId.",
  );

  return {
    name: "workflow-repository-behavior",
    passed: true,
    detail: "In-memory repository supports save/find/list with overwrite semantics by workflowId.",
  };
}

function verifyTimelineGeneration(): WorkflowDomainVerificationCheckResult {
  const timeline = buildMockWorkflowTimeline({
    workflowId: "WF-VERIFY",
    executionId: "EX-VERIFY",
    institutionName: "INS-VERIFY",
    opportunityReference: "OPP-VERIFY",
    fundingAmount: "USD 1,000,000",
    submittedBy: "RM",
    baseDate: "2026-07-15T08:00:00Z",
  });

  assert(timeline.events.length > 0, "Timeline must generate at least one event.");

  const lifecycleEvents = timeline.events.filter(
    (event) => event.type === WorkflowEventType.OpportunityLifecycleTransitioned,
  );
  assert(
    lifecycleEvents.length > 0,
    "Timeline must include lifecycle audit events generated by transition helper.",
  );

  const hasReverse = lifecycleEvents.some(
    (event) => event.metadata.transitionDirection === "reverse",
  );
  assert(
    hasReverse,
    "Timeline must include at least one reverse lifecycle transition event.",
  );

  const allChronological = timeline.events.every((event, index, events) => {
    if (index === 0) {
      return true;
    }

    return Date.parse(events[index - 1].occurredAt) <= Date.parse(event.occurredAt);
  });
  assert(
    allChronological,
    "Timeline events must be generated in non-decreasing chronological order.",
  );

  return {
    name: "timeline-generation",
    passed: true,
    detail: "Timeline generation produces chronological lifecycle events including reverse transitions.",
  };
}

function runCheck(
  name: WorkflowDomainVerificationCheckName,
  verify: () => WorkflowDomainVerificationCheckResult,
): WorkflowDomainVerificationCheckResult {
  try {
    return verify();
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown verification error.";
    return {
      name,
      passed: false,
      detail,
    };
  }
}

export function runWorkflowDomainVerificationSuite(): WorkflowDomainVerificationReport {
  const checks: readonly WorkflowDomainVerificationCheckResult[] = [
    runCheck("opportunity-lifecycle-transitions", verifyOpportunityLifecycleTransitions),
    runCheck("invalid-transitions", verifyInvalidTransitions),
    runCheck("reverse-transitions", verifyReverseTransitions),
    runCheck("immutable-audit-generation", verifyImmutableAuditGeneration),
    runCheck("business-context-propagation", verifyBusinessContextPropagation),
    runCheck("workflow-repository-behavior", verifyWorkflowRepositoryBehavior),
    runCheck("timeline-generation", verifyTimelineGeneration),
  ];

  return {
    passed: checks.every((check) => check.passed),
    checks,
  };
}
