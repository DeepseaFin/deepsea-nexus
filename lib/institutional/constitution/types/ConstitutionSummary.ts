import type { InstitutionId } from "@/lib/institutional/core/InstitutionId";
import type { InstitutionVersion } from "@/lib/institutional/core/InstitutionVersion";
import type { ConstitutionId } from "@/lib/institutional/constitution/domain/Constitution";
import type { ConstitutionStatus } from "@/lib/institutional/constitution/constants/ConstitutionStatus";

export interface ConstitutionSummary {
  readonly constitutionId: ConstitutionId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: ConstitutionStatus;
  readonly effectiveFrom: string | null;
  readonly reviewedAt: string | null;
}
