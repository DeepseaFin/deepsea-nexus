import {
  JourneyStatus,
  JourneyStep,
  type JourneyRecommendation,
  type JourneyState,
  type JourneyTimelineEvent,
} from "@/lib/journey";
import type { InstitutionalPipelineResult } from "@/lib/orchestration/pipeline/InstitutionalPipelineResult";
import { getExecutiveDecisionProjection } from "@/src/capabilities/journey/adapters/getExecutiveDecisionProjection";
import { getExplainabilityProjection } from "@/src/capabilities/journey/adapters/getExplainabilityProjection";
import { getInstitutionalTimelineProjection } from "@/src/capabilities/journey/adapters/getInstitutionalTimelineProjection";
import { getInstitutionalHealthProjection } from "@/src/capabilities/journey/adapters/getInstitutionalHealthProjection";
import type {
  JourneyKnowledgeInsightsViewModel,
} from "@/src/capabilities/journey/adapters/getJourneyKnowledgeInsightsProjection";
import type { JourneyWorkspaceProjection } from "@/src/capabilities/journey/projections/JourneyWorkspaceProjection";

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

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  const properties = Object.getOwnPropertyNames(value);

  for (const property of properties) {
    const propertyValue = (value as Record<string, unknown>)[property];

    if (propertyValue !== null && (typeof propertyValue === "object" || typeof propertyValue === "function")) {
      deepFreeze(propertyValue);
    }
  }

  return Object.freeze(value);
}

function toReadableLabel(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

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

function toJourneyRecommendations(
  pipelineResult: InstitutionalPipelineResult,
): readonly JourneyRecommendation[] {
  const explainability = pipelineResult.explainabilityResult;

  return pipelineResult.decisionPackage.artifacts.recommendations.map((recommendation) => {
    const isExplainedRecommendation = recommendation.id === explainability.recommendation.id;
    const explainedDescription = isExplainedRecommendation
      ? `${recommendation.description} Trace confidence ${Math.round(explainability.confidence * 100)}% across ${explainability.explanationPath.nodes.length} provenance nodes.`
      : recommendation.description;

    return {
      title: recommendation.title,
      description: explainedDescription,
      priority: recommendation.priority === "urgent"
        ? "critical"
        : recommendation.priority === "high" || recommendation.priority === "medium" || recommendation.priority === "low"
          ? recommendation.priority
          : "medium",
      generatedAt: pipelineResult.pipelineMetadata.executedAt,
    };
  });
}

function toJourneyKnowledgeInsights(
  pipelineResult: InstitutionalPipelineResult,
): JourneyKnowledgeInsightsViewModel {
  const projectionResults = pipelineResult.journeyResult.artifacts.onboardingResults;

  const keyBusinessFacts = projectionResults
    .flatMap((result) => result.knowledge.facts)
    .map((fact) => ({
      factName: toReadableLabel(fact.factName),
      factValue: String(fact.value),
      confidence: fact.confidence,
    }))
    .slice(0, 6);

  const riskIndicators = projectionResults
    .flatMap((result) => result.validation.knowledge.issues)
    .filter((issue) => issue.severity === "error")
    .map((issue) => ({
      label: toReadableLabel(issue.field),
      detail: issue.message,
    }));

  const missingInformation = projectionResults
    .flatMap((result) => result.warnings)
    .map((warning) => ({
      label: "Missing Information",
      detail: warning,
    }));

  const institutionalObservations = projectionResults.map((result) => ({
    label: `Projection ${result.projection.projectionMetadata.projectionVersion}`,
    detail: `Generated ${result.projection.projectionMetadata.generatedAt} by ${result.projection.projectionMetadata.generator}.`,
  }));

  return {
    keyBusinessFacts,
    riskIndicators,
    missingInformation,
    institutionalObservations,
  };
}

export function getJourneyWorkspaceProjection(
  pipelineResult: InstitutionalPipelineResult,
): JourneyWorkspaceProjection {
  const projectedPassport = pipelineResult.journeyResult.artifacts.projectedBusinessPassport;
  const knowledgeInsights = toJourneyKnowledgeInsights(pipelineResult);

  const journeyState = toJourneyStateFromPipeline({
    journeyId: pipelineResult.journeyResult.journeyId,
    businessId: projectedPassport.metadata.lineage.sourceReferences[0] ?? projectedPassport.passportId.toString(),
    startedAt: projectedPassport.metadata.audit.createdAt,
    lastUpdated: projectedPassport.metadata.audit.updatedAt,
  });

  const nextAction =
    pipelineResult.decisionPackage.metadata.packageStatus === "complete"
      ? "Complete evidence validation and route to Knowledge Generation."
      : "Resolve package traceability gaps before progressing the journey.";

  return deepFreeze({
    journeyState,
    steps: JOURNEY_STEPS,
    recommendations: toJourneyRecommendations(pipelineResult),
    missingItems: knowledgeInsights.missingInformation.map((item) => item.detail),
    nextAction,
    actions: [
      "Run evidence checklist review",
      "Escalate missing board resolution",
      "Prepare handoff for knowledge generation",
    ],
    timeline: TIMELINE,
    businessPassport: {
      status: projectedPassport.status,
      metadata: projectedPassport.metadata,
      profiles: {
        identityProfile: projectedPassport.profiles.identityProfile,
      },
    },
    evidence: pipelineResult.journeyResult.artifacts.onboardingResults.map((result) => ({
      id: result.evidence.evidenceId.toString(),
      title: result.evidence.metadata.documentVersion,
      description: `Projection-backed evidence captured from ${result.evidence.metadata.sourceSystem} for institutional review continuity.`,
      source: result.evidence.source,
      confidence: result.projection.projectionMetadata.confidence.score,
    })),
    knowledgeInsights,
    executiveDecision: getExecutiveDecisionProjection(pipelineResult.decisionPackage),
    explainability: getExplainabilityProjection(pipelineResult.explainabilityResult),
    institutionalTimeline: getInstitutionalTimelineProjection(
      pipelineResult.journeyResult,
      pipelineResult.decisionAuditRecord,
    ),
    institutionalHealth: getInstitutionalHealthProjection(
      pipelineResult.journeyResult.artifacts.institutionHealth,
    ),
  });
}
