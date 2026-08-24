import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import { evidenceMapper, type OracleDocumentEvidenceInput } from "@/lib/evidence/services/EvidenceMapper";
import { EvidenceId } from "@/lib/evidence/value-objects/EvidenceId";

export interface EvidenceFactory {
  createFromOracleDocument(
    input: OracleDocumentEvidenceInput,
    references?: readonly EvidenceReference[],
  ): Evidence;
}

export const evidenceFactory: EvidenceFactory = {
  createFromOracleDocument(
    input: OracleDocumentEvidenceInput,
    references: readonly EvidenceReference[] = [],
  ): Evidence {
    const mapped = evidenceMapper.mapOracleDocument(input);

    return {
      evidenceId: EvidenceId.create(mapped.evidenceId),
      evidenceType: mapped.evidenceType,
      status: mapped.status,
      source: mapped.source,
      metadata: mapped.metadata,
      references,
    };
  },
};