const KPI_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class KPIId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): KPIId {
    const nextValue = value.trim();

    if (!KPI_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid KPIId format.");
    }

    return new KPIId(nextValue);
  }

  static fromString(value: string): KPIId {
    return KPIId.create(value);
  }

  equals(other: KPIId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}