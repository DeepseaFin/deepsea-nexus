import type { Evidence } from "@/lib/evidence/domain/Evidence";
import {
  InstitutionHealthDimensionType,
  type InstitutionHealthDimension,
} from "@/lib/institutional-intelligence/health/InstitutionHealthDimension";
import {
  InstitutionalNodeType,
  type InstitutionalNode,
} from "@/lib/institutional-intelligence/domain/InstitutionalNode";
import {
  InstitutionalProfileDimensionType,
  type InstitutionalProfileDimension,
} from "@/lib/institutional-intelligence/profile/InstitutionalProfileDimension";
import type { Recommendation } from "@/lib/institutional-intelligence/recommendations/Recommendation";
import type { RiskSignal } from "@/lib/institutional-intelligence/risk/RiskSignal";
import type { BusinessSignal } from "@/lib/institutional-intelligence/signals/BusinessSignal";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { JourneyResult } from "@/lib/orchestration/JourneyResult";
import {
  ExplainabilityNodeType,
  type ExplainabilityNode,
} from "@/lib/orchestration/explainability/ExplainabilityNode";
import type { ExplainabilityResult } from "@/lib/orchestration/explainability/ExplainabilityResult";

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

function clampUnit(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

function uniqueById<T extends { readonly id: string }>(items: readonly T[]): readonly T[] {
  const registry = new Map<string, T>();

  for (const item of items) {
    registry.set(item.id, item);
  }

  return [...registry.values()];
}

function makeEvidenceReferenceNodeId(input: { readonly page: number; readonly section: string; readonly fragment: string }): string {
  return `evidence-reference:${input.page}:${input.section}:${input.fragment}`;
}

function toProfileDimensionType(healthDimensionType: InstitutionHealthDimensionType): InstitutionalProfileDimensionType {
  if (healthDimensionType === InstitutionHealthDimensionType.IdentityHealth) {
    return InstitutionalProfileDimensionType.CorporateCharacteristics;
  }

  if (healthDimensionType === InstitutionHealthDimensionType.DocumentationHealth) {
    return InstitutionalProfileDimensionType.DocumentationQuality;
  }

  if (healthDimensionType === InstitutionHealthDimensionType.OperationalHealth) {
    return InstitutionalProfileDimensionType.OperationalMaturity;
  }

  if (healthDimensionType === InstitutionHealthDimensionType.RegulatoryHealth) {
    return InstitutionalProfileDimensionType.RegulatoryReadiness;
  }

  if (healthDimensionType === InstitutionHealthDimensionType.KnowledgeHealth) {
    return InstitutionalProfileDimensionType.KnowledgeStrength;
  }

  return InstitutionalProfileDimensionType.RelationshipReadiness;
}

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return total / values.length;
}

function buildRecommendationNode(recommendation: Recommendation): ExplainabilityNode {
  return {
    id: recommendation.id,
    type: ExplainabilityNodeType.Recommendation,
    title: recommendation.title,
    description: recommendation.description,
    confidence: clampUnit(recommendation.confidence),
  };
}

function buildRiskNodes(risks: readonly RiskSignal[]): readonly ExplainabilityNode[] {
  return risks.map((risk) => ({
    id: risk.id,
    type: ExplainabilityNodeType.RiskSignal,
    title: risk.title,
    description: risk.description,
    confidence: clampUnit(risk.confidence),
  }));
}

function buildHealthNodes(dimensions: readonly InstitutionHealthDimension[]): readonly ExplainabilityNode[] {
  return dimensions.map((dimension) => ({
    id: `health-dimension:${dimension.type}`,
    type: ExplainabilityNodeType.HealthDimension,
    title: dimension.type,
    description: dimension.summary,
    confidence: clampUnit(dimension.confidence),
  }));
}

function buildProfileNodes(dimensions: readonly InstitutionalProfileDimension[]): readonly ExplainabilityNode[] {
  return dimensions.map((dimension) => ({
    id: `profile-dimension:${dimension.type}`,
    type: ExplainabilityNodeType.ProfileDimension,
    title: dimension.type,
    description: dimension.summary,
    confidence: clampUnit(dimension.confidence),
  }));
}

function buildSignalNodes(signals: readonly BusinessSignal[]): readonly ExplainabilityNode[] {
  return signals.map((signal) => ({
    id: signal.id,
    type: ExplainabilityNodeType.BusinessSignal,
    title: signal.title,
    description: signal.description,
    confidence: clampUnit(signal.confidence),
  }));
}

function buildFactNodes(facts: readonly InstitutionalNode[]): readonly ExplainabilityNode[] {
  return facts.map((fact) => ({
    id: fact.id,
    type: ExplainabilityNodeType.Fact,
    title: fact.label,
    description: `Fact node of type ${fact.type}.`,
    confidence:
      fact.type === InstitutionalNodeType.KnowledgeFact
        ? clampUnit(fact.attributes.confidence)
        : 1,
  }));
}

function buildKnowledgeNodes(knowledgeFacts: readonly KnowledgeFact[]): readonly ExplainabilityNode[] {
  return knowledgeFacts.map((knowledge) => ({
    id: `knowledge:${knowledge.knowledgeId.toString()}`,
    type: ExplainabilityNodeType.Knowledge,
    title: knowledge.factName,
    description: `Knowledge fact ${knowledge.factName} from ${knowledge.source}.`,
    confidence: clampUnit(knowledge.confidence),
  }));
}

