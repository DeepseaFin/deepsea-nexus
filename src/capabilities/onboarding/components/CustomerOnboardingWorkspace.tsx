"use client";

import EmptyState from "@/components/atlas/design-system/EmptyState";
import CustomerCompletion from "@/src/capabilities/onboarding/components/CustomerCompletion";
import CustomerOnboardingFooter from "@/src/capabilities/onboarding/components/CustomerOnboardingFooter";
import CustomerOnboardingHeader from "@/src/capabilities/onboarding/components/CustomerOnboardingHeader";
import CustomerOnboardingProgress from "@/src/capabilities/onboarding/components/CustomerOnboardingProgress";
import CustomerOnboardingSidebar from "@/src/capabilities/onboarding/components/CustomerOnboardingSidebar";
import CustomerOnboardingStep from "@/src/capabilities/onboarding/components/CustomerOnboardingStep";
import CustomerProcessingPanel from "@/src/capabilities/onboarding/components/CustomerProcessingPanel";
import CustomerRecommendationPanel from "@/src/capabilities/onboarding/components/CustomerRecommendationPanel";
import { useCustomerOnboarding } from "@/src/capabilities/onboarding/hooks/useCustomerOnboarding";
import type { CustomerOnboardingState } from "@/src/capabilities/onboarding/types/CustomerOnboardingState";

type CustomerOnboardingWorkspaceProps = {
  readonly initialState: CustomerOnboardingState;
};

export default function CustomerOnboardingWorkspace({ initialState }: CustomerOnboardingWorkspaceProps) {
  const {
    onboarding,
    completionPercentage,
    currentStep,
    goToNext,
    goToPrevious,
    completeCurrentStep,
    pause,
    resume,
  } = useCustomerOnboarding({ initialState });

  const completedCount = onboarding.steps.filter((step) => step.status === "completed").length;
  const isPaused = onboarding.status === "paused";
  const isCompleted = onboarding.status === "completed";

  if (!onboarding.steps.length) {
    return (
      <div className="min-h-screen p-6 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Onboarding workflow is empty"
            message="No onboarding steps are available right now. Please refresh and try again."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1920px] space-y-3 pb-8">
        <CustomerOnboardingHeader onboarding={onboarding} completionPercentage={completionPercentage} />

        <div className="grid gap-2 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
          <CustomerOnboardingSidebar steps={onboarding.steps} currentStepId={onboarding.currentStepId} />

          <main className="space-y-2">
            <CustomerOnboardingStep step={currentStep} />
            <CustomerOnboardingProgress
              completionPercentage={completionPercentage}
              completedCount={completedCount}
              totalCount={onboarding.steps.length}
            />
            <CustomerCompletion completion={onboarding.completion} />
            <CustomerOnboardingFooter
              isPaused={isPaused}
              isCompleted={isCompleted}
              onPrevious={goToPrevious}
              onNext={goToNext}
              onCompleteStep={completeCurrentStep}
              onPause={pause}
              onResume={resume}
            />
          </main>

          <aside className="space-y-2">
            <CustomerProcessingPanel tasks={onboarding.processingTasks} />
            <CustomerRecommendationPanel recommendations={onboarding.recommendations} />
          </aside>
        </div>
      </div>
    </div>
  );
}
