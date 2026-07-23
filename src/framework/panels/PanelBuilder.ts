import type { PanelBuildResult } from "@/src/framework/panels/PanelBuildResult";

export interface PanelBuilder<TProjection, TPanel> {
  withProjection(projection: TProjection): PanelBuilder<TProjection, TPanel>;
  build(): PanelBuildResult<TPanel>;
}