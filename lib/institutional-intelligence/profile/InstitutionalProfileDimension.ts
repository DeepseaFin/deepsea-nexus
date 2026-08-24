import type { InstitutionalProfileCategory } from "@/lib/institutional-intelligence/profile/InstitutionalProfileCategory";

export enum InstitutionalProfileDimensionType {
  CorporateCharacteristics = "corporate_characteristics",
  OperationalMaturity = "operational_maturity",
  DocumentationQuality = "documentation_quality",
  KnowledgeStrength = "knowledge_strength",
  RegulatoryReadiness = "regulatory_readiness",
  RelationshipReadiness = "relationship_readiness",
}

export interface InstitutionalProfileDimension<TType extends InstitutionalProfileDimensionType = InstitutionalProfileDimensionType> {
  readonly type: TType;
  readonly category: InstitutionalProfileCategory;
  readonly score: number;
  readonly confidence: number;
  readonly contributingSignalIds: readonly string[];
  readonly summary: string;
}
