"use client";

import EmptyState from "@/components/atlas/design-system/EmptyState";
import BusinessPassportSummary from "@/components/atlas/business-passport/BusinessPassportSummary";
import EvidencePanel from "@/components/atlas/intelligence/EvidencePanel";
import { JourneyStatus, type JourneyRecommendation, type JourneyState, type JourneyStep, type JourneyTimelineEvent } from "@/lib/journey";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { IdentityProfile } from "@/lib/business-passport/domain/Profiles";
import type { ComponentProps } from "react";
import { useJourney } from "@/src/capabilities/journey/hooks/useJourney";
import JourneyActionBar from "@/src/capabilities/journey/components/JourneyActionBar";
import JourneyAiPanel from "@/src/capabilities/journey/components/JourneyAiPanel";
import JourneyHeader from "@/src/capabilities/journey/components/JourneyHeader";
import JourneyNavigation from "@/src/capabilities/journey/components/JourneyNavigation";
import JourneyProgress from "@/src/capabilities/journey/components/JourneyProgress";
import JourneySidebar from "@/src/capabilities/journey/components/JourneySidebar";
import JourneyStepCard from "@/src/capabilities/journey/components/JourneyStepCard";
import JourneyTimeline from "@/src/capabilities/journey/components/JourneyTimeline";
import InstitutionalAdvisorPanel from "@/src/capabilities/journey/components/InstitutionalAdvisorPanel";
import JourneyTimelinePanel from "@/src/capabilities/journey/components/JourneyTimelinePanel";

type JourneyWorkspaceBusinessPassport = Pick<BusinessPassport, "status" | "metadata"> & {
  readonly profiles: {
    readonly identityProfile: IdentityProfile;
  };
};

type JourneyWorkspaceEvidence = ComponentProps<typeof EvidencePanel>["evidence"];

type JourneyWorkspaceProps = {
  journeyState: JourneyState;
  steps: readonly JourneyStep[];
  recommendations: readonly JourneyRecommendation[];
  missingItems: readonly string[];
  nextAction: string;
  actions: readonly string[];
  timeline: readonly JourneyTimelineEvent[];
  businessPassport: JourneyWorkspaceBusinessPassport;
  evidence: JourneyWorkspaceEvidence;
};

export default function JourneyWorkspace({
  journeyState,
  steps,
  recommendations,
  missingItems,
  nextAction,
  actions,
  timeline,
  businessPassport,
  evidence,
}: JourneyWorkspaceProps) {
  const {
    workspace,
    goToNext,
    goToPrevious,
    completeCurrentStep,
    pauseJourney,
    resumeJourney,
  } = useJourney({
    initialState: journeyState,
    steps,
    initialRecommendations: recommendations,
    initialMissingItems: missingItems,
    initialNextAction: nextAction,
    initialActions: actions,
    initialTimeline: timeline,
    actor: "Journey Operator",
  });

  if (!workspace.steps.length) {
    return (
      <div className="min-h-screen p-6 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Journey workflow is empty"
            message="No journey steps are currently available. Refresh and try again."
          />
        </div>
      </div>
    );
  }

  const isPaused = workspace.journeyState.status === JourneyStatus.Paused;
  const isCompleted = workspace.journeyState.status === JourneyStatus.Completed;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1920px] space-y-3 pb-8">
        <JourneyHeader journeyState={workspace.journeyState} completionPercentage={workspace.progress.completionPercentage} />

        <JourneyNavigation
          isPaused={isPaused}
          isCompleted={isCompleted}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onPause={pauseJourney}
          onResume={resumeJourney}
          onCompleteStep={completeCurrentStep}
        />

        <div className="grid gap-2 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <JourneySidebar
            steps={workspace.steps}
            currentStep={workspace.journeyState.currentStep}
            completedSteps={workspace.progress.completedSteps}
            status={workspace.journeyState.status}
          />

          <main className="space-y-2">
            <JourneyStepCard journeyState={workspace.journeyState} />
            <JourneyProgress progress={workspace.progress} />
            <BusinessPassportSummary passport={businessPassport} />
            <EvidencePanel evidence={evidence} title="Evidence" />
            <InstitutionalAdvisorPanel />
            <JourneyTimelinePanel />
            <JourneyActionBar
              actions={workspace.actions}
              isPaused={isPaused}
              onActionSelect={goToNext}
            />
          </main>

          <JourneyAiPanel
            recommendations={workspace.recommendations}
            missingItems={workspace.missingItems}
            nextAction={workspace.nextAction}
            status={workspace.journeyState.status}
          />
        </div>

        <JourneyTimeline timeline={workspace.timeline} currentStatus={workspace.journeyState.status} />
      </div>
    </div>
  );
}