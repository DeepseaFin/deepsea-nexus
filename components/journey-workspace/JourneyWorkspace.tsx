import { JourneyCanvas } from "./JourneyCanvas";
import { JourneyContextPanel } from "./JourneyContextPanel";
import { JourneyFooter } from "./JourneyFooter";
import { JourneyHeader } from "./JourneyHeader";
import { JourneySidebar } from "./JourneySidebar";
import type { JourneyWorkspaceProps } from "./types";

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

export function JourneyWorkspace({
  header,
  sidebar,
  canvas,
  contextPanel,
  footer,
  className,
}: JourneyWorkspaceProps) {
  return (
    <div className={withClassName("min-h-screen bg-[#050d18] text-slate-100", className)}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1700px] flex-col">
        <JourneyHeader {...header} />

        <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
          <JourneySidebar {...sidebar} />

          <div className="flex-1 p-4">
            <div className={`grid gap-4 ${contextPanel ? "2xl:grid-cols-[minmax(0,1fr)_340px]" : "grid-cols-1"}`}>
              <JourneyCanvas {...canvas} />
              {contextPanel ? <JourneyContextPanel {...contextPanel} /> : null}
            </div>
          </div>
        </div>

        {footer ? <JourneyFooter {...footer} /> : null}
      </div>
    </div>
  );
}