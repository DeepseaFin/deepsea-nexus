"use client";

import EmptyState from "@/components/atlas/design-system/EmptyState";
import BusinessPassportSummary from "@/components/atlas/business-passport/BusinessPassportSummary";
import EvidencePanel from "@/components/atlas/intelligence/EvidencePanel";
import { JourneyStatus } from "@/lib/journey";
import { useEffect, useState } from "react";
import { useJourney } from "@/src/capabilities/journey/hooks/useJourney";
import JourneyActionBar from "@/src/capabilities/journey/components/JourneyActionBar";
import JourneyActionCenterPanel from "@/src/capabilities/journey/components/JourneyActionCenterPanel";
import JourneyAiPanel from "@/src/capabilities/journey/components/JourneyAiPanel";
import JourneyHeader from "@/src/capabilities/journey/components/JourneyHeader";
import JourneyKnowledgeInsightsPanel from "@/src/capabilities/journey/components/JourneyKnowledgeInsightsPanel";
import JourneyNavigation from "@/src/capabilities/journey/components/JourneyNavigation";
import JourneyProgress from "@/src/capabilities/journey/components/JourneyProgress";
import JourneyRecentDocumentsPanel from "@/src/capabilities/journey/components/JourneyRecentDocumentsPanel";
import JourneySidebar from "@/src/capabilities/journey/components/JourneySidebar";
import JourneyStepCard from "@/src/capabilities/journey/components/JourneyStepCard";
import JourneyTimeline from "@/src/capabilities/journey/components/JourneyTimeline";
import InstitutionalAdvisorPanel from "@/src/capabilities/journey/components/InstitutionalAdvisorPanel";
import {
  getJourneyRecentDocumentsProjection,
  type JourneyRecentDocumentsViewModel,
} from "@/src/capabilities/journey/adapters/getJourneyRecentDocumentsProjection";
import type { JourneyWorkspaceProjection } from "@/src/capabilities/journey/projections/JourneyWorkspaceProjection";
import ExecutiveDecisionPanel from "@/components/atlas/journey/ExecutiveDecisionPanel";
import ExplainabilityPanel from "@/components/atlas/journey/ExplainabilityPanel";
import InstitutionalTimelinePanel from "@/components/atlas/journey/InstitutionalTimelinePanel";
import InstitutionalHealthPanel from "@/components/atlas/journey/InstitutionalHealthPanel";

type JourneyWorkspaceProps = {
  projection: JourneyWorkspaceProjection;
};

export default function JourneyWorkspace({
  projection,
}: JourneyWorkspaceProps) {
  const {
    journeyState,
    steps,
    recommendations,
    missingItems,
    nextAction,
    actions,
    timeline,
    businessPassport,
    evidence,
    knowledgeInsights,
    executiveDecision,
    explainability,
    institutionalTimeline,
    institutionalHealth,
  } = projection;

  const [recentDocuments, setRecentDocuments] = useState<JourneyRecentDocumentsViewModel>([]);
  const [isRecentDocumentsLoading, setIsRecentDocumentsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadRecentDocuments() {
      try {
        const documents = await getJourneyRecentDocumentsProjection();

        if (!active) {
          return;
        }

        setRecentDocuments(documents);
      } catch {
        if (!active) {
          return;
        }

        setRecentDocuments([]);
      } finally {
        if (active) {
          setIsRecentDocumentsLoading(false);
        }
      }
    }

    void loadRecentDocuments();

    return () => {
      active = false;
    };
  }, []);

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1880px] space-y-5 pb-10">
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

        <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_360px] 2xl:gap-5">
          <JourneySidebar
            steps={workspace.steps}
            currentStep={workspace.journeyState.currentStep}
            completedSteps={workspace.progress.completedSteps}
            status={workspace.journeyState.status}
          />

          <main className="space-y-5" aria-label="Journey workspace canvas">
            <section aria-label="Journey state and progress" className="space-y-4">
              <JourneyStepCard journeyState={workspace.journeyState} />
              <JourneyProgress progress={workspace.progress} />
            </section>

            <div className="border-t border-slate-800/80" aria-hidden="true" />

            <section aria-label="Identity and evidence" className="space-y-4">
              <BusinessPassportSummary passport={businessPassport} />
              <EvidencePanel evidence={evidence} title="Evidence" />
              <JourneyRecentDocumentsPanel documents={recentDocuments} isLoading={isRecentDocumentsLoading} />
            </section>

            <div className="border-t border-slate-800/80" aria-hidden="true" />

            <section aria-label="Knowledge and advisory" className="space-y-4">
              <JourneyKnowledgeInsightsPanel insights={knowledgeInsights} />
              <InstitutionalAdvisorPanel />
              <ExecutiveDecisionPanel decision={executiveDecision} />
              <ExplainabilityPanel explainability={explainability} />
              <InstitutionalHealthPanel health={institutionalHealth} />
              <JourneyActionCenterPanel />
            </section>

            <div className="border-t border-slate-800/80" aria-hidden="true" />

            <section aria-label="Timeline and actions" className="space-y-4">
              <InstitutionalTimelinePanel timeline={institutionalTimeline} />
              <JourneyActionBar
                actions={workspace.actions}
                isPaused={isPaused}
                onActionSelect={goToNext}
              />
            </section>
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