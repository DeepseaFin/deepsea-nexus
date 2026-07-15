import type { InstitutionAudit } from "@/lib/institutional/core/InstitutionAudit";
import type { InstitutionClassification } from "@/lib/institutional/core/InstitutionClassification";
import type { InstitutionCustodian } from "@/lib/institutional/core/InstitutionCustodian";
import type { InstitutionEvent } from "@/lib/institutional/core/InstitutionEvent";
import type { InstitutionId } from "@/lib/institutional/core/InstitutionId";
import type { InstitutionLifecycle } from "@/lib/institutional/core/InstitutionLifecycle";
import type { InstitutionMetadata } from "@/lib/institutional/core/InstitutionMetadata";
import type { InstitutionOwner } from "@/lib/institutional/core/InstitutionOwner";
import type { InstitutionReference } from "@/lib/institutional/core/InstitutionReference";
import type { InstitutionalService } from "@/lib/institutional/core/InstitutionalService";
import type { InstitutionVersion } from "@/lib/institutional/core/InstitutionVersion";
import type { MemoryStatus } from "@/lib/institutional/memory/constants/MemoryStatus";
import type { Memory } from "@/lib/institutional/memory/domain/Memory";
import type { MemoryId } from "@/lib/institutional/memory/domain/Memory";
import type { MemorySummary } from "@/lib/institutional/memory/types/MemorySummary";

export interface CreateMemoryInput {
  readonly memoryId: MemoryId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: MemoryStatus;
  readonly classification: InstitutionClassification;
  readonly owner: InstitutionOwner;
  readonly custodian: InstitutionCustodian;
  readonly reviewerIds: readonly string[];
  readonly approverIds: readonly string[];
  readonly metadata: InstitutionMetadata;
  readonly lifecycle: InstitutionLifecycle;
  readonly audit: InstitutionAudit;
  readonly references: readonly InstitutionReference[];
  readonly events: readonly InstitutionEvent[];
}

export interface MemoryService extends InstitutionalService<Memory> {
  create(input: CreateMemoryInput): Promise<Memory>;
  get(memoryId: MemoryId): Promise<Memory | null>;
  updateStatus(memoryId: MemoryId, status: MemoryStatus, updatedBy: string): Promise<Memory>;
  summarize(memoryId: MemoryId): Promise<MemorySummary | null>;
}
