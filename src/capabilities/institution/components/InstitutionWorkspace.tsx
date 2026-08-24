"use client";

import EmptyState from "@/components/atlas/design-system/EmptyState";
import WorkflowTimelinePanel from "@/components/atlas/workflows/WorkflowTimelinePanel";
import { buildMockWorkflowEvents } from "@/lib/workflows/WorkflowTimeline";
import InstitutionAiAdvisor from "@/src/capabilities/institution/components/InstitutionAiAdvisor";
import InstitutionDashboard from "@/src/capabilities/institution/components/InstitutionDashboard";
import InstitutionDecisionFeed from "@/src/capabilities/institution/components/InstitutionDecisionFeed";
import InstitutionDocuments from "@/src/capabilities/institution/components/InstitutionDocuments";
import InstitutionHeader from "@/src/capabilities/institution/components/InstitutionHeader";
import InstitutionHealth from "@/src/capabilities/institution/components/InstitutionHealth";
import InstitutionKnowledgeGraph from "@/src/capabilities/institution/components/InstitutionKnowledgeGraph";
import InstitutionNavigation from "@/src/capabilities/institution/components/InstitutionNavigation";
import InstitutionTimeline from "@/src/capabilities/institution/components/InstitutionTimeline";
import { useInstitution } from "@/src/capabilities/institution/hooks/useInstitution";
import type {
  InstitutionNavigationKey,
  InstitutionWorkspaceState,
} from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

type InstitutionWorkspaceProps = {
  readonly initialState: InstitutionWorkspaceState;
};

function renderView(
  view: InstitutionNavigationKey,
  workspace: InstitutionWorkspaceState,
  workflowEvents: ReturnType<typeof buildMockWorkflowEvents>,
) {
  switch (view) {
    case "timeline":
      return (
        <div className="space-y-3">
          <InstitutionTimeline timeline={workspace.timeline} />
          <WorkflowTimelinePanel events={workflowEvents} compact title="Workflow Execution Context" />
        </div>
      );
    case "health":
      return <InstitutionHealth health={workspace.health} />;
    case "documents":
      return <InstitutionDocuments documents={workspace.documents} />;
    case "decisions":
      return <InstitutionDecisionFeed decisions={workspace.decisionFeed} />;
    case "knowledge":
      return <InstitutionKnowledgeGraph graph={workspace.knowledgeGraph} />;
    case "advisor":
      return <InstitutionAiAdvisor advisor={workspace.aiAdvisor} />;
    case "dashboard":
    default:
      return (
        <div className="space-y-2">
          <InstitutionDashboard kpis={workspace.kpis} />
          <InstitutionTimeline timeline={workspace.timeline.slice(0, 6)} />
          <InstitutionHealth health={workspace.health} />
        </div>
      );
  }
}

export default function InstitutionWorkspace({ initialState }: InstitutionWorkspaceProps) {
  const { workspace, activeView, setActiveView } = useInstitution(initialState);

  if (!workspace.navigation.length) {
    return (
      <div className="min-h-screen p-6 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Institution navigation is unavailable"
            message="No workspace sections are currently configured. Refresh and try again."
          />
        </div>
      </div>
    );
  }

  const workflowEvents = buildMockWorkflowEvents({
    institutionName: workspace.institutionName,
    opportunityReference: "OPP-7712",
    fundingAmount: "USD 6,200,000",
    submittedBy: "Relationship Manager",
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1920px] space-y-4 pb-10">
        <InstitutionHeader workspace={workspace} />

        <InstitutionNavigation items={workspace.navigation} activeView={activeView} onSelect={setActiveView} />

        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-3">{renderView(activeView, workspace, workflowEvents)}</main>
          <div className="space-y-3">
            <InstitutionAiAdvisor advisor={workspace.aiAdvisor} />
            <InstitutionDecisionFeed decisions={workspace.decisionFeed.slice(0, 2)} />
          </div>
        </div>
      </div>
    </div>
  );
}
