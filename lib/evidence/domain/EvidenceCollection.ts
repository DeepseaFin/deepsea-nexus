import type { Evidence } from "@/lib/evidence/domain/Evidence";

export interface EvidenceCollection {
  readonly items: readonly Evidence[];
}
