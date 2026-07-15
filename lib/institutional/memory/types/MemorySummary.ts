import type { InstitutionId } from "@/lib/institutional/core/InstitutionId";
import type { InstitutionVersion } from "@/lib/institutional/core/InstitutionVersion";
import type { MemoryId } from "@/lib/institutional/memory/domain/Memory";
import type { MemoryStatus } from "@/lib/institutional/memory/constants/MemoryStatus";

export interface MemorySummary {
  readonly memoryId: MemoryId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: MemoryStatus;
  readonly effectiveFrom: string | null;
  readonly reviewedAt: string | null;
}
