export interface KnowledgeAttribute<T> {
  value: T;
  confidence: number;
  source: string;
  updatedAt: string;
}
