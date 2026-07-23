const CAPABILITY_ID_PATTERN = /^[a-zA-Z0-9:_-]{3,128}$/;

export class CapabilityId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): CapabilityId {
    const nextValue = value.trim();

    if (!CAPABILITY_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid CapabilityId format.");
    }

    return new CapabilityId(nextValue);
  }

  static fromString(value: string): CapabilityId {
    return CapabilityId.create(value);
  }

  equals(other: CapabilityId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
