const EVIDENCE_ID_PATTERN = /^[a-zA-Z0-9:_-]{8,128}$/;

export class EvidenceId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): EvidenceId {
    const normalized = value.trim();

    if (!EVIDENCE_ID_PATTERN.test(normalized)) {
      throw new Error("Invalid EvidenceId format.");
    }

    return new EvidenceId(normalized);
  }

  static fromString(value: string): EvidenceId {
    return EvidenceId.create(value);
  }

  equals(other: EvidenceId): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
