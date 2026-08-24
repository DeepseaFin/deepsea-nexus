export type InstitutionNavigationKey =
  | "dashboard"
  | "timeline"
  | "health"
  | "documents"
  | "decisions"
  | "knowledge"
  | "advisor";

export interface InstitutionNavigationItem {
  readonly key: InstitutionNavigationKey;
  readonly label: string;
}

export interface InstitutionKpi {
  readonly label: string;
  readonly value: string;
  readonly note: string;
}

export interface InstitutionTimelineItem {
  readonly id: string;
  readonly timestamp: string;
  readonly title: string;
  readonly actor: string;
  readonly detail: string;
}

export interface InstitutionHealthMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly trend: string;
  readonly status: "strong" | "watch" | "critical";
}

export interface InstitutionHealthState {
  readonly score: number;
  readonly status: "strong" | "watch" | "critical";
  readonly reviewedAt: string;
  readonly metrics: readonly InstitutionHealthMetric[];
}

export interface InstitutionDocumentItem {
  readonly id: string;
  readonly title: string;
  readonly classification: string;
  readonly status: "draft" | "active" | "superseded";
  readonly version: string;
  readonly reviewedAt: string;
}

export interface InstitutionDecisionItem {
  readonly id: string;
  readonly title: string;
  readonly outcome: string;
  readonly owner: string;
  readonly decidedAt: string;
}

export interface InstitutionKnowledgeNode {
  readonly id: string;
  readonly label: string;
  readonly type: string;
}

export interface InstitutionKnowledgeEdge {
  readonly sourceId: string;
  readonly targetId: string;
  readonly relation: string;
}

export interface InstitutionKnowledgeGraphState {
  readonly nodes: readonly InstitutionKnowledgeNode[];
  readonly edges: readonly InstitutionKnowledgeEdge[];
}

export interface InstitutionAiAdvisorState {
  readonly summary: string;
  readonly recommendations: readonly string[];
  readonly alerts: readonly string[];
}

export interface InstitutionWorkspaceState {
  readonly institutionId: string;
  readonly institutionName: string;
  readonly classification: string;
  readonly status: string;
  readonly version: string;
  readonly reviewedAt: string;
  readonly navigation: readonly InstitutionNavigationItem[];
  readonly kpis: readonly InstitutionKpi[];
  readonly timeline: readonly InstitutionTimelineItem[];
  readonly health: InstitutionHealthState;
  readonly documents: readonly InstitutionDocumentItem[];
  readonly decisionFeed: readonly InstitutionDecisionItem[];
  readonly knowledgeGraph: InstitutionKnowledgeGraphState;
  readonly aiAdvisor: InstitutionAiAdvisorState;
}
