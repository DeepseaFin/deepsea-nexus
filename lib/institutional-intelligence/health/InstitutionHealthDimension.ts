import type { InstitutionHealthCategory } from "@/lib/institutional-intelligence/health/InstitutionHealthCategory";

export enum InstitutionHealthDimensionType {
  IdentityHealth = "identity_health",
  DocumentationHealth = "documentation_health",
  OperationalHealth = "operational_health",
  RegulatoryHealth = "regulatory_health",
  KnowledgeHealth = "knowledge_health",
  RelationshipHealth = "relationship_health",
}

export enum InstitutionHealthStatus {
  Excellent = "Excellent",
  Good = "Good",
  Fair = "Fair",
  Weak = "Weak",
  Critical = "Critical",
}

export interface InstitutionHealthDimension<TType extends InstitutionHealthDimensionType = InstitutionHealthDimensionType> {
  readonly type: TType;
  readonly category: InstitutionHealthCategory;
  readonly score: number;
  readonly confidence: number;
  readonly status: InstitutionHealthStatus;
  readonly summary: string;
}
