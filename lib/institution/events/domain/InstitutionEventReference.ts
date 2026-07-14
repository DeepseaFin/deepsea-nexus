export interface InstitutionEventReference {
  readonly referenceId: string;
  readonly referenceType: string;
  readonly source: string;
  readonly locator?: string;
}