"use client";

import { useMemo, useState } from "react";
import type {
  BusinessProfilePreview,
  InstitutionWizardState,
  ReviewedField,
  WizardStepDefinition,
} from "@/src/capabilities/institution-wizard/state/InstitutionWizardState";

const STEPS: readonly WizardStepDefinition[] = [
  {
    id: 1,
    title: "Upload Trade License",
    subtitle: "Provide the core registration document",
  },
  {
    id: 2,
    title: "Review Information",
    subtitle: "Validate parsed institution details",
  },
  {
    id: 3,
    title: "Business Profile Preview",
    subtitle: "Inspect profile before activation",
  },
  {
    id: 4,
    title: "Relationship Journey Ready",
    subtitle: "Confirm readiness for journey launch",
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
  const [uploadedFiles, setUploadedFiles] = useState<readonly string[]>([]);

  const isFirstStep = currentStepId === 1;
  const isLastStep = currentStepId === STEPS.length;

  const state: InstitutionWizardState = useMemo(
    () => ({
      currentStepId,
      steps: STEPS,
      uploadedFiles,
      reviewedFields: REVIEWED_FIELDS,
      businessProfile: BUSINESS_PROFILE,
      journeyReadinessNotes: JOURNEY_NOTES,
    }),
    [currentStepId, uploadedFiles],
  );

  const goToStep = (stepId: number): void => {
    if (stepId < 1 || stepId > STEPS.length) {
      return;
    }

    setCurrentStepId(stepId);
  };

  const goNext = (): void => {
    setCurrentStepId((previous) => (previous >= STEPS.length ? previous : previous + 1));
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