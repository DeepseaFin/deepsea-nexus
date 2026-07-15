import type { InstitutionId } from "@/lib/institutional/core/InstitutionId";
import type { InstitutionVersion } from "@/lib/institutional/core/InstitutionVersion";
import type { DoctrineId } from "@/lib/institutional/doctrine/domain/Doctrine";
import type { DoctrineStatus } from "@/lib/institutional/doctrine/constants/DoctrineStatus";

export interface DoctrineSummary {
  readonly doctrineId: DoctrineId;
  readonly institutionId: InstitutionId;
  readonly title: string;
  readonly version: InstitutionVersion;
  readonly status: DoctrineStatus;
  readonly effectiveFrom: string | null;
  readonly reviewedAt: string | null;
}
