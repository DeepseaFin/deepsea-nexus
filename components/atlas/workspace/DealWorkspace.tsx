"use client";

import { useDeal } from '@/components/atlas/common/DealContext';
import { getWorkflowDefinition } from '@/atlas-core/workflow/ATLASWorkflowEngine';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import ApprovalPanel from "./ApprovalPanel";
import DealTimeline from "./DealTimeline";
import RightSidebar from "./RightSidebar";
import TaskPanel from "./TaskPanel";
import WorkflowProgress from "./WorkflowProgress";

export default function DealWorkspace() {
  const { deal } = useDeal();
  const workflowDefinition = getWorkflowDefinition(deal.workflow.currentState);

  return (
    <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
      <SectionCard title="Case Summary">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryField label="Case" value={deal.deal.dealName} />
          <SummaryField label="Current State" value={deal.workflow.currentState} />
          <SummaryField label="Progress" value={`${deal.workflow.progress}%`} />
          <SummaryField label="Owner" value={workflowDefinition.owner} />
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Participants">
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryField label="Client" value={deal.client.legalName} />
            <SummaryField label="Buyer" value={deal.counterparty.name} />
          </div>
        </SectionCard>

        <SectionCard title="Commercials">
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryField label="Funding Required" value={`AED ${new Intl.NumberFormat('en-AE').format(deal.deal.fundingRequired)}`} />
            <SummaryField label="Expected Return" value={`${deal.deal.expectedReturnPercent.toFixed(2)}%`} />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Documents">
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryField label="Uploaded" value={`${deal.documents.uploadedDocuments.length}`} />
            <SummaryField label="Missing" value={`${deal.documents.missingDocuments.length}`} />
          </div>
        </SectionCard>

        <SectionCard title="Workflow">
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryField label="Current State" value={deal.workflow.currentState} />
            <SummaryField label="Next States" value={workflowDefinition.nextStates.length ? workflowDefinition.nextStates.join(', ') : 'Closed'} />
          </div>
        </SectionCard>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Current State</p>
            <p className="mt-2 text-lg font-semibold text-white">{deal.workflow.currentState}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Progress</p>
            <p className="mt-2 text-lg font-semibold text-emerald-300">{deal.workflow.progress}%</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Owner</p>
            <p className="mt-2 text-lg font-semibold text-white">{workflowDefinition.owner}</p>
          </div>
        </div>
      </div>

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

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
