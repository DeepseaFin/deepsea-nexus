import {
  JourneyStatus,
  JourneyStep,
  type JourneyState,
  type JourneyTimelineEvent,
} from "@/lib/journey";
import JourneyWorkspace from "@/src/capabilities/journey/components/JourneyWorkspace";
import {
  getJourneyWorkspacePipelineProjection,
} from "@/src/capabilities/journey/adapters/getJourneyWorkspacePipelineProjection";

const JOURNEY_STEPS: readonly JourneyStep[] = [
  JourneyStep.BeginRelationship,
  JourneyStep.Identity,
  JourneyStep.DocumentCollection,
  JourneyStep.OracleProcessing,
  JourneyStep.EvidenceValidation,
  JourneyStep.KnowledgeGeneration,
  JourneyStep.BusinessPassport,
  JourneyStep.CreditReadiness,
  JourneyStep.Approval,
  JourneyStep.Completed,
];

const TIMELINE: readonly JourneyTimelineEvent[] = [
  {
    timestamp: "2026-07-12T08:10:00Z",
    event: "Journey initiated",
    performedBy: "RM Desk",
    notes: "Relationship kickoff completed.",
  },
  {
    timestamp: "2026-07-12T10:25:00Z",
    event: "Identity completed",
    performedBy: "Compliance Analyst",
    notes: "Identity package validated.",
  },
  {
    timestamp: "2026-07-12T14:45:00Z",
    event: "Document collection finalized",
    performedBy: "Operations",
    notes: "Initial evidence set available.",
  },
  {
    timestamp: "2026-07-13T08:35:00Z",
    event: "Oracle processing completed",
    performedBy: "ORACLE Pipeline",
    notes: "Structured artifacts ready for validation.",
  },
  {
    timestamp: "2026-07-13T09:20:00Z",
    event: "Evidence validation started",
    performedBy: "Journey Operator",
    notes: "Reviewing confidence and missing items.",
  },
];

function toJourneyStateFromPipeline(input: {
  readonly journeyId: string;
  readonly businessId: string;
  readonly startedAt: string;
  readonly lastUpdated: string;
}): JourneyState {
  return {
    journeyId: input.journeyId,
    businessId: input.businessId,
    status: JourneyStatus.InProgress,
    currentStep: JourneyStep.EvidenceValidation,
    completedSteps: [
      JourneyStep.BeginRelationship,
      JourneyStep.Identity,
      JourneyStep.DocumentCollection,
      JourneyStep.OracleProcessing,
    ],
    startedAt: input.startedAt,
    lastUpdated: input.lastUpdated,
  };
}

export default async function JourneyPage() {
  const projection = await getJourneyWorkspacePipelineProjection();
  const passport = projection.pipelineResult.journeyResult.artifacts.projectedBusinessPassport;
  const lineageBusinessId = passport.metadata.lineage.sourceReferences[0] ?? passport.passportId.toString();

  const journeyState = toJourneyStateFromPipeline({
    journeyId: projection.pipelineResult.journeyResult.journeyId,
    businessId: lineageBusinessId,
    startedAt: passport.metadata.audit.createdAt,
    lastUpdated: passport.metadata.audit.updatedAt,
  });

  return (
    <JourneyWorkspace
      journeyState={journeyState}
      steps={JOURNEY_STEPS}
      recommendations={projection.recommendations}
      missingItems={projection.missingItems}
      nextAction={projection.nextAction}
      actions={projection.actions}
      timeline={TIMELINE}
      businessPassport={projection.businessPassport}
      evidence={projection.evidence}
      knowledgeInsights={projection.knowledgeInsights}
    />
  );
}