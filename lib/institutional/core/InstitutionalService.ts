import type { InstitutionStatus } from "@/lib/institutional/core/InstitutionStatus";

export interface InstitutionalService<T> {
  create(input: unknown): Promise<T>;
  get(entityId: string): Promise<T | null>;
  updateStatus(entityId: string, status: InstitutionStatus, updatedBy: string): Promise<T>;
}
