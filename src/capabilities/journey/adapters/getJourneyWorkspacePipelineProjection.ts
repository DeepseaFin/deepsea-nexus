import {
  createBusinessPassportApplicationService,
} from "@/lib/business-passport/services/BusinessPassportApplicationService";
import {
  createInMemoryBusinessPassportRepository,
} from "@/lib/business-passport/repositories/InMemoryBusinessPassportRepository";
import {
  createJourneyOrchestratorService,
} from "@/lib/orchestration/JourneyOrchestratorService";
import {
  createInstitutionalPipelineService,
} from "@/lib/orchestration/pipeline/InstitutionalPipelineService";
import type { JourneyContext } from "@/lib/orchestration/JourneyContext";
import type { InstitutionalPipelineResult } from "@/lib/orchestration/pipeline/InstitutionalPipelineResult";
import { JOURNEY_EVIDENCE_SEEDS } from "@/src/capabilities/journey/adapters/getJourneyEvidenceProjection";
import {
  getJourneyProjectedBusinessPassport,
  type JourneyBusinessPassportViewModel,
} from "@/src/capabilities/journey/adapters/getJourneyBusinessPassportProjection";
import type {
  JourneyKnowledgeInsightsViewModel,
} from "@/src/capabilities/journey/adapters/getJourneyKnowledgeInsightsProjection";
import type { JourneyRecommendation } from "@/lib/journey";
import type { ComponentProps } from "react";
import EvidencePanel from "@/components/atlas/intelligence/EvidencePanel";

export type JourneyWorkspaceEvidenceViewModel = ComponentProps<typeof EvidencePanel>["evidence"];

export interface JourneyWorkspacePipelineProjection {
  readonly pipelineResult: InstitutionalPipelineResult;
  readonly businessPassport: JourneyBusinessPassportViewModel;
  readonly evidence: JourneyWorkspaceEvidenceViewModel;
  readonly knowledgeInsights: JourneyKnowledgeInsightsViewModel;
  readonly recommendations: readonly JourneyRecommendation[];
  readonly missingItems: readonly string[];
  readonly nextAction: string;
  readonly actions: readonly string[];
}

const DEFAULT_RECOMMENDATION_ID = "recommendation:request_additional_documentation:risk-signal:BPP-2401:documentation_risk|risk-signal:BPP-2401:knowledge_risk";

function toJourneyContext(): JourneyContext {
  const passport = getJourneyProjectedBusinessPassport();

  return {
    journeyId: "JRN-2401",
    passportInput: {
      passportId: passport.passportId,
      metadata: passport.metadata,
      governance: passport.governance,
      profiles: passport.profiles,
      confidence: passport.confidence,
      knowledgeDensity: passport.knowledgeDensity,
      institutionalPulse: passport.institutionalPulse,
      maturity: passport.maturity,
    },
    evidenceInputs: JOURNEY_EVIDENCE_SEEDS.map((seed) => ({
      oracleDocument: seed.oracleDocument,
      evidenceReferences: seed.references,
    })),
  };
}

function toJourneyBusinessPassportViewModel(
  pipelineResult: InstitutionalPipelineResult,
): JourneyBusinessPassportViewModel {
  const passport = pipelineResult.journeyResult.artifacts.projectedBusinessPassport;

  return {
    status: passport.status,
    metadata: passport.metadata,
    profiles: {
      identityProfile: passport.profiles.identityProfile,
    },
  };
}

function toJourneyEvidenceViewModel(
  pipelineResult: InstitutionalPipelineResult,
): JourneyWorkspaceEvidenceViewModel {
  return pipelineResult.journeyResult.artifacts.onboardingResults.map((result) => ({
    id: result.evidence.evidenceId.toString(),
    title: result.evidence.metadata.documentVersion,
    description: `Projection-backed evidence captured from ${result.evidence.metadata.sourceSystem} for institutional review continuity.`,
    source: result.evidence.source,
    confidence: result.projection.projectionMetadata.confidence.score,
  }));
}

function toReadableLabel(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toJourneyKnowledgeInsightsViewModel(
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

function toRecommendationPriority(priority: string): JourneyRecommendation["priority"] {
  if (priority === "urgent") {
    return "critical";
  }

  if (priority === "high" || priority === "medium" || priority === "low") {
    return priority;
  }

  return "medium";
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
      priority: toRecommendationPriority(recommendation.priority),
      generatedAt: pipelineResult.pipelineMetadata.executedAt,
    };
  });
}

export async function getJourneyWorkspacePipelineProjection(): Promise<JourneyWorkspacePipelineProjection> {
  const repository = createInMemoryBusinessPassportRepository();
  const businessPassportService = createBusinessPassportApplicationService({ repository });
  const journeyOrchestrator = createJourneyOrchestratorService({ businessPassportService });
  const pipeline = createInstitutionalPipelineService({ journeyOrchestrator });

  const pipelineResult = await pipeline.execute({
    pipelineId: "journey-workspace-pipeline",
    pipelineVersion: "R3-M1-S1",
    journeyContext: toJourneyContext(),
    recommendationId: DEFAULT_RECOMMENDATION_ID,
  });

  const businessPassport = toJourneyBusinessPassportViewModel(pipelineResult);
  const evidence = toJourneyEvidenceViewModel(pipelineResult);
  const knowledgeInsights = toJourneyKnowledgeInsightsViewModel(pipelineResult);

  const nextAction =
    pipelineResult.decisionPackage.metadata.packageStatus === "complete"
      ? "Complete evidence validation and route to Knowledge Generation."
      : "Resolve package traceability gaps before progressing the journey.";

  return {
    pipelineResult,
    businessPassport,
    evidence,
    knowledgeInsights,
    recommendations: toJourneyRecommendations(pipelineResult),
    missingItems: knowledgeInsights.missingInformation.map((item) => item.detail),
    nextAction,
    actions: [
      "Run evidence checklist review",
      "Escalate missing board resolution",
      "Prepare handoff for knowledge generation",
    ],
  };
}
