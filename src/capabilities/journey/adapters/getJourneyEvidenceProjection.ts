import EvidencePanel from "@/components/atlas/intelligence/EvidencePanel";
import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import { evidenceFactory } from "@/lib/evidence/services/EvidenceFactory";
import type { OracleDocumentEvidenceInput } from "@/lib/evidence/services/EvidenceMapper";
import { evidenceKnowledgeMapper } from "@/lib/knowledge/services/EvidenceKnowledgeMapper";
import type { ComponentProps } from "react";
import { getJourneyProjectedBusinessPassport } from "@/src/capabilities/journey/adapters/getJourneyBusinessPassportProjection";

export type JourneyEvidenceViewModel = ComponentProps<typeof EvidencePanel>["evidence"];

interface JourneyEvidenceSeed {
  readonly oracleDocument: OracleDocumentEvidenceInput;
  readonly references: readonly EvidenceReference[];
}

const EVIDENCE_SEEDS: readonly JourneyEvidenceSeed[] = [
  {
    oracleDocument: {
      documentId: "ev-001",
      documentCode: "Certificate of Incorporation",
      mimeType: "application/pdf",
      checksum: "sha256-cert-incorporation",
      uploadedAt: "2026-07-12T14:45:00Z",
      uploadedBy: "Operations",
    },
    references: [
      { page: 1, section: "legalName", fragment: "Northstar Exports LLC" },
      { page: 1, section: "registrationNumber", fragment: "REG-77421" },
      { page: 1, section: "jurisdiction", fragment: "UAE" },
      { page: 1, section: "entityType", fragment: "Limited Liability Company" },
      { page: 1, section: "expiryDate", fragment: "2028-12-31" },
    ],
  },
  {
    oracleDocument: {
      documentId: "ev-002",
      documentCode: "Trade License",
      mimeType: "application/pdf",
      checksum: "sha256-trade-license",
      uploadedAt: "2026-07-13T08:35:00Z",
      uploadedBy: "ORACLE Pipeline",
    },
    references: [
      { page: 2, section: "legalName", fragment: "Northstar Exports LLC" },
      { page: 2, section: "registrationNumber", fragment: "REG-77421" },
      { page: 2, section: "jurisdiction", fragment: "UAE" },
      { page: 2, section: "entityType", fragment: "Limited Liability Company" },
      { page: 2, section: "expiryDate", fragment: "2027-09-30" },
    ],
  },
  {
    oracleDocument: {
      documentId: "ev-003",
      documentCode: "Board Resolution",
      mimeType: "application/pdf",
      checksum: "sha256-board-resolution",
      uploadedAt: "2026-07-13T09:20:00Z",
      uploadedBy: "Journey Operator",
    },
    references: [
      { page: 3, section: "legalName", fragment: "Northstar Exports LLC" },
      { page: 3, section: "registrationNumber", fragment: "REG-77421" },
      { page: 3, section: "jurisdiction", fragment: "UAE" },
      { page: 3, section: "entityType", fragment: "Limited Liability Company" },
      { page: 3, section: "expiryDate", fragment: "2027-01-15" },
    ],
  },
];

export function getJourneyEvidenceProjection(): JourneyEvidenceViewModel {
  const projectedPassport = getJourneyProjectedBusinessPassport();

  return EVIDENCE_SEEDS.map((seed) => {
    const evidence = evidenceFactory.createFromOracleDocument(seed.oracleDocument, seed.references);
    const knowledgeProjection = evidenceKnowledgeMapper.mapEvidence(evidence);

    return {
      id: evidence.evidenceId.toString(),
      title: evidence.metadata.documentVersion,
      description: `Projection-backed evidence captured from ${evidence.metadata.sourceSystem} for institutional review continuity.`,
      source: evidence.source,
      confidence: knowledgeProjection.confidenceSummary.averageConfidence,
    };
  }).map((item) => ({
    ...item,
    // Preserves projection-executed journey context while keeping the panel shape stable.
    description: `${item.description} Passport ${projectedPassport.passportId.toString()} is synchronized.`,
  }));
}