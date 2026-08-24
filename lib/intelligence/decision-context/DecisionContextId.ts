const DECISION_CONTEXT_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class DecisionContextId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): DecisionContextId {
    const nextValue = value.trim();

    if (!DECISION_CONTEXT_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid DecisionContextId format.");
    }

    return new DecisionContextId(nextValue);
  }

  static fromString(value: string): DecisionContextId {
    return DecisionContextId.create(value);
  }

  equals(other: DecisionContextId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}