import type { InstitutionId } from "@/lib/institutional/core/InstitutionId";
import type { InstitutionVersion } from "@/lib/institutional/core/InstitutionVersion";
import type { AcademyId } from "@/lib/institutional/academy/domain/Academy";
import type { AcademyStatus } from "@/lib/institutional/academy/constants/AcademyStatus";

export interface AcademySummary {
  readonly academyId: AcademyId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: AcademyStatus;
  readonly effectiveFrom: string | null;
  readonly reviewedAt: string | null;
}
