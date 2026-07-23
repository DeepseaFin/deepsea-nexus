const RELATIONSHIP_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class RelationshipId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): RelationshipId {
    const nextValue = value.trim();

    if (!RELATIONSHIP_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid RelationshipId format.");
    }

    return new RelationshipId(nextValue);
  }

  static fromString(value: string): RelationshipId {
    return RelationshipId.create(value);
  }

  equals(other: RelationshipId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
