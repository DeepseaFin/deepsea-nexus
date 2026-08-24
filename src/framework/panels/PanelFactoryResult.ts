export interface PanelFactoryResult<T> {
  readonly panel: T;
  readonly generatedAt: string;
  readonly version: string;
}