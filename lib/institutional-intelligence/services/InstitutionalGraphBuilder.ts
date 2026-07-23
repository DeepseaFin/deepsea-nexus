import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { InstitutionalEdge } from "@/lib/institutional-intelligence/domain/InstitutionalEdge";
import { InstitutionalEdgeType } from "@/lib/institutional-intelligence/domain/InstitutionalEdge";
import type { InstitutionalFactGraph } from "@/lib/institutional-intelligence/domain/InstitutionalFactGraph";
import type { InstitutionalNode } from "@/lib/institutional-intelligence/domain/InstitutionalNode";
import { InstitutionalNodeType } from "@/lib/institutional-intelligence/domain/InstitutionalNode";
import type { InstitutionalGraphSource } from "@/lib/institutional-intelligence/types/InstitutionalGraphSource";

interface NodeRegistry {
  readonly nodes: Map<string, InstitutionalNode>;
  readonly edges: Map<string, InstitutionalEdge>;
}

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

function addNode(registry: NodeRegistry, node: InstitutionalNode): void {
  if (!registry.nodes.has(node.id)) {
    registry.nodes.set(node.id, node);
  }
}

function addEdge(registry: NodeRegistry, edge: InstitutionalEdge): void {
  if (!registry.edges.has(edge.id)) {
    registry.edges.set(edge.id, edge);
  }
}

function normalizeFactName(factName: string): string {
  return factName.trim().toLowerCase();
}

function matchesFactCategory(factName: string, keywords: readonly string[]): boolean {
  const normalized = normalizeFactName(factName);
  return keywords.some((keyword) => normalized.includes(keyword));
}

function toStringArray(value: unknown): readonly string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }

  if (value && typeof value === "object") {
    const entries = Object.values(value as Record<string, unknown>)
      .flatMap((entry) => toStringArray(entry))
      .filter((entry) => entry.length > 0);
    return entries;
  }

  return [];
}

function makeInstitutionNodeId(passportId: string): string {
  return `institution:${passportId}`;
}

function makeIdentityNodeId(passportId: string): string {
  return `identity:${passportId}`;
}

function makeEvidenceNodeId(evidenceId: string): string {
  return `evidence:${evidenceId}`;
}

function makeDocumentNodeId(documentId: string, documentVersion: string): string {
  return `document:${documentId}:${documentVersion}`;
}

function makeKnowledgeFactNodeId(knowledgeId: string): string {
  return `knowledge-fact:${knowledgeId}`;
}

function makeEvidenceReferenceNodeId(reference: EvidenceReference): string {
  return `evidence-reference:${reference.page}:${reference.section}:${reference.fragment}`;
}

function createRegistry(): NodeRegistry {
  return {
    nodes: new Map<string, InstitutionalNode>(),
    edges: new Map<string, InstitutionalEdge>(),
  };
}

function buildIdentityNodeLabel(legalName: string | undefined): string {
  return legalName && legalName.trim().length > 0
    ? legalName
    : "Institution Identity";
}

function collectEvidence(source: InstitutionalGraphSource) {
  const output = [...(source.evidence ?? [])];

  for (const result of source.onboardingResults ?? []) {
    output.push(result.evidence);
  }

  return output;
}

function collectKnowledgeFacts(source: InstitutionalGraphSource): readonly KnowledgeFact[] {
  const output = [...(source.knowledgeFacts ?? [])];

  for (const result of source.onboardingResults ?? []) {
    output.push(...result.knowledge.facts);
  }

  return output;
}

export interface InstitutionalGraphBuilder {
  build(source: InstitutionalGraphSource): InstitutionalFactGraph;
}

