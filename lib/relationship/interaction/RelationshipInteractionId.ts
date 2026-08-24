const RELATIONSHIP_INTERACTION_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class RelationshipInteractionId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): RelationshipInteractionId {
    const nextValue = value.trim();

    if (!RELATIONSHIP_INTERACTION_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid RelationshipInteractionId format.");
    }

    return new RelationshipInteractionId(nextValue);
  }

  static fromString(value: string): RelationshipInteractionId {
    return RelationshipInteractionId.create(value);
  }

  equals(other: RelationshipInteractionId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
