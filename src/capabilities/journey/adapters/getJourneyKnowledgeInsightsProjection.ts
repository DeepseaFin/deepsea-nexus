import { getJourneyEvidenceProjectionResults } from "@/src/capabilities/journey/adapters/getJourneyEvidenceProjection";

export interface JourneyKnowledgeFactInsight {
  readonly factName: string;
  readonly factValue: string;
  readonly confidence: number;
}

export interface JourneyKnowledgeIndicator {
  readonly label: string;
  readonly detail: string;
}

export interface JourneyKnowledgeInsightsViewModel {
  readonly keyBusinessFacts: readonly JourneyKnowledgeFactInsight[];
  readonly riskIndicators: readonly JourneyKnowledgeIndicator[];
  readonly missingInformation: readonly JourneyKnowledgeIndicator[];
  readonly institutionalObservations: readonly JourneyKnowledgeIndicator[];
}

function toReadableLabel(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getJourneyKnowledgeInsightsProjection(): JourneyKnowledgeInsightsViewModel {
  const projectionResults = getJourneyEvidenceProjectionResults();

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