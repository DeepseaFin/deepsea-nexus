const NAVIGATION_NODE_ID_PATTERN = /^[a-zA-Z0-9:_-]{3,128}$/;

export class NavigationNodeId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): NavigationNodeId {
    const nextValue = value.trim();

    if (!NAVIGATION_NODE_ID_PATTERN.test(nextValue)) {
      throw new Error("Invalid NavigationNodeId format.");
    }

    return new NavigationNodeId(nextValue);
  }

  static fromString(value: string): NavigationNodeId {
    return NavigationNodeId.create(value);
  }

  equals(other: NavigationNodeId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
