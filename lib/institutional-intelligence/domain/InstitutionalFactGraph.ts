import type { InstitutionalEdge } from "@/lib/institutional-intelligence/domain/InstitutionalEdge";
import type { InstitutionalNode } from "@/lib/institutional-intelligence/domain/InstitutionalNode";

export interface InstitutionalFactGraph {
  readonly institutionId: string;
  readonly generatedAt: string;
  readonly nodes: readonly InstitutionalNode[];
  readonly edges: readonly InstitutionalEdge[];
}
