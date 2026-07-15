import type { InstitutionReference } from "@/lib/institutional/core/InstitutionReference";

export interface InstitutionalProjection<T> {
  toSummary(entity: T): Readonly<Record<string, unknown>>;
  toReference(entity: T): InstitutionReference;
}
