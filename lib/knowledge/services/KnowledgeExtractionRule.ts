export interface KnowledgeExtractionRule {
  readonly ruleId: string;
  readonly description: string;
  readonly sourceField: string;
  readonly targetKnowledgeFact: string;
  readonly required: boolean;
}
