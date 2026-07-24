const APPROVAL_STAGE_PATTERN = /^[a-zA-Z0-9:_-]{2,128}$/;

export class ApprovalStage {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): ApprovalStage {
    const nextValue = value.trim();

    if (!APPROVAL_STAGE_PATTERN.test(nextValue)) {
      throw new Error("Invalid ApprovalStage format.");
    }

    return new ApprovalStage(nextValue);
  }

  static fromString(value: string): ApprovalStage {
    return ApprovalStage.create(value);
  }

  equals(other: ApprovalStage): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}