export interface WizardStepDefinition {
  readonly id: number;
  readonly title: string;
  readonly subtitle: string;
}

export interface ReviewedField {
  readonly label: string;
  readonly value: string;
}

export interface BusinessProfilePreview {
  readonly legalName: string;
  readonly jurisdiction: string;
  readonly businessType: string;
  readonly registrationNumber: string;
  readonly establishedOn: string;
}

export interface InstitutionWizardState {
  readonly currentStepId: number;
  readonly steps: readonly WizardStepDefinition[];
  readonly uploadedFiles: readonly string[];
  readonly reviewedFields: readonly ReviewedField[];
  readonly businessProfile: BusinessProfilePreview;
  readonly journeyReadinessNotes: readonly string[];
}