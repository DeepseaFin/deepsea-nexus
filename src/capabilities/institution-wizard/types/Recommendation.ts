export interface Recommendation {
  readonly missingDocuments: readonly string[];
  readonly manualReviews: readonly string[];
  readonly nextAction: string;
}