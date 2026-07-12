import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { EvidenceCollection } from "@/lib/evidence/domain/EvidenceCollection";
import type { EvidenceId } from "@/lib/evidence/value-objects/EvidenceId";

export interface EvidenceRepository {
  findById(evidenceId: EvidenceId): Promise<Evidence | null>;
  listByDocumentId(documentId: string): Promise<readonly Evidence[]>;
  save(evidence: Evidence): Promise<void>;
  saveCollection(collection: EvidenceCollection): Promise<void>;
}
