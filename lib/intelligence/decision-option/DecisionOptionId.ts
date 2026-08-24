const DECISION_OPTION_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class DecisionOptionId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): DecisionOptionId {
    const nextValue = value.trim();

    if (!DECISION_OPTION_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid DecisionOptionId format.");
    }

    return new DecisionOptionId(nextValue);
  }

  static fromString(value: string): DecisionOptionId {
    return DecisionOptionId.create(value);
  }

  equals(other: DecisionOptionId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}