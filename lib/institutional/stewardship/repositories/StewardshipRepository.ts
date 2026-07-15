import type { InstitutionalRepository } from "@/lib/institutional/core/InstitutionalRepository";
import type { Stewardship } from "@/lib/institutional/stewardship/domain/Stewardship";
import type { StewardshipId } from "@/lib/institutional/stewardship/domain/Stewardship";
import type { StewardshipStatus } from "@/lib/institutional/stewardship/constants/StewardshipStatus";

export interface StewardshipRepository extends InstitutionalRepository<Stewardship> {
  findById(stewardshipId: StewardshipId): Promise<Stewardship | null>;
  listByStatus(status: StewardshipStatus): Promise<readonly Stewardship[]>;
}
