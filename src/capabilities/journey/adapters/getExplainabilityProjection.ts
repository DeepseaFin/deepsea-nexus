import type { ExplainabilityResult } from "@/lib/orchestration/explainability/ExplainabilityResult";

export interface ExplainabilityReasoningStepViewModel {
  readonly index: number;
  readonly title: string;
  readonly type: string;
  readonly description: string;
  readonly confidencePercent: string;
}

export interface ExplainabilityRiskViewModel {
  readonly id: string;
  readonly title: string;
  readonly severity: string;
  readonly description: string;
  readonly confidencePercent: string;
}

export interface ExplainabilityHealthDimensionViewModel {
  readonly type: string;
  readonly status: string;
  readonly summary: string;
  readonly scorePercent: string;
  readonly confidencePercent: string;
}

export interface ExplainabilityProfileDimensionViewModel {
  readonly type: string;
  readonly summary: string;
  readonly scorePercent: string;
  readonly confidencePercent: string;
}

export interface ExplainabilityBusinessSignalViewModel {
  readonly id: string;
  readonly title: string;
  readonly severity: string;
  readonly description: string;
  readonly confidencePercent: string;
}

export interface ExplainabilityInstitutionalFactViewModel {
  readonly id: string;
  readonly type: string;
  readonly label: string;
}

export interface ExplainabilityKnowledgeReferenceViewModel {
  readonly knowledgeId: string;
  readonly factName: string;
  readonly factValue: string;
  readonly confidencePercent: string;
  readonly verificationSource: string;
}

export interface ExplainabilityEvidenceReferenceViewModel {
  readonly evidenceId: string;
  readonly evidenceType: string;
  readonly status: string;
  readonly source: string;
  readonly documentVersion: string;
  readonly referenceCount: number;
}

export interface ExplainabilityMetadataViewModel {
  readonly recommendationId: string;
  readonly recommendationType: string;
  readonly recommendationPriority: string;
  readonly pathNodeCount: number;
  readonly supportingRiskCount: number;
  readonly supportingHealthDimensionCount: number;
  readonly supportingProfileDimensionCount: number;
  readonly supportingBusinessSignalCount: number;
  readonly supportingFactCount: number;
  readonly supportingKnowledgeCount: number;
  readonly supportingEvidenceCount: number;
}

export interface ExplainabilityProjection {
  readonly recommendationTitle: string;
  readonly overallConfidence: string;
  readonly orderedReasoningPath: readonly ExplainabilityReasoningStepViewModel[];
  readonly supportingRisks: readonly ExplainabilityRiskViewModel[];
  readonly institutionHealthDimensions: readonly ExplainabilityHealthDimensionViewModel[];
  readonly profileDimensions: readonly ExplainabilityProfileDimensionViewModel[];
  readonly businessSignals: readonly ExplainabilityBusinessSignalViewModel[];
  readonly institutionalFacts: readonly ExplainabilityInstitutionalFactViewModel[];
  readonly knowledgeReferences: readonly ExplainabilityKnowledgeReferenceViewModel[];
  readonly evidenceReferences: readonly ExplainabilityEvidenceReferenceViewModel[];
  readonly explanationMetadata: ExplainabilityMetadataViewModel;
}

function toPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function toReadableLabel(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getExplainabilityProjection(explainability: ExplainabilityResult): ExplainabilityProjection {
  return {
    recommendationTitle: explainability.recommendation.title,
    overallConfidence: toPercent(explainability.confidence),
    orderedReasoningPath: explainability.explanationPath.nodes.map((node, index) => ({
      index: index + 1,
      title: node.title,
      type: toReadableLabel(node.type),
      description: node.description,
      confidencePercent: toPercent(node.confidence),
    })),
    supportingRisks: explainability.supportingRisks.map((risk) => ({
      id: risk.id,
      title: risk.title,
      severity: toReadableLabel(risk.severity),
      description: risk.description,
      confidencePercent: toPercent(risk.confidence),
    })),
    institutionHealthDimensions: explainability.supportingHealthDimensions.map((dimension) => ({
      type: toReadableLabel(dimension.type),
      status: dimension.status,
      summary: dimension.summary,
      scorePercent: toPercent(dimension.score),
      confidencePercent: toPercent(dimension.confidence),
    })),
    profileDimensions: explainability.supportingProfileDimensions.map((dimension) => ({
      type: toReadableLabel(dimension.type),
      summary: dimension.summary,
      scorePercent: toPercent(dimension.score),
      confidencePercent: toPercent(dimension.confidence),
    })),
    businessSignals: explainability.supportingBusinessSignals.map((signal) => ({
      id: signal.id,
      title: signal.title,
      severity: toReadableLabel(signal.severity),
      description: signal.description,
      confidencePercent: toPercent(signal.confidence),
    })),
    institutionalFacts: explainability.supportingFacts.map((fact) => ({
      id: fact.id,
      type: toReadableLabel(fact.type),
      label: fact.label,
    })),
    knowledgeReferences: explainability.supportingKnowledge.map((fact) => ({
      knowledgeId: fact.knowledgeId.toString(),
      factName: toReadableLabel(fact.factName),
      factValue: String(fact.value),
      confidencePercent: toPercent(fact.confidence),
      verificationSource: fact.verificationSource,
    })),
    evidenceReferences: explainability.supportingEvidence.map((evidence) => ({
      evidenceId: evidence.evidenceId.toString(),
      evidenceType: toReadableLabel(evidence.evidenceType),
      status: toReadableLabel(evidence.status),
      source: toReadableLabel(evidence.source),
      documentVersion: evidence.metadata.documentVersion,
      referenceCount: evidence.references.length,
    })),
    explanationMetadata: {
      recommendationId: explainability.recommendation.id,
      recommendationType: toReadableLabel(explainability.recommendation.type),
      recommendationPriority: toReadableLabel(explainability.recommendation.priority),
      pathNodeCount: explainability.explanationPath.nodes.length,
      supportingRiskCount: explainability.supportingRisks.length,
      supportingHealthDimensionCount: explainability.supportingHealthDimensions.length,
      supportingProfileDimensionCount: explainability.supportingProfileDimensions.length,
      supportingBusinessSignalCount: explainability.supportingBusinessSignals.length,
      supportingFactCount: explainability.supportingFacts.length,
      supportingKnowledgeCount: explainability.supportingKnowledge.length,
      supportingEvidenceCount: explainability.supportingEvidence.length,
    },
  };
}
