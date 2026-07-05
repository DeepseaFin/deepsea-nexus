'use client';

import { useMemo, useState } from 'react';
import { Building2, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, FileUp, Handshake, Sparkles } from 'lucide-react';
import { useDeal } from '@/components/atlas/common/DealContext';
import DocumentUploadZone, { type UploadedFileView } from '@/components/atlas/documents/DocumentUploadZone';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

const portalSteps = [
  { key: 'welcome', title: 'Welcome', icon: Sparkles },
  { key: 'company', title: 'Company', icon: Building2 },
  { key: 'funding', title: 'Funding Request', icon: ClipboardList },
  { key: 'buyer', title: 'Buyer', icon: Handshake },
  { key: 'documents', title: 'Documents', icon: FileUp },
  { key: 'confirmation', title: 'Confirmation', icon: CheckCircle2 },
] as const;

export default function ClientOpportunityPortal() {
  const { deal, updateClient, updateCounterparty, updateDeal, updateDocuments } = useDeal();
  const [currentStep, setCurrentStep] = useState(0);

  const progress = useMemo(() => Math.round(((currentStep + 1) / portalSteps.length) * 100), [currentStep]);
  const isFirst = currentStep === 0;
  const isLast = currentStep === portalSteps.length - 1;

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, portalSteps.length - 1));
  const goPrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const updateCompanyField = (field: 'legalName' | 'country' | 'industry') => (value: string) => {
    updateClient({ [field]: value });
  };

  const updateFundingField = (field: 'product' | 'fundingRequired' | 'currency') => (value: string) => {
    if (field === 'fundingRequired') {
      const numeric = Number(value);
      updateDeal({ fundingRequired: Number.isNaN(numeric) ? 0 : numeric });
      return;
    }

    updateDeal({ [field]: value });
  };

  const updateBuyerField = (field: 'name' | 'country') => (value: string) => {
    updateCounterparty({ [field]: value });
  };

  const onDocumentsChange = (files: UploadedFileView[]) => {
    updateDocuments({ uploadedDocuments: files.map((file) => file.name) });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <SectionCard title="Welcome" icon={Sparkles}>
            <div className="space-y-5">
              <div>
                <h2 className="text-3xl font-semibold text-slate-100 sm:text-4xl">Need Working Capital?</h2>
                <p className="mt-3 max-w-2xl text-base text-slate-300">
                  Tell us about your business opportunity and our team will evaluate it.
                </p>
              </div>

              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-900/40"
              >
                Start Application
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </SectionCard>
        );

      case 1:
        return (
          <SectionCard title="Company" icon={Building2}>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField label="Company Name" value={deal.client.legalName} onChange={updateCompanyField('legalName')} placeholder="ABC Limited" />
              <InputField label="Country" value={deal.client.country} onChange={updateCompanyField('country')} placeholder="United Arab Emirates" />
              <div className="md:col-span-2">
                <InputField label="Industry" value={deal.client.industry} onChange={updateCompanyField('industry')} placeholder="Industrial Trading" />
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
                  onChange={(event) => updateFundingField('product')(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
                  disabled
                >
                  <option value="Receivables Financing">Receivables Financing</option>
                </select>
              </label>

              <InputField label="Currency" value={deal.deal.currency} onChange={updateFundingField('currency')} placeholder="AED" />

              <div className="md:col-span-2">
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Funding Required</span>
                  <input
                    type="number"
                    value={deal.deal.fundingRequired}
                    onChange={(event) => updateFundingField('fundingRequired')(event.target.value)}
                    placeholder="2250000"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none"
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
              <InputField label="Buyer Name" value={deal.counterparty.name} onChange={updateBuyerField('name')} placeholder="Mashreq Bank PJSC" />
              <InputField label="Buyer Country" value={deal.counterparty.country} onChange={updateBuyerField('country')} placeholder="United Arab Emirates" />
            </div>
          </SectionCard>
        );

      case 4:
        return (
          <SectionCard title="Documents" icon={FileUp}>
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Suggested Checklist</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  <li>1. Latest invoice pack</li>
                  <li>2. Company trade license</li>
                  <li>3. Buyer confirmation or purchase order</li>
                </ul>
              </div>

              <DocumentUploadZone
                title="Upload Documents"
                subtitle="Drag, drop, or select files to complete your application package."
                onFilesChange={onDocumentsChange}
              />
            </div>
          </SectionCard>
        );

      case 5:
        return (
          <SectionCard title="Confirmation" icon={CheckCircle2}>
            <div className="space-y-5">
              <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-4 text-sm text-emerald-100">
                Your opportunity has been submitted.
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <SummaryItem label="Application Reference" value={deal.deal.dealId} />
                <SummaryItem label="Relationship Manager Assigned" value="Aisha Khan (Placeholder)" />
                <SummaryItem label="Status" value="Submitted for Review" />
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-900/40"
              >
                Track Application
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
      <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">ATLAS Portal</p>
            <h1 className="mt-2 text-xl font-semibold text-slate-100">Client Opportunity Portal</h1>
            <p className="mt-1 text-sm text-slate-400">A guided experience to submit financing opportunities quickly.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Progress</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-300">{progress}%</p>
            <div className="mt-2 h-2 rounded-full bg-slate-800">
              <div className="h-2 rounded-full bg-emerald-500/70" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            {portalSteps.map((step, index) => {
              const completed = index < currentStep;
              const selected = index === currentStep;
              const Icon = step.icon;

              return (
                <div
                  key={step.key}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
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
        </aside>

        <main className="space-y-6">
          {renderStep()}

          {!isLast ? (
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
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </main>
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
