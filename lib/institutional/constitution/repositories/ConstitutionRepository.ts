import type { InstitutionalRepository } from "@/lib/institutional/core/InstitutionalRepository";
import type { Constitution } from "@/lib/institutional/constitution/domain/Constitution";
import type { ConstitutionId } from "@/lib/institutional/constitution/domain/Constitution";
import type { ConstitutionStatus } from "@/lib/institutional/constitution/constants/ConstitutionStatus";

export interface ConstitutionRepository extends InstitutionalRepository<Constitution> {
  findById(constitutionId: ConstitutionId): Promise<Constitution | null>;
  listByStatus(status: ConstitutionStatus): Promise<readonly Constitution[]>;
}
