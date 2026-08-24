import type { EvidenceSource } from "@/lib/evidence/constants/EvidenceSource";
import type { EvidenceStatus } from "@/lib/evidence/constants/EvidenceStatus";
import type { EvidenceType } from "@/lib/evidence/constants/EvidenceType";
import type { EvidenceMetadata } from "@/lib/evidence/domain/EvidenceMetadata";
import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import type { EvidenceId } from "@/lib/evidence/value-objects/EvidenceId";

export interface Evidence {
  readonly evidenceId: EvidenceId;
  readonly evidenceType: EvidenceType;
  readonly status: EvidenceStatus;
  readonly source: EvidenceSource;
  readonly metadata: EvidenceMetadata;
  readonly references: readonly EvidenceReference[];
}
