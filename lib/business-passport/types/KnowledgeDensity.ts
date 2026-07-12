export type KnowledgeDensityScore = number;

export enum KnowledgeDensityBand {
  Sparse = "sparse",
  Emerging = "emerging",
  Established = "established",
  Deep = "deep",
}

export interface KnowledgeDensityDimension {
  readonly dimension: string;
  readonly score: KnowledgeDensityScore;
}

export interface KnowledgeDensity {
  readonly score: KnowledgeDensityScore;
  readonly band: KnowledgeDensityBand;
  readonly assessedAt: string;
  readonly dimensions: readonly KnowledgeDensityDimension[];
}
