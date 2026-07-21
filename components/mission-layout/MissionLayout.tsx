import { MissionContent } from "./MissionContent";
import { MissionFooter } from "./MissionFooter";
import { MissionHeader } from "./MissionHeader";
import { MissionRightPanel } from "./MissionRightPanel";
import { MissionSidebar } from "./MissionSidebar";
import type { MissionLayoutProps } from "./types";

function toClassName(className?: string): string {
  return className ? ` ${className}` : "";
}

export function MissionLayout({
  header,
  sidebar,
  content,
  rightPanel,
  footer,
  className,
}: MissionLayoutProps) {
  return (
    <div className={`min-h-screen bg-[#050d18] text-slate-100${toClassName(className)}`}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1700px] flex-col">
        <MissionHeader {...header} />

        <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
          <MissionSidebar {...sidebar} />

          <div className="flex-1 p-4">
            <div className={`grid gap-4 ${rightPanel ? "2xl:grid-cols-[minmax(0,1fr)_340px]" : "grid-cols-1"}`}>
              <MissionContent {...content} />
              {rightPanel ? <MissionRightPanel {...rightPanel} /> : null}
            </div>
          </div>
        </div>

        {footer ? <MissionFooter {...footer} /> : null}
      </div>
    </div>
  );
}