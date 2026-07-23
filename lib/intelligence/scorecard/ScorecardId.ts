const SCORECARD_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class ScorecardId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): ScorecardId {
    const nextValue = value.trim();

    if (!SCORECARD_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid ScorecardId format.");
    }

    return new ScorecardId(nextValue);
  }

  static fromString(value: string): ScorecardId {
    return ScorecardId.create(value);
  }

  equals(other: ScorecardId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}