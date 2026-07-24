import type { InstitutionalVersion } from "@/src/framework/metadata/InstitutionalVersion";

export interface InstitutionalMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly version: InstitutionalVersion;
}