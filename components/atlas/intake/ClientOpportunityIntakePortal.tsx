'use client';

import { useMemo, useState } from 'react';
import { Building2, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, FileUp, Handshake, Sparkles } from 'lucide-react';
import { useDeal } from '@/components/atlas/common/DealContext';
import DocumentUploadZone, { type UploadedFileView } from '@/components/atlas/documents/DocumentUploadZone';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

const steps = [
  { title: 'Welcome', icon: Sparkles },
  { title: 'Company', icon: Building2 },
  { title: 'Funding Request', icon: ClipboardList },
  { title: 'Buyer', icon: Handshake },
  { title: 'Document Upload', icon: FileUp },
  { title: 'Submission Complete', icon: CheckCircle2 },
] as const;

export default function ClientOpportunityIntakePortal() {
  const { deal, updateClient, updateCounterparty, updateDeal, updateDocuments } = useDeal();
  const [currentStep, setCurrentStep] = useState(0);

  const completionPercent = useMemo(() => {
    return Math.round(((currentStep + 1) / steps.length) * 100);
  }, [currentStep]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const goPrevious = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const goNext = () => {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handleCompanyField = (field: 'legalName' | 'country' | 'industry') => (value: string) => {
    updateClient({ [field]: value });
  };

  const handleFundingField = (field: 'product' | 'fundingRequired' | 'currency') => (value: string) => {
    if (field === 'fundingRequired') {
      const numeric = Number(value);
      updateDeal({ fundingRequired: Number.isNaN(numeric) ? 0 : numeric });
      return;
    }

    updateDeal({ [field]: value });
  };

  const handleBuyerField = (field: 'name' | 'country') => (value: string) => {
    updateCounterparty({ [field]: value });
  };

  const handleDocumentsChange = (files: UploadedFileView[]) => {
    updateDocuments({ uploadedDocuments: files.map((file) => file.name) });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <SectionCard title="Welcome" icon={Sparkles}>
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Welcome to ATLAS Opportunity Intake. Submit your financing opportunity in under five minutes.
              </p>
              <div className="rounded-xl border border-cyan-800/40 bg-cyan-950/20 p-4 text-sm text-cyan-100">
                This guided flow captures the minimum information required for a Relationship Manager to begin structuring your request.
              </div>
            </div>
          </SectionCard>
        );

      case 1:
        return (
          <SectionCard title="Company" icon={Building2}>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Company Name"
                placeholder="ABC Limited"
                value={deal.client.legalName}
                onChange={handleCompanyField('legalName')}
              />
              <InputField
                label="Country"
                placeholder="United Arab Emirates"
                value={deal.client.country}
                onChange={handleCompanyField('country')}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Industry"
                  placeholder="Industrial Trading"
                  value={deal.client.industry}
                  onChange={handleCompanyField('industry')}
                />
              </div>
            </div>
          </SectionCard>
        );

      case 2:
        return (
          <SectionCard title="Funding Request" icon={ClipboardList}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-wide text-slate-400">Product</span>
                <select
                  value={deal.deal.product}
                  onChange={(event) => handleFundingField('product')(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
                  disabled
                >
                  <option value="Receivables Financing">Receivables Financing</option>
                </select>
              </label>

              <InputField
                label="Currency"
                placeholder="AED"
                value={deal.deal.currency}
                onChange={handleFundingField('currency')}
              />

              <div className="md:col-span-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Funding Required</span>
                  <input
                    type="number"
                    value={deal.deal.fundingRequired}
                    onChange={(event) => handleFundingField('fundingRequired')(event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
                    placeholder="2250000"
                  />
                </label>
              </div>
            </div>
          </SectionCard>
        );

      case 3:
        return (
          <SectionCard title="Buyer" icon={Handshake}>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Buyer Name"
                placeholder="Mashreq Bank PJSC"
                value={deal.counterparty.name}
                onChange={handleBuyerField('name')}
              />
              <InputField
                label="Buyer Country"
                placeholder="United Arab Emirates"
                value={deal.counterparty.country}
                onChange={handleBuyerField('country')}
              />
            </div>
          </SectionCard>
        );

      case 4:
        return (
          <SectionCard title="Document Upload" icon={FileUp}>
            <DocumentUploadZone
              title="Upload Supporting Documents"
              subtitle="Share invoices, licenses, and supporting files to complete opportunity intake."
              onFilesChange={handleDocumentsChange}
            />
          </SectionCard>
        );

      case 5:
        return (
          <SectionCard title="Submission Complete" icon={CheckCircle2}>
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-4 text-sm text-emerald-100">
                Your opportunity has been submitted successfully.
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <SummaryItem label="Reference Number" value={deal.deal.dealId} />
                <SummaryItem label="Assigned RM" value="Aisha Khan (Placeholder)" />
                <SummaryItem label="Status" value="Submitted" />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Next Steps</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  <li>1. Relationship Manager reviews intake completeness.</li>
                  <li>2. Opportunity enters qualification and structuring workflow.</li>
                  <li>3. You receive follow-up communication on required clarifications.</li>
                </ul>
              </div>
            </div>
          </SectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">ATLAS</p>
            <h1 className="mt-2 text-xl font-semibold text-slate-100">Opportunity Intake</h1>
            <p className="mt-1 text-sm text-slate-400">Submit your financing opportunity in under five minutes.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Progress</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-300">{completionPercent}%</p>
            <div className="mt-2 h-2 rounded-full bg-slate-800">
              <div className="h-2 rounded-full bg-emerald-500/70" style={{ width: `${completionPercent}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            {steps.map((step, index) => {
              const completed = index < currentStep;
              const current = index === currentStep;
              const Icon = step.icon;

              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setCurrentStep(index)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${
                    current
                      ? 'border-cyan-700/60 bg-cyan-950/30 text-cyan-100'
                      : completed
                        ? 'border-emerald-800/50 bg-emerald-950/20 text-emerald-200'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${completed ? 'border-emerald-700 bg-emerald-900/40' : 'border-slate-700 bg-slate-900/80'}`}>
                    {completed ? '✓' : index + 1}
                  </span>
                  <Icon className="h-4 w-4" />
                  {step.title}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="space-y-6">
          {renderStepContent()}

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <button
              type="button"
              onClick={goPrevious}
              disabled={isFirstStep}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              type="button"
              onClick={isLastStep ? undefined : goNext}
              disabled={isLastStep}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
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
