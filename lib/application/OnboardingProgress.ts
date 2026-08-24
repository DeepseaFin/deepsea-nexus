import type { NextBestActionModel } from "@/lib/customer/workflow/workflow.types";

export type OnboardingStageId =
  | "business-passport"
  | "documents"
  | "approvals"
  | "funding"
  | "relationship"
  | "active";

export interface OnboardingStageProgress {
  readonly id: OnboardingStageId;
  readonly label: string;
  readonly completed: boolean;
  readonly blocked: boolean;
}

export interface OnboardingProgressModel {
  readonly overallCompletionPercent: number;
  readonly completedStages: readonly OnboardingStageProgress[];
  readonly currentStage: OnboardingStageProgress;
  readonly blockedStages: readonly OnboardingStageProgress[];
  readonly recommendedNextStage: OnboardingStageProgress;
  readonly recommendedAction: NextBestActionModel | null;
}

export interface OnboardingProgressSource {
  readonly businessPassportState: "incomplete" | "ready" | "unknown";
  readonly documentState: "missing-mandatory" | "ready" | "unknown";
  readonly approvalState: "pending" | "completed" | "rejected" | "unknown";
  readonly fundingState: "readiness-pending" | "readiness-ready" | "unknown";
  readonly relationshipState: "follow-up-due" | "stable" | "unknown";
}

const STAGE_LABELS: Readonly<Record<OnboardingStageId, string>> = {
  "business-passport": "Business Passport",
  documents: "Documents",
  approvals: "Approvals",
  funding: "Funding Readiness",
  relationship: "Relationship Follow-up",
  active: "Active Operations",
};

function stageProgress(source: OnboardingProgressSource): readonly OnboardingStageProgress[] {
  return [
    {
      id: "business-passport",
      label: STAGE_LABELS["business-passport"],
      completed: source.businessPassportState === "ready",
      blocked: source.businessPassportState === "incomplete",
    },
    {
      id: "documents",
      label: STAGE_LABELS.documents,
      completed: source.documentState === "ready",
      blocked: source.documentState === "missing-mandatory",
    },
    {
      id: "approvals",
      label: STAGE_LABELS.approvals,
      completed: source.approvalState === "completed",
      blocked: source.approvalState === "pending" || source.approvalState === "rejected",
    },
    {
      id: "funding",
      label: STAGE_LABELS.funding,
      completed: source.fundingState === "readiness-ready",
      blocked: source.fundingState === "readiness-pending",
    },
    {
      id: "relationship",
      label: STAGE_LABELS.relationship,
      completed: source.relationshipState === "stable",
      blocked: source.relationshipState === "follow-up-due",
    },
  ];
}

function recommendedActionForStage(stage: OnboardingStageProgress): NextBestActionModel {
  if (stage.id === "business-passport") {
    return {
      title: "Complete Business Passport profile",
      description: "Resolve incomplete Business Passport state before progressing onboarding.",
      owner: "Relationship Operations",
      priority: "high",
      actionLabel: "Open Business Passport",
    };
  }

  if (stage.id === "documents") {
    return {
      title: "Resolve mandatory document gaps",
      description: "Address missing mandatory documents to unblock onboarding progression.",
      owner: "Document Operations",
      priority: "critical",
      actionLabel: "Open Documents",
    };
  }

  if (stage.id === "approvals") {
    return {
      title: "Advance approval decision",
      description: "Move the current approval stage to completion to continue onboarding.",
      owner: "Approvals Team",
      priority: "high",
      actionLabel: "Open Approvals",
    };
  }

  if (stage.id === "funding") {
    return {
      title: "Improve funding readiness",
      description: "Close funding readiness dependencies to reach release state.",
      owner: "Funding Operations",
      priority: "medium",
      actionLabel: "Open Funding",
    };
  }

  if (stage.id === "relationship") {
    return {
      title: "Complete relationship follow-up",
      description: "Clear follow-up obligations to stabilize relationship onboarding.",
      owner: "Relationship Manager",
      priority: "medium",
      actionLabel: "Open Relationship",
    };
  }

  return {
    title: "Continue customer execution",
    description: "All onboarding stages are clear. Continue with active customer operations.",
    owner: "Operations",
    priority: "low",
    actionLabel: "Open Workspace",
  };
}

export function composeOnboardingProgress(source: OnboardingProgressSource): OnboardingProgressModel {
  const stages = stageProgress(source);
  const completedStages = stages.filter((stage) => stage.completed);
  const blockedStages = stages.filter((stage) => stage.blocked);
  const currentStage = blockedStages[0] ?? stages.find((stage) => !stage.completed) ?? {
    id: "active" as const,
    label: STAGE_LABELS.active,
    completed: true,
    blocked: false,
  };
  const recommendedNextStage = blockedStages[0] ?? currentStage;
  const overallCompletionPercent = Math.round((completedStages.length / stages.length) * 100);

  return {
    overallCompletionPercent,
    completedStages,
    currentStage,
    blockedStages,
    recommendedNextStage,
    recommendedAction: recommendedActionForStage(recommendedNextStage),
  };
}
