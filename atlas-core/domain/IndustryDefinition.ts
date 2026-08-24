export interface IndustryDefinition {
  id: string;
  name: string;
  description: string;
  metadata: Record<string, unknown>;
  futureExtensibility: string[];
}
