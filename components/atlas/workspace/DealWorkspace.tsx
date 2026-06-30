"use client";

import ApprovalPanel from "./ApprovalPanel";
import DealTimeline from "./DealTimeline";
import RightSidebar from "./RightSidebar";
import TaskPanel from "./TaskPanel";
import WorkflowProgress from "./WorkflowProgress";

export default function DealWorkspace() {
  return (
    <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <WorkflowProgress />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <DealTimeline />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <ApprovalPanel />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <TaskPanel />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
