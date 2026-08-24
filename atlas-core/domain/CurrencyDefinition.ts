export interface CurrencyDefinition {
  id: string;
  name: string;
  description: string;
  metadata: Record<string, unknown>;
  futureExtensibility: string[];
}
