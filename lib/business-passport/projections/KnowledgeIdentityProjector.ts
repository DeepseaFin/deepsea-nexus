import { ConfidenceBand, type Confidence } from "@/lib/business-passport/types/Confidence";
import { KnowledgeDensityBand } from "@/lib/business-passport/types/KnowledgeDensity";
import { InstitutionalPulseState } from "@/lib/business-passport/types/InstitutionalPulse";
import { EvidenceReferenceType, type EvidenceReference } from "@/lib/business-passport/types/EvidenceReference";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { IdentityProfile } from "@/lib/business-passport/domain/Profiles";
import type { KnowledgeProjectionResult } from "@/lib/business-passport/projections/KnowledgeProjectionResult";
import type { ProjectionMetadata } from "@/lib/business-passport/projections/ProjectionMetadata";
import type { KnowledgeCollection } from "@/lib/knowledge/domain/KnowledgeCollection";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";

const SUPPORTED_IDENTITY_FACTS = [
  "legalName",
  "registrationNumber",
  "jurisdiction",
  "entityType",
  "incorporationDate",
] as const;

type SupportedIdentityFact = (typeof SUPPORTED_IDENTITY_FACTS)[number];

function isSupportedIdentityFact(value: string): value is SupportedIdentityFact {
  return SUPPORTED_IDENTITY_FACTS.includes(value as SupportedIdentityFact);
}

function toConfidenceBand(score: number): ConfidenceBand {
  if (score >= 90) {
    return ConfidenceBand.VeryHigh;
  }

  if (score >= 75) {
    return ConfidenceBand.High;
  }

  if (score >= 50) {
    return ConfidenceBand.Moderate;
  }

  if (score >= 25) {
    return ConfidenceBand.Low;
  }

  return ConfidenceBand.VeryLow;
}

function buildEvidenceReference(fact: KnowledgeFact): EvidenceReference {
  const firstReference = fact.evidenceReferences[0];
  const locator = firstReference
    ? `page=${firstReference.page};section=${firstReference.section};fragment=${firstReference.fragment}`
    : undefined;

  return {
    evidenceId: fact.knowledgeId.toString(),
    referenceType: EvidenceReferenceType.Document,
    source: fact.verificationSource,
    capturedAt: fact.lastVerified,
    confidence: fact.confidence,
    locator,
  };
}

function selectPreferredFact(current: KnowledgeFact | undefined, candidate: KnowledgeFact): KnowledgeFact {
  if (!current) {
    return candidate;
  }

  if (candidate.confidence > current.confidence) {
    return candidate;
  }

  if (candidate.confidence < current.confidence) {
    return current;
  }

  return candidate.lastVerified > current.lastVerified ? candidate : current;
}

function collectIdentityFacts(collection: KnowledgeCollection): {
  readonly selectedFacts: Partial<Record<SupportedIdentityFact, KnowledgeFact>>;
  readonly warnings: readonly string[];
} {
  const selectedFacts: Partial<Record<SupportedIdentityFact, KnowledgeFact>> = {};
  const warnings: string[] = [];

  for (const fact of collection.facts) {
    if (!isSupportedIdentityFact(fact.factName)) {
      continue;
    }

    if (typeof fact.value !== "string" || fact.value.trim().length === 0) {
      warnings.push(`Knowledge fact ${fact.factName} was ignored because it does not contain a non-empty string value.`);
      continue;
    }

    selectedFacts[fact.factName] = selectPreferredFact(selectedFacts[fact.factName], fact);
  }

  return {
    selectedFacts,
    warnings,
  };
}

function deriveGeneratedAt(passport: BusinessPassport, facts: readonly KnowledgeFact[]): string {
  const latestFactTimestamp = facts.reduce<string | undefined>((latest, fact) => {
    if (!latest || fact.lastVerified > latest) {
      return fact.lastVerified;
    }

    return latest;
  }, undefined);

  return latestFactTimestamp ?? passport.metadata.audit.updatedAt;
}

function deriveIdentityConfidence(
  currentConfidence: Confidence,
  facts: readonly KnowledgeFact[],
  assessedAt: string,
): Confidence {
  if (facts.length === 0) {
    return currentConfidence;
  }

  const score = Math.round(facts.reduce((sum, fact) => sum + fact.confidence, 0) / facts.length);

  return {
    score,
    band: toConfidenceBand(score),
    assessedAt,
    breakdown: facts.map((fact) => ({
      dimension: fact.factName,
      score: fact.confidence,
      weight: 1 / facts.length,
    })),
  };
}

function buildProjectionMetadata(passport: BusinessPassport, confidence: Confidence, generatedAt: string): ProjectionMetadata {
  return {
    projectionVersion: "1.0.0",
    projectionName: "knowledge_identity_projection",
    generatedAt,
    generator: "KnowledgeIdentityProjector",
    confidence,
    knowledgeDensity: {
      ...passport.knowledgeDensity,
      assessedAt: generatedAt,
      band: passport.knowledgeDensity.band ?? KnowledgeDensityBand.Sparse,
    },
    institutionalPulse: {
      ...passport.institutionalPulse,
      measuredAt: generatedAt,
      state: passport.institutionalPulse.state ?? InstitutionalPulseState.Stable,
    },
  };
}

export interface KnowledgeIdentityProjector {
  project(knowledgeCollection: KnowledgeCollection, currentPassport: BusinessPassport): KnowledgeProjectionResult;
}

export const knowledgeIdentityProjector: KnowledgeIdentityProjector = {
  project(knowledgeCollection: KnowledgeCollection, currentPassport: BusinessPassport): KnowledgeProjectionResult {
    const { selectedFacts, warnings } = collectIdentityFacts(knowledgeCollection);
    const selectedFactList = Object.values(selectedFacts);
    const generatedAt = deriveGeneratedAt(currentPassport, selectedFactList);
    const confidence = deriveIdentityConfidence(currentPassport.profiles.identityProfile.confidence, selectedFactList, generatedAt);

    const updatedIdentityProfile: IdentityProfile = {
      ...currentPassport.profiles.identityProfile,
      legalName: selectedFacts.legalName?.value as string | undefined ?? currentPassport.profiles.identityProfile.legalName,
      registrationNumber:
        (selectedFacts.registrationNumber?.value as string | undefined) ?? currentPassport.profiles.identityProfile.registrationNumber,
      jurisdiction:
        (selectedFacts.jurisdiction?.value as string | undefined) ?? currentPassport.profiles.identityProfile.jurisdiction,
      entityType:
        (selectedFacts.entityType?.value as string | undefined) ?? currentPassport.profiles.identityProfile.entityType,
      incorporationDate:
        (selectedFacts.incorporationDate?.value as string | undefined) ?? currentPassport.profiles.identityProfile.incorporationDate,
      lastUpdatedAt: generatedAt,
      confidence,
      evidence: selectedFactList.map(buildEvidenceReference),
    };

    const updatedPassport: BusinessPassport = {
      ...currentPassport,
      profiles: {
        ...currentPassport.profiles,
        identityProfile: updatedIdentityProfile,
      },
    };

    return {
      updatedPassport,
      updatedProfiles: {
        identityProfile: updatedIdentityProfile,
      },
      warnings,
      projectionMetadata: buildProjectionMetadata(currentPassport, confidence, generatedAt),
    };
  },
};