export class DefaultInstitutionalGraphBuilder implements InstitutionalGraphBuilder {
  build(source: InstitutionalGraphSource): InstitutionalFactGraph {
    const passportId = source.passport.passportId.toString();
    const institutionNodeId = makeInstitutionNodeId(passportId);
    const identityNodeId = makeIdentityNodeId(passportId);

    const registry = createRegistry();

    addNode(registry, {
      id: institutionNodeId,
      type: InstitutionalNodeType.Institution,
      label: source.passport.profiles.identityProfile.legalName ?? passportId,
      attributes: {
        passportId,
        status: source.passport.status,
        lifecycle: source.passport.lifecycle,
        createdAt: source.passport.metadata.audit.createdAt,
        updatedAt: source.passport.metadata.audit.updatedAt,
      },
    });

    addNode(registry, {
      id: identityNodeId,
      type: InstitutionalNodeType.Identity,
      label: buildIdentityNodeLabel(source.passport.profiles.identityProfile.legalName),
      attributes: {
        legalName: source.passport.profiles.identityProfile.legalName,
        tradingName: source.passport.profiles.identityProfile.tradingName,
        registrationNumber: source.passport.profiles.identityProfile.registrationNumber,
        jurisdiction: source.passport.profiles.identityProfile.jurisdiction,
        country: source.passport.profiles.identityProfile.country,
        incorporationDate: source.passport.profiles.identityProfile.incorporationDate,
        entityType: source.passport.profiles.identityProfile.entityType,
        industry: source.passport.profiles.identityProfile.industry,
        website: source.passport.profiles.identityProfile.website,
      },
    });

    addEdge(registry, {
      id: `${institutionNodeId}->${identityNodeId}:${InstitutionalEdgeType.HasIdentity}`,
      type: InstitutionalEdgeType.HasIdentity,
      fromNodeId: institutionNodeId,
      toNodeId: identityNodeId,
      attributes: {
        source: "passport",
      },
    });

    for (const evidence of collectEvidence(source)) {
      const evidenceId = evidence.evidenceId.toString();
      const evidenceNodeId = makeEvidenceNodeId(evidenceId);
      const documentNodeId = makeDocumentNodeId(evidence.metadata.documentId, evidence.metadata.documentVersion);

      addNode(registry, {
        id: evidenceNodeId,
        type: InstitutionalNodeType.Evidence,
        label: evidence.metadata.documentVersion,
        attributes: {
          evidenceId,
          source: evidence.source,
          status: evidence.status,
          evidenceType: evidence.evidenceType,
        },
      });

      addEdge(registry, {
        id: `${institutionNodeId}->${evidenceNodeId}:${InstitutionalEdgeType.HasEvidence}`,
        type: InstitutionalEdgeType.HasEvidence,
        fromNodeId: institutionNodeId,
        toNodeId: evidenceNodeId,
        attributes: {
          source: "evidence",
        },
      });

      addNode(registry, {
        id: documentNodeId,
        type: InstitutionalNodeType.Document,
        label: evidence.metadata.documentId,
        attributes: {
          documentId: evidence.metadata.documentId,
          documentVersion: evidence.metadata.documentVersion,
          mimeType: evidence.metadata.mimeType,
          uploadedAt: evidence.metadata.uploadedAt,
          uploadedBy: evidence.metadata.uploadedBy,
          checksum: evidence.metadata.checksum,
          sourceSystem: evidence.metadata.sourceSystem,
        },
      });

      addEdge(registry, {
        id: `${institutionNodeId}->${documentNodeId}:${InstitutionalEdgeType.HasDocument}:${evidenceId}`,
        type: InstitutionalEdgeType.HasDocument,
        fromNodeId: institutionNodeId,
        toNodeId: documentNodeId,
        attributes: {
          source: "evidence",
          evidenceId,
        },
      });

      for (const reference of evidence.references) {
        const referenceNodeId = makeEvidenceReferenceNodeId(reference);

        addNode(registry, {
          id: referenceNodeId,
          type: InstitutionalNodeType.EvidenceReference,
          label: `${reference.section} (p.${reference.page})`,
          attributes: reference,
        });

        addEdge(registry, {
          id: `${evidenceNodeId}->${referenceNodeId}:${InstitutionalEdgeType.HasEvidenceReference}`,
          type: InstitutionalEdgeType.HasEvidenceReference,
          fromNodeId: evidenceNodeId,
          toNodeId: referenceNodeId,
          attributes: {
            source: "evidence",
          },
        });
      }
    }

    for (const fact of collectKnowledgeFacts(source)) {
      const factId = fact.knowledgeId.toString();
      const factNodeId = makeKnowledgeFactNodeId(factId);

      addNode(registry, {
        id: factNodeId,
        type: InstitutionalNodeType.KnowledgeFact,
        label: fact.factName,
        attributes: {
          knowledgeId: factId,
          factName: fact.factName,
          value: fact.value,
          confidence: fact.confidence,
          verified: fact.verified,
          verificationSource: fact.verificationSource,
          effectiveDate: fact.effectiveDate,
          lastVerified: fact.lastVerified,
          source: fact.source,
          status: fact.status,
          knowledgeType: fact.knowledgeType,
        },
      });

      addEdge(registry, {
        id: `${institutionNodeId}->${factNodeId}:${InstitutionalEdgeType.HasKnowledgeFact}`,
        type: InstitutionalEdgeType.HasKnowledgeFact,
        fromNodeId: institutionNodeId,
        toNodeId: factNodeId,
        attributes: {
          source: "knowledge",
        },
      });

      for (const reference of fact.evidenceReferences) {
        const referenceNodeId = makeEvidenceReferenceNodeId(reference);

        addNode(registry, {
          id: referenceNodeId,
          type: InstitutionalNodeType.EvidenceReference,
          label: `${reference.section} (p.${reference.page})`,
          attributes: reference,
        });

        addEdge(registry, {
          id: `${referenceNodeId}->${factNodeId}:${InstitutionalEdgeType.SupportsKnowledgeFact}`,
          type: InstitutionalEdgeType.SupportsKnowledgeFact,
          fromNodeId: referenceNodeId,
          toNodeId: factNodeId,
          attributes: {
            source: "knowledge",
          },
        });
      }

      const asValues = toStringArray(fact.value);
      const factName = normalizeFactName(fact.factName);

      if (matchesFactCategory(factName, ["director", "board_member", "board member"])) {
        for (const fullName of asValues) {
          const directorNodeId = `director:${passportId}:${fullName.toLowerCase()}`;

          addNode(registry, {
            id: directorNodeId,
            type: InstitutionalNodeType.Director,
            label: fullName,
            attributes: {
              fullName,
              source: "knowledge",
              sourceFactName: fact.factName,
            },
          });

          addEdge(registry, {
            id: `${institutionNodeId}->${directorNodeId}:${InstitutionalEdgeType.HasDirector}`,
            type: InstitutionalEdgeType.HasDirector,
            fromNodeId: institutionNodeId,
            toNodeId: directorNodeId,
            attributes: {
              source: "knowledge",
              sourceFactName: fact.factName,
            },
          });
        }
      }

      if (matchesFactCategory(factName, ["shareholder", "owner", "beneficial_owner", "beneficial owner"])) {
        for (const name of asValues) {
          const shareholderNodeId = `shareholder:${passportId}:${name.toLowerCase()}`;

          addNode(registry, {
            id: shareholderNodeId,
            type: InstitutionalNodeType.Shareholder,
            label: name,
            attributes: {
              name,
              source: "knowledge",
              sourceFactName: fact.factName,
            },
          });

          addEdge(registry, {
            id: `${institutionNodeId}->${shareholderNodeId}:${InstitutionalEdgeType.HasShareholder}`,
            type: InstitutionalEdgeType.HasShareholder,
            fromNodeId: institutionNodeId,
            toNodeId: shareholderNodeId,
            attributes: {
              source: "knowledge",
              sourceFactName: fact.factName,
            },
          });
        }
      }

      if (matchesFactCategory(factName, ["licence", "license", "permit", "registration"])) {
        for (const licenceValue of asValues) {
          const licenceNodeId = `licence:${passportId}:${licenceValue.toLowerCase()}`;

          addNode(registry, {
            id: licenceNodeId,
            type: InstitutionalNodeType.Licence,
            label: licenceValue,
            attributes: {
              licenceValue,
              source: "knowledge",
              sourceFactName: fact.factName,
            },
          });

          addEdge(registry, {
            id: `${institutionNodeId}->${licenceNodeId}:${InstitutionalEdgeType.HasLicence}`,
            type: InstitutionalEdgeType.HasLicence,
            fromNodeId: institutionNodeId,
            toNodeId: licenceNodeId,
            attributes: {
              source: "knowledge",
              sourceFactName: fact.factName,
            },
          });
        }
      }

      if (matchesFactCategory(factName, ["activity", "activities", "business_activity", "business activity"])) {
        for (const activityValue of asValues) {
          const activityNodeId = `activity:${passportId}:${activityValue.toLowerCase()}`;

          addNode(registry, {
            id: activityNodeId,
            type: InstitutionalNodeType.Activity,
            label: activityValue,
            attributes: {
              activityValue,
              source: "knowledge",
              sourceFactName: fact.factName,
            },
          });

          addEdge(registry, {
            id: `${institutionNodeId}->${activityNodeId}:${InstitutionalEdgeType.HasActivity}`,
            type: InstitutionalEdgeType.HasActivity,
            fromNodeId: institutionNodeId,
            toNodeId: activityNodeId,
            attributes: {
              source: "knowledge",
              sourceFactName: fact.factName,
            },
          });
        }
      }
    }

    return deepFreeze({
      institutionId: passportId,
      generatedAt: new Date().toISOString(),
      nodes: [...registry.nodes.values()],
      edges: [...registry.edges.values()],
    });
  }
}

export const institutionalGraphBuilder: InstitutionalGraphBuilder = new DefaultInstitutionalGraphBuilder();
