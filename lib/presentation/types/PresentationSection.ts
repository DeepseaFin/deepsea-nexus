export interface PresentationSection<TItem = unknown> {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly items?: readonly TItem[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}
