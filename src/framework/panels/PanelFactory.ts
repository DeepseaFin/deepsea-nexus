export interface PanelFactory<TProjection, TPanel> {
  create(projection: TProjection): TPanel;
}