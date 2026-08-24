export enum WorkflowStep {
  InstitutionWizard = "institution_wizard",
  Oracle = "oracle",
  Evidence = "evidence",
  Knowledge = "knowledge",
  BusinessPassport = "business_passport",
  Journey = "journey",
  InstitutionHealth = "institution_health",
  InstitutionIntelligence = "institution_intelligence",
}

export const CUSTOMER_ONBOARDING_WORKFLOW_STEPS: readonly WorkflowStep[] = [
  WorkflowStep.InstitutionWizard,
  WorkflowStep.Oracle,
  WorkflowStep.Evidence,
  WorkflowStep.Knowledge,
  WorkflowStep.BusinessPassport,
  WorkflowStep.Journey,
  WorkflowStep.InstitutionHealth,
  WorkflowStep.InstitutionIntelligence,
];
