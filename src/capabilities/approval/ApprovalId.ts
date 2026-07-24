const APPROVAL_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class ApprovalId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): ApprovalId {
    const nextValue = value.trim();

    if (!APPROVAL_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid ApprovalId format.");
    }

    return new ApprovalId(nextValue);
  }

  static fromString(value: string): ApprovalId {
    return ApprovalId.create(value);
  }

  equals(other: ApprovalId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}