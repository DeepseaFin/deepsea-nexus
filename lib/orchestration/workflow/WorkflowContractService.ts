import type { WorkflowContract } from "@/lib/orchestration/workflow/WorkflowContract";
import { WorkflowApprovalRequirement } from "@/lib/orchestration/workflow/WorkflowApprovalRequirement";
import { WorkflowStage } from "@/lib/orchestration/workflow/WorkflowStage";
import type { WorkflowTransition } from "@/lib/orchestration/workflow/WorkflowTransition";
import { WorkflowState } from "@/lib/orchestration/workflow/WorkflowState";

export interface WorkflowValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly transitionIndex?: number;
}

export interface WorkflowValidationResult {
  readonly valid: boolean;
  readonly issues: readonly WorkflowValidationIssue[];
}

export interface WorkflowContractService {
  getWorkflowContract(): WorkflowContract;
  validateTransitions(contract?: WorkflowContract): WorkflowValidationResult;
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  const properties = Object.getOwnPropertyNames(value);

  for (const property of properties) {
    const propertyValue = (value as Record<string, unknown>)[property];

    if (propertyValue !== null && (typeof propertyValue === "object" || typeof propertyValue === "function")) {
      deepFreeze(propertyValue);
    }
  }

  return Object.freeze(value);
}

const DEFAULT_WORKFLOW_CONTRACT: WorkflowContract = deepFreeze({
  workflowId: "institutional-workflow",
  workflowVersion: "1.0.0",
  stages: [
    WorkflowStage.Intake,
    WorkflowStage.EvidenceCollection,
    WorkflowStage.KnowledgeExtraction,
    WorkflowStage.InstitutionalAssessment,
    WorkflowStage.ComplianceReview,
    WorkflowStage.CreditAssessment,
    WorkflowStage.RelationshipReview,
    WorkflowStage.Approval,
    WorkflowStage.Completed,
  ],
  transitions: [
    {
      fromStage: WorkflowStage.Intake,
      toStage: WorkflowStage.EvidenceCollection,
      allowedStates: [WorkflowState.NotStarted, WorkflowState.InProgress],
      approvalRequirements: [WorkflowApprovalRequirement.Operations],
      transitionConditions: [
        {
          conditionId: "intake-context-ready",
          description: "Institutional intake context is captured.",
          metadata: {
            source: "metadata-only",
          },
        },
      ],
    },
    {
      fromStage: WorkflowStage.EvidenceCollection,
      toStage: WorkflowStage.KnowledgeExtraction,
      allowedStates: [WorkflowState.InProgress, WorkflowState.Completed],
      approvalRequirements: [WorkflowApprovalRequirement.Operations],
      transitionConditions: [
        {
          conditionId: "evidence-minimum-collected",
          description: "Baseline evidence references are available.",
        },
      ],
    },
    {
      fromStage: WorkflowStage.KnowledgeExtraction,
      toStage: WorkflowStage.InstitutionalAssessment,
      allowedStates: [WorkflowState.InProgress, WorkflowState.Completed],
      approvalRequirements: [WorkflowApprovalRequirement.Operations],
      transitionConditions: [
        {
          conditionId: "knowledge-facts-available",
          description: "Extracted knowledge facts are available for downstream interpretation.",
        },
      ],
    },
    {
      fromStage: WorkflowStage.InstitutionalAssessment,
      toStage: WorkflowStage.ComplianceReview,
      allowedStates: [WorkflowState.InProgress, WorkflowState.Completed],
      approvalRequirements: [WorkflowApprovalRequirement.Compliance],
      transitionConditions: [
        {
          conditionId: "assessment-package-ready",
          description: "Institutional assessment artifacts are packaged.",
        },
      ],
    },
    {
      fromStage: WorkflowStage.ComplianceReview,
      toStage: WorkflowStage.CreditAssessment,
      allowedStates: [WorkflowState.AwaitingApproval, WorkflowState.Completed],
      approvalRequirements: [WorkflowApprovalRequirement.Compliance],
      transitionConditions: [
        {
          conditionId: "compliance-review-acknowledged",
          description: "Compliance review state is acknowledged.",
        },
      ],
    },
    {
      fromStage: WorkflowStage.CreditAssessment,
      toStage: WorkflowStage.RelationshipReview,
      allowedStates: [WorkflowState.AwaitingApproval, WorkflowState.Completed],
      approvalRequirements: [WorkflowApprovalRequirement.Credit],
      transitionConditions: [
        {
          conditionId: "credit-assessment-recorded",
          description: "Credit assessment outputs are available.",
        },
      ],
    },
    {
      fromStage: WorkflowStage.RelationshipReview,
      toStage: WorkflowStage.Approval,
      allowedStates: [WorkflowState.AwaitingApproval, WorkflowState.Completed],
      approvalRequirements: [WorkflowApprovalRequirement.RelationshipManager],
      transitionConditions: [
        {
          conditionId: "relationship-review-complete",
          description: "Relationship review commentary has been captured.",
        },
      ],
    },
    {
      fromStage: WorkflowStage.Approval,
      toStage: WorkflowStage.Completed,
      allowedStates: [WorkflowState.AwaitingApproval, WorkflowState.Completed],
      approvalRequirements: [WorkflowApprovalRequirement.ExecutiveApproval],
      transitionConditions: [
        {
          conditionId: "final-approval-recorded",
          description: "Final approval metadata is recorded.",
        },
      ],
    },
  ],
  approvalRequirements: [
    WorkflowApprovalRequirement.Compliance,
    WorkflowApprovalRequirement.Credit,
    WorkflowApprovalRequirement.RelationshipManager,
    WorkflowApprovalRequirement.Operations,
    WorkflowApprovalRequirement.ExecutiveApproval,
  ],
  metadata: {
    name: "Institutional Workflow Contract",
    description: "Canonical workflow structure for institutional processing lifecycle.",
    owner: "Orchestration",
    tags: ["workflow", "contract", "institutional"],
    additional: {
      model: "definition-only",
      execution: "disabled",
    },
  },
});

