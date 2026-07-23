const TASK_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class TaskId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): TaskId {
    const nextValue = value.trim();

    if (!TASK_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid TaskId format.");
    }

    return new TaskId(nextValue);
  }

  static fromString(value: string): TaskId {
    return TaskId.create(value);
  }

  equals(other: TaskId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}