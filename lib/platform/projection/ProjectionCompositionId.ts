const PROJECTION_COMPOSITION_ID_PATTERN = /^[a-zA-Z0-9:_-]{3,128}$/;

export class ProjectionCompositionId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): ProjectionCompositionId {
    const nextValue = value.trim();

    if (!PROJECTION_COMPOSITION_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid ProjectionCompositionId format.");
    }

    return new ProjectionCompositionId(nextValue);
  }

  static fromString(value: string): ProjectionCompositionId {
    return ProjectionCompositionId.create(value);
  }

  equals(other: ProjectionCompositionId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