function validateTransition(
  transition: WorkflowTransition,
  transitionIndex: number,
  contract: WorkflowContract,
): readonly WorkflowValidationIssue[] {
  const issues: WorkflowValidationIssue[] = [];

  if (!contract.stages.includes(transition.fromStage)) {
    issues.push({
      code: "INVALID_FROM_STAGE",
      message: `Transition references unknown fromStage ${transition.fromStage}.`,
      transitionIndex,
    });
  }

  if (!contract.stages.includes(transition.toStage)) {
    issues.push({
      code: "INVALID_TO_STAGE",
      message: `Transition references unknown toStage ${transition.toStage}.`,
      transitionIndex,
    });
  }

  if (transition.fromStage === transition.toStage) {
    issues.push({
      code: "SELF_TRANSITION_NOT_ALLOWED",
      message: "Transition fromStage and toStage must be different.",
      transitionIndex,
    });
  }

  if (transition.allowedStates.length === 0) {
    issues.push({
      code: "MISSING_ALLOWED_STATES",
      message: "Transition must define at least one allowed state.",
      transitionIndex,
    });
  }

  if (transition.approvalRequirements.length === 0) {
    issues.push({
      code: "MISSING_APPROVAL_REQUIREMENTS",
      message: "Transition must define at least one approval requirement.",
      transitionIndex,
    });
  }

  for (const requirement of transition.approvalRequirements) {
    if (!contract.approvalRequirements.includes(requirement)) {
      issues.push({
        code: "UNKNOWN_APPROVAL_REQUIREMENT",
        message: `Transition references unknown approval requirement ${requirement}.`,
        transitionIndex,
      });
    }
  }

  const conditionIds = transition.transitionConditions.map((condition) => condition.conditionId);
  const uniqueConditionIds = new Set(conditionIds);

  if (uniqueConditionIds.size !== conditionIds.length) {
    issues.push({
      code: "DUPLICATE_TRANSITION_CONDITION_ID",
      message: "Transition contains duplicate transition condition ids.",
      transitionIndex,
    });
  }

  return issues;
}

export class DefaultWorkflowContractService implements WorkflowContractService {
  getWorkflowContract(): WorkflowContract {
    return DEFAULT_WORKFLOW_CONTRACT;
  }

  validateTransitions(contract: WorkflowContract = DEFAULT_WORKFLOW_CONTRACT): WorkflowValidationResult {
    const issues: WorkflowValidationIssue[] = [];
    const stageSet = new Set(contract.stages);

    if (stageSet.size !== contract.stages.length) {
      issues.push({
        code: "DUPLICATE_STAGE",
        message: "Workflow contract contains duplicate stage entries.",
      });
    }

    const approvalSet = new Set(contract.approvalRequirements);

    if (approvalSet.size !== contract.approvalRequirements.length) {
      issues.push({
        code: "DUPLICATE_APPROVAL_REQUIREMENT",
        message: "Workflow contract contains duplicate approval requirement entries.",
      });
    }

    contract.transitions.forEach((transition, index) => {
      issues.push(...validateTransition(transition, index, contract));
    });

    return deepFreeze({
      valid: issues.length === 0,
      issues,
    });
  }
}

export const workflowContractService: WorkflowContractService = new DefaultWorkflowContractService();
