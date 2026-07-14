import type { EvidenceReference } from "@/lib/business-passport/types/EvidenceReference";

export interface ExplanationItem {
  readonly value: string;
  readonly confidence: number;
  readonly source: string;
  readonly reason: string;
  readonly supportingEvidence: readonly EvidenceReference[];
}