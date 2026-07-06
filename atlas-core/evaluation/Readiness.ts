export interface EvaluationReadiness {
  isReady: boolean;
  percent: number;
  missingFields: string[];
  missingDocuments: string[];
  notes?: string[];
}
