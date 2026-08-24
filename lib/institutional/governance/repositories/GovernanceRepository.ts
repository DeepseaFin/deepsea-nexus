import type { InstitutionalRepository } from "@/lib/institutional/core/InstitutionalRepository";
import type { Governance } from "@/lib/institutional/governance/domain/Governance";
import type { GovernanceId } from "@/lib/institutional/governance/domain/Governance";
import type { GovernanceStatus } from "@/lib/institutional/governance/constants/GovernanceStatus";

export interface GovernanceRepository extends InstitutionalRepository<Governance> {
  findById(governanceId: GovernanceId): Promise<Governance | null>;
  listByStatus(status: GovernanceStatus): Promise<readonly Governance[]>;
}
