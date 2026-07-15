"use client";

import { useMemo, useState } from "react";
import type {
  BusinessProfilePreview,
  InstitutionWizardState,
  ReviewedField,
  WizardStepDefinition,
} from "@/src/capabilities/institution-wizard/state/InstitutionWizardState";

const STEP_BLUEPRINT: readonly Omit<WizardStepDefinition, "status">[] = [
  {
    id: 1,
    title: "Upload Trade License",
    subtitle: "Upload and trigger ORACLE processing",
  },
  {
    id: 2,
    title: "Business Passport Preview",
    subtitle: "Inspect institutional passport signals",
  },
  {
    id: 3,
    title: "Journey Preview",
    subtitle: "Confirm readiness for relationship journey",
  },
  {
    id: 4,
    title: "Institution Review",
    subtitle: "Validate reviewed institutional details",
  },
  {
    id: 5,
    title: "Completion",
    subtitle: "Finalize onboarding handoff",
  },
];

const REVIEWED_FIELDS: readonly ReviewedField[] = [
  { label: "Legal Name", value: "Al Noor Trading LLC" },
  { label: "License Number", value: "TL-778190" },
  { label: "Jurisdiction", value: "Dubai Mainland" },
  { label: "Issued On", value: "2024-02-12" },
  { label: "Expiry", value: "2027-02-11" },
];

const BUSINESS_PROFILE: BusinessProfilePreview = {
  legalName: "Al Noor Trading LLC",
  jurisdiction: "Dubai Mainland",
  businessType: "General Trading",
  registrationNumber: "REG-554201",
  establishedOn: "2016-09-04",
};

const JOURNEY_NOTES: readonly string[] = [
  "Identity and registration checkpoints are configured.",
  "Document requirements are preloaded for the relationship journey.",
  "Institution profile is ready for RM review.",
];

export interface UseInstitutionWizardResult {
  readonly state: InstitutionWizardState;
  readonly isFirstStep: boolean;
  readonly isLastStep: boolean;
  goToStep: (stepId: number) => void;
  goNext: () => void;
  goPrevious: () => void;
  simulateUpload: () => void;
}

export function useInstitutionWizard(): UseInstitutionWizardResult {
  const [currentStepId, setCurrentStepId] = useState<number>(1);
  const [furthestStepId, setFurthestStepId] = useState<number>(1);
  const [completedStepIds, setCompletedStepIds] = useState<readonly number[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<readonly string[]>([]);

  const isFirstStep = currentStepId === 1;
  const isLastStep = currentStepId === STEP_BLUEPRINT.length;

  const markStepCompleted = (stepId: number): void => {
    setCompletedStepIds((previous) => {
      if (previous.includes(stepId)) {
        return previous;
      }

      return [...previous, stepId];
    });
  };

  const state: InstitutionWizardState = useMemo(
    () => ({
      currentStepId,
      steps: STEP_BLUEPRINT.map((step) => ({
        ...step,
        status:
          completedStepIds.includes(step.id)
            ? "completed"
            : step.id === currentStepId
              ? "in_progress"
              : "pending",
      })),
      uploadedFiles,
      reviewedFields: REVIEWED_FIELDS,
      businessProfile: BUSINESS_PROFILE,
      journeyReadinessNotes: JOURNEY_NOTES,
    }),
    [completedStepIds, currentStepId, uploadedFiles],
  );

  const goToStep = (stepId: number): void => {
    if (stepId < 1 || stepId > furthestStepId) {
      return;
    }

    setCurrentStepId(stepId);
  };

  const goNext = (): void => {
    setCurrentStepId((previous) => {
      if (previous >= STEP_BLUEPRINT.length) {
        return previous;
      }

      const nextStepId = previous + 1;
      markStepCompleted(previous);
      setFurthestStepId((unlocked) => Math.max(unlocked, nextStepId));

      return nextStepId;
    });
  };

  const goPrevious = (): void => {
    setCurrentStepId((previous) => (previous <= 1 ? previous : previous - 1));
  };

  const simulateUpload = (): void => {
    setUploadedFiles([
      "trade-license-al-noor.pdf",
    ]);
  };

  return {
    state,
    isFirstStep,
    isLastStep,
    goToStep,
    goNext,
    goPrevious,
    simulateUpload,
  };
}