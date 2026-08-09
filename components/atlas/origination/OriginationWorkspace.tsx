'use client';

import { useMemo, useState } from 'react';
import { Building2, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, FileUp, Handshake, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDeal } from '@/components/atlas/common/DealContext';
import { createEmptyDeal } from '@/atlas-core/deals/DealModel';
import DocumentUploadZone, { type UploadedFileView } from '@/components/atlas/documents/DocumentUploadZone';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

const steps = [
  { title: 'Opportunity', icon: Sparkles },
  { title: 'Participants', icon: Building2 },
  { title: 'Commercials', icon: ClipboardList },
  { title: 'Documents', icon: FileUp },
  { title: 'Review', icon: Handshake },
  { title: 'Submit to ATLAS', icon: CheckCircle2 },
] as const;

export default function OriginationWorkspace() {
  const router = useRouter();
  const { deal, setDeal, updateClient, updateCounterparty, updateDeal, updateDocuments } = useDeal();
  const [currentStep, setCurrentStep] = useState(0);

  const progress = useMemo(() => Math.round(((currentStep + 1) / steps.length) * 100), [currentStep]);
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const goNext = () => setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  const goPrevious = () => setCurrentStep((step) => Math.max(step - 1, 0));

  const updateCompanyField = (field: 'legalName' | 'country' | 'industry') => (value: string) => {
    updateClient({ [field]: value });
  };

  const updateParticipantField = (field: 'name' | 'country') => (value: string) => {
    updateCounterparty({ [field]: value });
  };

  const updateCommercialField = (field: 'fundingRequired' | 'currency') => (value: string) => {
    if (field === 'fundingRequired') {
      const numericValue = Number(value);
      updateDeal({ fundingRequired: Number.isNaN(numericValue) ? 0 : numericValue });
      return;
    }

    updateDeal({ [field]: value });
  };

  const onDocumentsChange = (files: UploadedFileView[]) => {
    updateDocuments({ uploadedDocuments: files.map((file) => file.name) });
  };

  const submitCase = () => {
    const submittedCase = createEmptyDeal();
    submittedCase.deal = {
      ...submittedCase.deal,
      ...deal.deal,
      dealName: deal.deal.dealName,
      stage: 'Opportunity',
    };
    submittedCase.client = { ...submittedCase.client, ...deal.client };
    submittedCase.counterparty = { ...submittedCase.counterparty, ...deal.counterparty };
    submittedCase.documents = { ...submittedCase.documents, ...deal.documents };
    submittedCase.timeline = [
      ...submittedCase.timeline,
      {
        time: new Date().toISOString(),
        title: 'Submitted to ATLAS',
        description: 'Origination completed and case created for internal handling.',
        status: 'current',
      },
    ];
    submittedCase.tasks = [
      ...submittedCase.tasks,
      {
        title: 'Internal case review',
        description: 'Relationship Manager and case team to continue the workflow.',
        owner: 'ATLAS',
        status: 'pending',
      },
    ];
    submittedCase.workflow = {
      ...submittedCase.workflow,
      currentState: 'Opportunity',
      currentStep: 'Client',
      completedSteps: [],
      completedStates: [],
      progress: 0,
      lastUpdated: new Date().toISOString(),
    };

    setDeal(submittedCase);
    router.push('/atlas/deals');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <SectionCard title="Opportunity" iconKey="sparkles">
            <div className="space-y-5">
              <div>
                <p className="text-sm text-slate-300">Use this workspace to begin a new financing opportunity.</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">Progressive disclosure keeps the process fast and simple.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InputField
                  label="Opportunity Name"
                  value={deal.deal.dealName}
                  onChange={(value) => updateDeal({ dealName: value })}
                  placeholder="ABC Ltd Receivables Facility"
                />
              </div>
            </div>
          </SectionCard>
        );

      case 1:
        return (
          <SectionCard title="Participants" iconKey="building-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Company</p>
                <InputField label="Company Name" value={deal.client.legalName} onChange={updateCompanyField('legalName')} placeholder="ABC Limited" />
                <InputField label="Country" value={deal.client.country} onChange={updateCompanyField('country')} placeholder="United Arab Emirates" />
                <InputField label="Industry" value={deal.client.industry} onChange={updateCompanyField('industry')} placeholder="Industrial Trading" />
              </div>

              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Buyer</p>
                <InputField label="Buyer Name" value={deal.counterparty.name} onChange={updateParticipantField('name')} placeholder="Mashreq Bank PJSC" />
                <InputField label="Buyer Country" value={deal.counterparty.country} onChange={updateParticipantField('country')} placeholder="United Arab Emirates" />
              </div>
            </div>
          </SectionCard>
        );

      case 2:
        return (
          <SectionCard title="Commercials" iconKey="clipboard-list">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 rounded-xl border border-cyan-800/40 bg-cyan-950/20 p-4 text-sm text-cyan-100">
                Product is fixed to Receivables Financing for this workspace.
              </div>
              <InputField label="Invoice Value" value={`${deal.deal.amount}`} onChange={(value) => updateDeal({ amount: Number(value) || 0 })} placeholder="2500000" />
              <InputField label="Funding Required" value={`${deal.deal.fundingRequired}`} onChange={updateCommercialField('fundingRequired')} placeholder="2250000" />
              <InputField label="Currency" value={deal.deal.currency} onChange={updateCommercialField('currency')} placeholder="AED" />
              <InputField label="Expected Tenor" value={`${deal.deal.tenureDays}`} onChange={(value) => updateDeal({ tenureDays: Number(value) || 0 })} placeholder="90" />
            </div>
          </SectionCard>
        );

      case 3:
        return (
          <SectionCard title="Documents" iconKey="file-up">
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Simple Checklist</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  <li>1. Latest invoice pack</li>
                  <li>2. Company trade license</li>
                  <li>3. Buyer confirmation or purchase order</li>
                </ul>
              </div>

              <DocumentUploadZone
                title="Document Upload"
                subtitle="Upload supporting files to complete the origination package."
                onFilesChange={onDocumentsChange}
              />
            </div>
          </SectionCard>
        );

      case 4:
        return (
          <SectionCard title="Review" iconKey="handshake">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <SummaryItem label="Opportunity" value={deal.deal.dealName} />
              <SummaryItem label="Company" value={deal.client.legalName} />
              <SummaryItem label="Buyer" value={deal.counterparty.name} />
              <SummaryItem label="Funding Required" value={`AED ${new Intl.NumberFormat('en-AE').format(deal.deal.fundingRequired)}`} />
              <SummaryItem label="Currency" value={deal.deal.currency} />
              <SummaryItem label="Documents" value={`${deal.documents.uploadedDocuments.length} file(s)`} />
            </div>
          </SectionCard>
        );

      case 5:
        return (
          <SectionCard title="Submit to ATLAS" iconKey="check-circle-2">
            <div className="space-y-5">
              <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-4 text-sm text-emerald-100">
                Ready to create a new case in ATLAS using the information collected in this workspace.
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <SummaryItem label="Case Reference" value={deal.deal.dealId} />
                <SummaryItem label="Assigned RM" value="Aisha Khan (Placeholder)" />
                <SummaryItem label="Status" value="Ready to Submit" />
              </div>

              <button
                type="button"
                onClick={submitCase}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-900/40"
              >
                Submit to ATLAS
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </SectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionCard title="Origination Workspace" iconKey="sparkles">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">ATLAS Origination</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-100 sm:text-4xl">Primary entry point for new financing opportunities</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-400">
                Guide a Relationship Manager through a fast, structured origination flow with automatic persistence across every step.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-6">
              {steps.map((step, index) => {
                const completed = index < currentStep;
                const selected = index === currentStep;
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                      selected
                        ? 'border-cyan-700/60 bg-cyan-950/30 text-cyan-100'
                        : completed
                          ? 'border-emerald-800/50 bg-emerald-950/20 text-emerald-200'
                          : 'border-slate-800 bg-slate-900/40 text-slate-400'
                    }`}
                  >
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${completed ? 'border-emerald-700 bg-emerald-900/40' : 'border-slate-700 bg-slate-900/80'}`}>
                      {completed ? '✓' : index + 1}
                    </span>
                    <Icon className="h-4 w-4" />
                    {step.title}
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Progress</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-300">{progress}%</p>
              <div className="mt-2 h-2 rounded-full bg-slate-800">
                <div className="h-2 rounded-full bg-emerald-500/70" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </SectionCard>

        {renderStep()}

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <button
            type="button"
            onClick={goPrevious}
            disabled={isFirst}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={isLast}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
      <input
        type="text"
        value={value ?? ''}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-500"
      />
    </label>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}
