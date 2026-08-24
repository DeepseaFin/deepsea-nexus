export interface PanelBuildResult<T> {
  readonly panel: T;
  readonly builtAt: string;
  readonly version: string;
}