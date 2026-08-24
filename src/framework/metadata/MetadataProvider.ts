export interface MetadataProvider<TMetadata> {
  getMetadata(): TMetadata;
}