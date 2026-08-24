import type { InstitutionalRepository } from "@/lib/institutional/core/InstitutionalRepository";
import type { Memory } from "@/lib/institutional/memory/domain/Memory";
import type { MemoryId } from "@/lib/institutional/memory/domain/Memory";
import type { MemoryStatus } from "@/lib/institutional/memory/constants/MemoryStatus";

export interface MemoryRepository extends InstitutionalRepository<Memory> {
  findById(memoryId: MemoryId): Promise<Memory | null>;
  listByStatus(status: MemoryStatus): Promise<readonly Memory[]>;
}
