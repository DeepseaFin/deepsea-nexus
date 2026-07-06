'use client';

import { useMemo } from 'react';
import { useDeal } from '@/components/atlas/common/DealContext';
import { createEmptyDeal, type DealModel } from '@/atlas-core/deals/DealModel';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

const mockedCases: DealModel[] = [
  {
    ...createEmptyDeal(),
    deal: {
      ...createEmptyDeal().deal,
      dealId: 'DNX-2026-000304',
      dealName: 'Alpha Trading Receivables Facility',
      stage: 'Client',
    },
    workflow: {
      ...createEmptyDeal().workflow,
      currentState: 'Lead',
      progress: 15,
    },
  },
  {
    ...createEmptyDeal(),
    deal: {
      ...createEmptyDeal().deal,
      dealId: 'DNX-2026-000302',
      dealName: 'Beta Foods Receivables Facility',
      stage: 'Evaluation',
    },
    workflow: {
      ...createEmptyDeal().workflow,
      currentState: 'Evaluation',
      progress: 40,
    },
  },
  {
    ...createEmptyDeal(),
    deal: {
      ...createEmptyDeal().deal,
      dealId: 'DNX-2026-000303',
      dealName: 'Gamma Logistics Receivables Facility',
      stage: 'Funding',
    },
    workflow: {
      ...createEmptyDeal().workflow,
      currentState: 'Funding',
      progress: 75,
    },
  },
];

export default function RMWorkQueue() {
  const { deal } = useDeal();

  const queue = useMemo(() => {
    const items = [...mockedCases];
    items.unshift(deal);

    return items.reduce<Record<string, DealModel[]>>((groups, item) => {
      const key = item.workflow.currentState;
      groups[key] ??= [];
      groups[key].push(item);
      return groups;
    }, {});
  }, [deal]);

  return (
    <div className="space-y-6">
      <SectionCard title="RM Work Queue">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Cases grouped by workflow state.</p>
          <div className="grid gap-4 xl:grid-cols-2">
            {Object.entries(queue).map(([state, cases]) => (
              <div key={state} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">{state}</h3>
                  <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                    {cases.length}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {cases.map((item, index) => (
                    <div key={`${state}-${item.deal.dealId}-${index}`} className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-300">
                      <p className="font-semibold text-white">{item.deal.dealName}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{item.deal.dealId}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
