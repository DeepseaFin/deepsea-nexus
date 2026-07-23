import type { ExplainabilityNode } from "@/lib/orchestration/explainability/ExplainabilityNode";

export interface ExplainabilityPath {
  readonly nodes: readonly ExplainabilityNode[];
}
