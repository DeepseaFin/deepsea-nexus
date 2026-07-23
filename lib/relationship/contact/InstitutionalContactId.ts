const INSTITUTIONAL_CONTACT_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class InstitutionalContactId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): InstitutionalContactId {
    const nextValue = value.trim();

    if (!INSTITUTIONAL_CONTACT_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid InstitutionalContactId format.");
    }

    return new InstitutionalContactId(nextValue);
  }

  static fromString(value: string): InstitutionalContactId {
    return InstitutionalContactId.create(value);
  }

  equals(other: InstitutionalContactId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
