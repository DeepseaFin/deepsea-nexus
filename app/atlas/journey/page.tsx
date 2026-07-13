import {
  JourneyStatus,
  JourneyStep,
  type JourneyRecommendation,
  type JourneyState,
  type JourneyTimelineEvent,
} from "@/lib/journey";
import JourneyWorkspace from "@/src/capabilities/journey/components/JourneyWorkspace";

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

const JOURNEY_STATE: JourneyState = {
  journeyId: "JRN-2401",
  businessId: "BUS-1190",
  status: JourneyStatus.InProgress,
  currentStep: JourneyStep.EvidenceValidation,
  completedSteps: [
    JourneyStep.BeginRelationship,
    JourneyStep.Identity,
    JourneyStep.DocumentCollection,
    JourneyStep.OracleProcessing,
  ],
  startedAt: "2026-07-12T08:10:00Z",
  lastUpdated: "2026-07-13T09:20:00Z",
};

const RECOMMENDATIONS: readonly JourneyRecommendation[] = [
  {
    title: "Confirm Evidence Set Completeness",
    description: "Validate that mandatory corporate and financial evidence is present before knowledge generation.",
    priority: "high",
    generatedAt: "2026-07-13T09:18:00Z",
  },
  {
    title: "Prepare Credit Readiness Notes",
    description: "Draft exceptions and mitigation notes to accelerate downstream credit review.",
    priority: "medium",
    generatedAt: "2026-07-13T09:19:00Z",
  },
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

const MISSING_ITEMS: readonly string[] = [
  "Counterparty aging report for Q2.",
  "Signed board resolution addendum.",
  "Insurance endorsement reference for active facility.",
];

const ACTIONS: readonly string[] = [
  "Run evidence checklist review",
  "Escalate missing board resolution",
  "Prepare handoff for knowledge generation",
];

export default function JourneyPage() {
  return (
    <JourneyWorkspace
      journeyState={JOURNEY_STATE}
      steps={JOURNEY_STEPS}
      recommendations={RECOMMENDATIONS}
      missingItems={MISSING_ITEMS}
      nextAction="Complete evidence validation and route to Knowledge Generation."
      actions={ACTIONS}
      timeline={TIMELINE}
    />
  );
}