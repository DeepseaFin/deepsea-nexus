const OBSERVATION_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class ObservationId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): ObservationId {
    const nextValue = value.trim();

    if (!OBSERVATION_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid ObservationId format.");
    }

    return new ObservationId(nextValue);
  }

  static fromString(value: string): ObservationId {
    return ObservationId.create(value);
  }

  equals(other: ObservationId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}