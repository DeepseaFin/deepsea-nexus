const KNOWLEDGE_ID_PATTERN = /^[a-zA-Z0-9:_-]{8,128}$/;

export class KnowledgeId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): KnowledgeId {
    const normalized = value.trim();

    if (!KNOWLEDGE_ID_PATTERN.test(normalized)) {
      throw new Error("Invalid KnowledgeId format.");
    }

    return new KnowledgeId(normalized);
  }

  static fromString(value: string): KnowledgeId {
    return KnowledgeId.create(value);
  }

  equals(other: KnowledgeId): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
