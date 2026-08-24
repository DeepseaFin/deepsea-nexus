export type PassportMaturityScore = number;

export enum PassportMaturityLevel {
  Foundational = "foundational",
  Developing = "developing",
  Institutional = "institutional",
  Advanced = "advanced",
}

export interface PassportMaturity {
  readonly level: PassportMaturityLevel;
  readonly score: PassportMaturityScore;
  readonly assessedAt: string;
  readonly nextReviewAt?: string;
}
