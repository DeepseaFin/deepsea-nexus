export interface InstitutionalAssembler<T> {
  assemble(source: Readonly<Record<string, unknown>>): T;
  disassemble(entity: T): Readonly<Record<string, unknown>>;
}
