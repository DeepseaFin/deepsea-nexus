const OPERATION_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class OperationId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): OperationId {
    const nextValue = value.trim();

    if (!OPERATION_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid OperationId format.");
    }

    return new OperationId(nextValue);
  }

  static fromString(value: string): OperationId {
    return OperationId.create(value);
  }

  equals(other: OperationId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
