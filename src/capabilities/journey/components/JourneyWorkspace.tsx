import type { JourneyRecommendation, JourneyState, JourneyStep, JourneyTimelineEvent } from "@/lib/journey";
import JourneyActionBar from "@/src/capabilities/journey/components/JourneyActionBar";
import JourneyAiPanel from "@/src/capabilities/journey/components/JourneyAiPanel";
import JourneyHeader from "@/src/capabilities/journey/components/JourneyHeader";
import JourneyProgress from "@/src/capabilities/journey/components/JourneyProgress";
import JourneySidebar from "@/src/capabilities/journey/components/JourneySidebar";
import JourneyStepCard from "@/src/capabilities/journey/components/JourneyStepCard";
import JourneyTimeline from "@/src/capabilities/journey/components/JourneyTimeline";

type JourneyWorkspaceProps = {
  journeyState: JourneyState;
  steps: readonly JourneyStep[];
  recommendations: readonly JourneyRecommendation[];
  missingItems: readonly string[];
  nextAction: string;
  actions: readonly string[];
  timeline: readonly JourneyTimelineEvent[];
};

export default function JourneyWorkspace({
  journeyState,
  steps,
  recommendations,
  missingItems,
  nextAction,
  actions,
  timeline,
}: JourneyWorkspaceProps) {
  const totalSteps = steps.length;
  const completionPercentage = totalSteps === 0
    ? 0
    : Math.round((journeyState.completedSteps.length / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1920px] space-y-3 pb-8">
        <JourneyHeader journeyState={journeyState} completionPercentage={completionPercentage} />

        <div className="grid gap-2 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <JourneySidebar
            steps={steps}
            currentStep={journeyState.currentStep}
            completedSteps={journeyState.completedSteps}
          />

          <main className="space-y-2">
            <JourneyStepCard journeyState={journeyState} />
            <JourneyProgress
              steps={steps}
              completedSteps={journeyState.completedSteps}
              completionPercentage={completionPercentage}
            />
            <JourneyActionBar actions={actions} />
          </main>

          <JourneyAiPanel
            recommendations={recommendations}
            missingItems={missingItems}
            nextAction={nextAction}
          />
        </div>

        <JourneyTimeline timeline={timeline} />
      </div>
    </div>
  );
}