"use client";

import { useDeal } from '@/components/atlas/common/DealContext';
import { ATLAS_WORKFLOW_SEQUENCE, getWorkflowDefinition } from '@/atlas-core/workflow/ATLASWorkflowEngine';

export default function WorkflowProgress() {
  const { deal } = useDeal();
  const currentStage = deal.workflow.currentState;

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {ATLAS_WORKFLOW_SEQUENCE.map((stage, index) => {
          const isCompleted = index < ATLAS_WORKFLOW_SEQUENCE.indexOf(currentStage);
          const isCurrent = stage === currentStage;
          const definition = getWorkflowDefinition(stage);
          

          return (
            <div key={stage} className="flex flex-1 min-w-[90px] items-center">
              <div className="flex flex-1 flex-col items-center">
                <div className="flex items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                      isCompleted
                        ? "bg-cyan-500 text-white"
                        : isCurrent
                        ? "bg-amber-500 text-white font-bold"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < ATLAS_WORKFLOW_SEQUENCE.length - 1 ? (
                    <div className="hidden h-[2px] w-6 bg-slate-700 sm:block" />
                  ) : null}
                </div>
                <p
                  className={`mt-2 text-center text-xs sm:text-sm ${
                    isCompleted || isCurrent ? "text-white" : "text-slate-400"
                  }`}
                >
                  {stage}
                </p>
                <p className="mt-1 text-center text-[10px] uppercase tracking-wide text-slate-500">
                  {definition.owner}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
