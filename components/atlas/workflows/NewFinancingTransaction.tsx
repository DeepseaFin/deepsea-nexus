'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

const steps = [
  'Client',
  'Counterparty',
  'Product',
  'Commercial Terms',
  'Documents',
  'ATLAS Intelligence',
  'Review',
  'Generate Term Sheet',
] as const;

export default function NewFinancingTransaction() {
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = steps.length;
  const canGoPrevious = activeStep > 1;
  const canGoNext = activeStep < totalSteps;

  const goToPrevious = () => {
    if (!canGoPrevious) {
      return;
    }
    setActiveStep((step) => step - 1);
  };

  const goToNext = () => {
    if (!canGoNext) {
      return;
    }
    setActiveStep((step) => step + 1);
  };

  return (
    <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-100 sm:text-2xl">New Financing Transaction</h2>
          <p className="mt-2 text-sm text-slate-400">Create a new structured trade finance transaction.</p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-300">
          Step {activeStep} of {totalSteps}
        </span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-2">
          {steps.map((stepLabel, index) => {
            const stepNumber = index + 1;
            const isCurrent = stepNumber === activeStep;
            const isComplete = stepNumber < activeStep;

            return (
              <button
                key={stepLabel}
                type="button"
                onClick={() => setActiveStep(stepNumber)}
                className={`min-w-[160px] rounded-xl border px-3 py-2 text-left text-xs transition ${
                  isCurrent
                    ? 'border-cyan-700/60 bg-cyan-950/30 text-cyan-100'
                    : isComplete
                      ? 'border-emerald-800/50 bg-emerald-950/20 text-emerald-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <p className="font-semibold">Step {stepNumber}</p>
                <p className="mt-1">{stepLabel}</p>
              </button>
            );
          })}
        </div>
      </div>

      <SectionCard title={`Step ${activeStep} - ${steps[activeStep - 1]}`}>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
          <p className="text-sm text-slate-300">
            Placeholder panel for Step {activeStep} ({steps[activeStep - 1]}).
          </p>
          <p className="mt-2 text-xs text-slate-500">
            This workflow intentionally contains only shell structure for Sprint 38 Ticket 038-001A.
          </p>
        </div>
      </SectionCard>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            Save Draft
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            type="button"
            onClick={goToNext}
            disabled={!canGoNext}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
