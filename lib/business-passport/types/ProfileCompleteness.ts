export interface ProfileCompletenessResult<TField extends string> {
  readonly percentage: number;
  readonly completedFields: readonly TField[];
  readonly missingFields: readonly TField[];
  readonly recommendations: readonly string[];
}
