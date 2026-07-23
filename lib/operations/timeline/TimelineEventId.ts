const TIMELINE_EVENT_ID_PATTERN = /^[a-zA-Z0-9:_-]{6,128}$/;

export class TimelineEventId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): TimelineEventId {
    const nextValue = value.trim();

    if (!TIMELINE_EVENT_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid TimelineEventId format.");
    }

    return new TimelineEventId(nextValue);
  }

  static fromString(value: string): TimelineEventId {
    return TimelineEventId.create(value);
  }

  equals(other: TimelineEventId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}