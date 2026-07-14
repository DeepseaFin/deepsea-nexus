"use client";

import BusinessProfileStep from "@/src/capabilities/institution-wizard/components/BusinessProfileStep";
import JourneyReadyStep from "@/src/capabilities/institution-wizard/components/JourneyReadyStep";
import ReviewStep from "@/src/capabilities/institution-wizard/components/ReviewStep";
import UploadStep from "@/src/capabilities/institution-wizard/components/UploadStep";
import WizardFooter from "@/src/capabilities/institution-wizard/components/WizardFooter";
import WizardHeader from "@/src/capabilities/institution-wizard/components/WizardHeader";
import WizardStepper from "@/src/capabilities/institution-wizard/components/WizardStepper";
import { useInstitutionWizard } from "@/src/capabilities/institution-wizard/hooks/useInstitutionWizard";

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
              <UploadStep uploadedFiles={state.uploadedFiles} onSimulateUpload={simulateUpload} />
            )}
            {state.currentStepId === 2 && <ReviewStep reviewedFields={state.reviewedFields} />}
            {state.currentStepId === 3 && <BusinessProfileStep profile={state.businessProfile} />}
            {state.currentStepId === 4 && <JourneyReadyStep readinessNotes={state.journeyReadinessNotes} />}

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