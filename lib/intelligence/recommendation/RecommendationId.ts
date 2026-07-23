const RECOMMENDATION_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class RecommendationId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): RecommendationId {
    const nextValue = value.trim();

    if (!RECOMMENDATION_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid RecommendationId format.");
    }

    return new RecommendationId(nextValue);
  }

  static fromString(value: string): RecommendationId {
    return RecommendationId.create(value);
  }

  equals(other: RecommendationId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}