export interface DecisionOptionMetadata {
  readonly sourceSystem?: string;
  readonly sourceReference?: string;
  readonly tags?: readonly string[];
  readonly attributes?: Readonly<Record<string, string | number | boolean>>;
}