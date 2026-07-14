"use client";

import BusinessProfileStep from "@/src/capabilities/institution-wizard/components/BusinessProfileStep";
import JourneyReadyStep from "@/src/capabilities/institution-wizard/components/JourneyReadyStep";
import ReviewStep from "@/src/capabilities/institution-wizard/components/ReviewStep";
import UploadStep from "@/src/capabilities/institution-wizard/components/UploadStep";
import WizardFooter from "@/src/capabilities/institution-wizard/components/WizardFooter";
import WizardHeader from "@/src/capabilities/institution-wizard/components/WizardHeader";
import WizardStepper from "@/src/capabilities/institution-wizard/components/WizardStepper";
import { useInstitutionWizard } from "@/src/capabilities/institution-wizard/hooks/useInstitutionWizard";
import { BusinessPassportBuilder } from "@/src/capabilities/institution-wizard/services/BusinessPassportBuilder";
import { BusinessReadinessService } from "@/src/capabilities/institution-wizard/services/BusinessReadinessService";
import { ExplainabilityService } from "@/src/capabilities/institution-wizard/services/ExplainabilityService";
import { useOracleUpload } from "@/src/capabilities/institution-wizard/hooks/useOracleUpload";
import { InstitutionUnderstandingService } from "@/src/capabilities/institution-wizard/services/InstitutionUnderstandingService";
import { OracleWizardAdapter } from "@/src/capabilities/institution-wizard/services/OracleWizardAdapter";

export default function InstitutionWizard() {
  const {
    state,
    isFirstStep,
    isLastStep,
    goToStep,
    goNext,
    goPrevious,
    simulateUpload,
  } = useInstitutionWizard();
  const {
    isProcessing,
    result: oracleResult,
    error: oracleError,
    processUpload,
  } = useOracleUpload();

  const reviewedFields = oracleResult
    ? OracleWizardAdapter.toReviewedFields(oracleResult)
    : state.reviewedFields;

  const confidenceByLabel = oracleResult
    ? Object.fromEntries(oracleResult.extractedFields.map((field) => [field.label, field.confidence]))
    : {};

  const understanding = InstitutionUnderstandingService.build({
    reviewedFields,
    profile: state.businessProfile,
    uploadedFiles: state.uploadedFiles,
    confidenceByLabel,
  });
  const passport = BusinessPassportBuilder.build(understanding);
  const readiness = BusinessReadinessService.build(passport);
  const explanations = ExplainabilityService.buildExplanations(understanding);
  const recommendation = ExplainabilityService.buildRecommendation(
    understanding,
    readiness.manualReviewItems,
    passport.nextAction,
  );

  const handleUpload = async (): Promise<void> => {
    const fileName = "trade-license-al-noor.pdf";
    simulateUpload();
    await processUpload(fileName);
  };

  const currentStep = state.steps.find((step) => step.id === state.currentStepId) ?? state.steps[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1920px] space-y-3 pb-8">
        <WizardHeader
          institutionName={state.businessProfile.legalName}
          currentStepTitle={currentStep.title}
        />

        <div className="grid gap-2 xl:grid-cols-[300px_minmax(0,1fr)]">
          <WizardStepper
            steps={state.steps}
            currentStepId={state.currentStepId}
            onStepSelect={goToStep}
          />

          <main className="space-y-2">
            {state.currentStepId === 1 && (
              <UploadStep
                uploadedFiles={state.uploadedFiles}
                onSimulateUpload={handleUpload}
                isProcessing={isProcessing}
                oracleResult={oracleResult}
                oracleError={oracleError}
              />
            )}
            {state.currentStepId === 2 && (
              <ReviewStep
                reviewedFields={reviewedFields}
                confidenceByLabel={confidenceByLabel}
                understanding={understanding}
              />
            )}
            {state.currentStepId === 3 && (
              <BusinessProfileStep
                profile={state.businessProfile}
                understanding={understanding}
                passport={passport}
              />
            )}
            {state.currentStepId === 4 && (
              <JourneyReadyStep
                readinessNotes={state.journeyReadinessNotes}
                passport={passport}
                readiness={readiness}
                explanations={explanations}
                recommendation={recommendation}
              />
            )}

            <WizardFooter
              currentStepId={state.currentStepId}
              totalSteps={state.steps.length}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              onPrevious={goPrevious}
              onNext={goNext}
            />
          </main>
        </div>
      </div>
    </div>
  );
}