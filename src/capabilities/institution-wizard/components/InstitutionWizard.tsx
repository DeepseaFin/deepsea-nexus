"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BusinessProfileStep from "@/src/capabilities/institution-wizard/components/BusinessProfileStep";
import JourneyReadyStep from "@/src/capabilities/institution-wizard/components/JourneyReadyStep";
import ReviewStep from "@/src/capabilities/institution-wizard/components/ReviewStep";
import UploadStep from "@/src/capabilities/institution-wizard/components/UploadStep";
import WizardFooter from "@/src/capabilities/institution-wizard/components/WizardFooter";
import WizardHeader from "@/src/capabilities/institution-wizard/components/WizardHeader";
import WizardStepper from "@/src/capabilities/institution-wizard/components/WizardStepper";
import CustomerCompletion from "@/src/capabilities/onboarding/components/CustomerCompletion";
import { useInstitutionWizard } from "@/src/capabilities/institution-wizard/hooks/useInstitutionWizard";
import { BusinessPassportBuilder } from "@/src/capabilities/institution-wizard/services/BusinessPassportBuilder";
import { BusinessReadinessService } from "@/src/capabilities/institution-wizard/services/BusinessReadinessService";
import { ExplainabilityService } from "@/src/capabilities/institution-wizard/services/ExplainabilityService";
import { useOracleUpload } from "@/src/capabilities/institution-wizard/hooks/useOracleUpload";
import { InstitutionUnderstandingService } from "@/src/capabilities/institution-wizard/services/InstitutionUnderstandingService";
import { OracleWizardAdapter } from "@/src/capabilities/institution-wizard/services/OracleWizardAdapter";

export default function InstitutionWizard() {
  const router = useRouter();
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

  useEffect(() => {
    if (state.currentStepId !== 1 || isProcessing) {
      return;
    }

    if (!oracleResult || oracleError) {
      return;
    }

    goNext();
  }, [goNext, isProcessing, oracleError, oracleResult, state.currentStepId]);

  const handleUpload = async (): Promise<void> => {
    const fileName = "trade-license-al-noor.pdf";
    simulateUpload();
    await processUpload(fileName);
  };

  const completion = {
    readinessScore: readiness.readinessScore,
    nextHandoff: "Relationship Manager Activation",
    checks: [
      "Trade license document uploaded and processed by ORACLE.",
      "Business Passport preview validated in wizard.",
      "Journey preview confirmed for institutional launch.",
      "Institution review completed and approved.",
    ] as const,
  };

  const isNextDisabled = state.currentStepId === 1 && (isProcessing || !oracleResult || Boolean(oracleError));

  const handleNext = (): void => {
    goNext();
  };

  const handleProceedToCommercial = (): void => {
    const params = new URLSearchParams({
      institutionName: state.businessProfile.legalName,
      legalName: state.businessProfile.legalName,
      jurisdiction: state.businessProfile.jurisdiction,
      businessType: state.businessProfile.businessType,
      registrationNumber: state.businessProfile.registrationNumber,
      readinessScore: String(readiness.readinessScore),
    });

    router.push(`/atlas/commercial?${params.toString()}`);
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
              <BusinessProfileStep
                profile={state.businessProfile}
                understanding={understanding}
                passport={passport}
              />
            )}
            {state.currentStepId === 3 && (
              <JourneyReadyStep
                readinessNotes={state.journeyReadinessNotes}
                passport={passport}
                readiness={readiness}
                explanations={explanations}
                recommendation={recommendation}
              />
            )}
            {state.currentStepId === 4 && (
              <ReviewStep
                reviewedFields={reviewedFields}
                confidenceByLabel={confidenceByLabel}
                understanding={understanding}
              />
            )}
            {state.currentStepId === 5 && (
              <div className="space-y-2">
                <CustomerCompletion completion={completion} />
                <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                  <button
                    type="button"
                    onClick={handleProceedToCommercial}
                    className="rounded border border-cyan-700/40 bg-cyan-950/20 px-3 py-2 text-sm font-medium text-cyan-100"
                  >
                    Proceed to Commercial →
                  </button>
                </section>
              </div>
            )}

            <WizardFooter
              currentStepId={state.currentStepId}
              totalSteps={state.steps.length}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              isNextDisabled={isNextDisabled}
              onPrevious={goPrevious}
              onNext={handleNext}
            />
          </main>
        </div>
      </div>
    </div>
  );
}