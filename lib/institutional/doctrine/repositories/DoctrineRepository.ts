import type { InstitutionalRepository } from "@/lib/institutional/core/InstitutionalRepository";
import type { Doctrine } from "@/lib/institutional/doctrine/domain/Doctrine";
import type { DoctrineId } from "@/lib/institutional/doctrine/domain/Doctrine";
import type { DoctrineStatus } from "@/lib/institutional/doctrine/constants/DoctrineStatus";

export interface DoctrineRepository extends InstitutionalRepository<Doctrine> {
  findById(doctrineId: DoctrineId): Promise<Doctrine | null>;
  listByStatus(status: DoctrineStatus): Promise<readonly Doctrine[]>;
}
