const DECISION_SUPPORT_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class DecisionSupportId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): DecisionSupportId {
    const nextValue = value.trim();

    if (!DECISION_SUPPORT_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid DecisionSupportId format.");
    }

    return new DecisionSupportId(nextValue);
  }

  static fromString(value: string): DecisionSupportId {
    return DecisionSupportId.create(value);
  }

  equals(other: DecisionSupportId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}