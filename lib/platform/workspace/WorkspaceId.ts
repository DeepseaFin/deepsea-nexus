const WORKSPACE_ID_PATTERN = /^[a-zA-Z0-9:_-]{3,128}$/;

export class WorkspaceId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): WorkspaceId {
    const nextValue = value.trim();

    if (!WORKSPACE_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid WorkspaceId format.");
    }

    return new WorkspaceId(nextValue);
  }

  static fromString(value: string): WorkspaceId {
    return WorkspaceId.create(value);
  }

  equals(other: WorkspaceId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