function buildEvidenceNodes(evidence: readonly Evidence[]): readonly ExplainabilityNode[] {
  return evidence.map((item) => ({
    id: `evidence:${item.evidenceId.toString()}`,
    type: ExplainabilityNodeType.Evidence,
    title: item.metadata.documentVersion,
    description: `Evidence from ${item.metadata.sourceSystem}.`,
    confidence: 1,
  }));
}

export interface ExplainabilityEngine {
  explain(journeyResult: JourneyResult, recommendationId: string): ExplainabilityResult;
}

export class DefaultExplainabilityEngine implements ExplainabilityEngine {
  explain(journeyResult: JourneyResult, recommendationId: string): ExplainabilityResult {
    const artifacts = journeyResult.artifacts;
    const recommendation = artifacts.recommendations.find((item) => item.id === recommendationId);

    if (!recommendation) {
      throw new Error(`Recommendation ${recommendationId} was not found in JourneyResult.`);
    }

    const supportingRisks = uniqueById(
      artifacts.riskSignals.filter((risk) => recommendation.supportingRiskIds.includes(risk.id)),
    );

    const healthDimensionTypes = [...new Set(supportingRisks.flatMap((risk) => risk.supportingHealthDimensions))];

    const supportingHealthDimensions = uniqueById(
      healthDimensionTypes.map((dimensionType) => {
        const dimension = artifacts.institutionHealth.dimensions[dimensionType];
        return {
          id: `health-dimension:${dimension.type}`,
          ...dimension,
        };
      }),
    ).map((dimension) => {
      const { id: _id, ...healthDimension } = dimension;
      return healthDimension;
    });

    const profileDimensionTypes = [...new Set(healthDimensionTypes.map((type) => toProfileDimensionType(type)))];

    const supportingProfileDimensions = profileDimensionTypes.map(
      (dimensionType) => artifacts.institutionalProfile.dimensions[dimensionType],
    );

    const supportingSignalIds = [...new Set(
      supportingProfileDimensions.flatMap((dimension) => dimension.contributingSignalIds),
    )];

    const supportingBusinessSignals = uniqueById(
      artifacts.businessSignals.filter((signal) => supportingSignalIds.includes(signal.id)),
    );

    const supportingFactIds = [...new Set(
      supportingBusinessSignals.flatMap((signal) => signal.supportingFactIds),
    )];

    const supportingFacts = uniqueById(
      artifacts.institutionalFactGraph.nodes.filter((node) => supportingFactIds.includes(node.id)),
    );

    const supportingKnowledgeIdSet = new Set<string>();

    for (const fact of supportingFacts) {
      if (fact.type === InstitutionalNodeType.KnowledgeFact) {
        supportingKnowledgeIdSet.add(fact.attributes.knowledgeId);
      }
    }

    const supportingKnowledge = uniqueById(
      artifacts.knowledgeFacts
        .filter((knowledgeFact) => supportingKnowledgeIdSet.has(knowledgeFact.knowledgeId.toString()))
        .map((knowledgeFact) => ({
          id: knowledgeFact.knowledgeId.toString(),
          ...knowledgeFact,
        })),
    ).map((knowledge) => {
      const { id: _id, ...knowledgeFact } = knowledge;
      return knowledgeFact;
    });

    const supportingEvidenceIdSet = new Set<string>();
    const supportingReferenceNodeIds = new Set<string>();

    for (const fact of supportingFacts) {
      if (fact.type === InstitutionalNodeType.Evidence) {
        supportingEvidenceIdSet.add(fact.attributes.evidenceId);
      }

      if (fact.type === InstitutionalNodeType.EvidenceReference) {
        supportingReferenceNodeIds.add(makeEvidenceReferenceNodeId(fact.attributes));
      }
    }

    for (const knowledgeFact of supportingKnowledge) {
      for (const reference of knowledgeFact.evidenceReferences) {
        supportingReferenceNodeIds.add(makeEvidenceReferenceNodeId(reference));
      }
    }

    const supportingEvidence = uniqueById(
      artifacts.evidence
        .filter((item) => {
          if (supportingEvidenceIdSet.has(item.evidenceId.toString())) {
            return true;
          }

          return item.references.some((reference) => supportingReferenceNodeIds.has(makeEvidenceReferenceNodeId(reference)));
        })
        .map((item) => ({
          id: item.evidenceId.toString(),
          ...item,
        })),
    ).map((item) => {
      const { id: _id, ...evidence } = item;
      return evidence;
    });

    const explanationPath = {
      nodes: [
        buildRecommendationNode(recommendation),
        ...buildRiskNodes(supportingRisks),
        ...buildHealthNodes(supportingHealthDimensions),
        ...buildProfileNodes(supportingProfileDimensions),
        ...buildSignalNodes(supportingBusinessSignals),
        ...buildFactNodes(supportingFacts),
        ...buildKnowledgeNodes(supportingKnowledge),
        ...buildEvidenceNodes(supportingEvidence),
      ],
    };

    const explainabilityConfidence = clampUnit(average([
      recommendation.confidence,
      average(supportingRisks.map((risk) => risk.confidence)),
      average(supportingBusinessSignals.map((signal) => signal.confidence)),
      average(supportingKnowledge.map((knowledgeFact) => knowledgeFact.confidence)),
    ]));

    return deepFreeze({
      recommendation,
      supportingRisks,
      supportingHealthDimensions,
      supportingProfileDimensions,
      supportingBusinessSignals,
      supportingFacts,
      supportingKnowledge,
      supportingEvidence,
      confidence: explainabilityConfidence,
      explanationPath,
    });
  }
}

export const explainabilityEngine: ExplainabilityEngine = new DefaultExplainabilityEngine();
