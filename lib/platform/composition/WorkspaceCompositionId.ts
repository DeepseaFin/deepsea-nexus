const WORKSPACE_COMPOSITION_ID_PATTERN = /^[a-zA-Z0-9:_-]{3,128}$/;

export class WorkspaceCompositionId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): WorkspaceCompositionId {
    const nextValue = value.trim();

    if (!WORKSPACE_COMPOSITION_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid WorkspaceCompositionId format.");
    }

    return new WorkspaceCompositionId(nextValue);
  }

  static fromString(value: string): WorkspaceCompositionId {
    return WorkspaceCompositionId.create(value);
  }

  equals(other: WorkspaceCompositionId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
