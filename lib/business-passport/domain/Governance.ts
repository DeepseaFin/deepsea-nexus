export enum GovernanceControlStatus {
  Compliant = "compliant",
  Monitor = "monitor",
  AttentionRequired = "attention_required",
}

export interface GovernanceControl {
  readonly controlCode: string;
  readonly status: GovernanceControlStatus;
  readonly ownerRole: string;
  readonly lastReviewedAt: string;
}

export interface GovernancePolicyAssessment {
  readonly policyCode: string;
  readonly policyVersion: string;
  readonly status: GovernanceControlStatus;
  readonly assessedAt: string;
}

export interface GovernanceDecisionTrail {
  readonly decisionId: string;
  readonly decisionType: string;
  readonly decisionAt: string;
  readonly decisionBy: string;
  readonly rationale: string;
}

export interface PassportGovernance {
  readonly controls: readonly GovernanceControl[];
  readonly policyAssessments: readonly GovernancePolicyAssessment[];
  readonly decisions: readonly GovernanceDecisionTrail[];
  readonly nextReviewAt?: string;
}
