const ASSIGNMENT_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class AssignmentId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): AssignmentId {
    const nextValue = value.trim();

    if (!ASSIGNMENT_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid AssignmentId format.");
    }

    return new AssignmentId(nextValue);
  }

  static fromString(value: string): AssignmentId {
    return AssignmentId.create(value);
  }

  equals(other: AssignmentId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}