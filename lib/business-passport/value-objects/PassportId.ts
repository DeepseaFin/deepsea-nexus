const PASSPORT_ID_PATTERN = /^[a-zA-Z0-9:_-]{8,128}$/;

export class PassportId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): PassportId {
    const nextValue = value.trim();

    if (!PASSPORT_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid PassportId format.");
    }

    return new PassportId(nextValue);
  }

  static fromString(value: string): PassportId {
    return PassportId.create(value);
  }

  equals(other: PassportId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
