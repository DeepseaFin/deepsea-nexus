import { InstitutionClassification } from "@/lib/institutional/core/InstitutionClassification";
import type { InstitutionDocument } from "@/lib/institutional/core/InstitutionDocument";
import type { MemoryStatus } from "@/lib/institutional/memory/constants/MemoryStatus";

export type MemoryId = string;

export interface Memory extends InstitutionDocument {
  readonly memoryId: MemoryId;
  readonly status: MemoryStatus;
  readonly classification: InstitutionClassification;
}

export const MemoryClassification: InstitutionClassification = InstitutionClassification.Memory;
