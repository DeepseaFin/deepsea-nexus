export interface InstitutionalValidator<T> {
  validateForCreate(entity: T): Promise<readonly string[]>;
  validateForUpdate(entity: T): Promise<readonly string[]>;
  validateForStatusTransition(entity: T, nextStatus: string): Promise<readonly string[]>;
}
