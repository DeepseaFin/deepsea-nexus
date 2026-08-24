const INSIGHT_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class InsightId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): InsightId {
    const nextValue = value.trim();

    if (!INSIGHT_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid InsightId format.");
    }

    return new InsightId(nextValue);
  }

  static fromString(value: string): InsightId {
    return InsightId.create(value);
  }

  equals(other: InsightId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}