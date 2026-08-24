import { InstitutionClassification } from "@/lib/institutional/core/InstitutionClassification";
import type { InstitutionDocument } from "@/lib/institutional/core/InstitutionDocument";
import type { DoctrineStatus } from "@/lib/institutional/doctrine/constants/DoctrineStatus";

export type DoctrineId = string;

export interface Doctrine extends InstitutionDocument {
  readonly doctrineId: DoctrineId;
  readonly status: DoctrineStatus;
  readonly classification: InstitutionClassification;
}

export const DoctrineClassification: InstitutionClassification = InstitutionClassification.Doctrine;
