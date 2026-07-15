import type { InstitutionalRepository } from "@/lib/institutional/core/InstitutionalRepository";
import type { Policy } from "@/lib/institutional/policy/domain/Policy";
import type { PolicyId } from "@/lib/institutional/policy/domain/Policy";
import type { PolicyStatus } from "@/lib/institutional/policy/constants/PolicyStatus";

export interface PolicyRepository extends InstitutionalRepository<Policy> {
  findById(policyId: PolicyId): Promise<Policy | null>;
  listByStatus(status: PolicyStatus): Promise<readonly Policy[]>;
}
