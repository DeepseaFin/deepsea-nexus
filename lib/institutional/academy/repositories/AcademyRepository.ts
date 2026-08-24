import type { InstitutionalRepository } from "@/lib/institutional/core/InstitutionalRepository";
import type { Academy } from "@/lib/institutional/academy/domain/Academy";
import type { AcademyId } from "@/lib/institutional/academy/domain/Academy";
import type { AcademyStatus } from "@/lib/institutional/academy/constants/AcademyStatus";

export interface AcademyRepository extends InstitutionalRepository<Academy> {
  findById(academyId: AcademyId): Promise<Academy | null>;
  listByStatus(status: AcademyStatus): Promise<readonly Academy[]>;
}
