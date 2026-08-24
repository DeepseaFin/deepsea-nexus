"use client";

import { useMemo } from "react";
import { useDeal } from "@/components/atlas/common/DealContext";
import {
  LegalAssemblyEngine,
  type AssembledLegalDocument,
} from "@/atlas-core/legal/LegalAssemblyEngine";

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</h3>;
}

function SummaryMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function DocumentCard({ document }: { document: AssembledLegalDocument }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">{document.documentName}</p>
          <p className="mt-1 text-xs text-slate-500">Dependency: {document.dependency}</p>
        </div>
        <span className="inline-flex rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-200">
          {document.status}
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
        <p className="text-[11px] uppercase tracking-wide text-slate-500">Reason Required</p>
        <p className="mt-1 text-sm text-slate-300">{document.reasonRequired}</p>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryMetric label="Completion %" value={`${document.completionPercent}%`} />
        <SummaryMetric label="Generated" value={document.generated ? "Yes" : "No"} />
        <SummaryMetric label="Ready for Signature" value={document.readyForSignature ? "Yes" : "No"} />
        <SummaryMetric label="Executed" value={document.executed ? "Yes" : "No"} />
        <SummaryMetric label="Status" value={document.status} />
      </div>
    </div>
  );
}

function DocumentSection({ title, documents }: { title: string; documents: AssembledLegalDocument[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <SectionTitle title={title} />
      <div className="mt-3 space-y-3">
        {documents.length === 0 ? (
          <p className="text-sm text-slate-400">No documents in this category.</p>
        ) : (
          documents.map((document) => <DocumentCard key={`${title}-${document.documentName}`} document={document} />)
        )}
      </div>
    </div>
  );
}

export default function LegalAssemblyWorkspace() {
  const { deal } = useDeal();
  const assembly = useMemo(() => LegalAssemblyEngine.assembleLegalRequirements(deal), [deal]);

  return (
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
      <h2 className="text-2xl font-semibold text-white">Legal Assembly Engine</h2>
      <p className="mt-2 text-slate-400">Dynamic legal document assembly from live transaction structure</p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <SectionTitle title="Assembly Summary" />
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryMetric label="Legal Readiness Score" value={`${assembly.legalReadinessScore}%`} />
          <SummaryMetric label="Required Documents" value={assembly.requiredDocuments.length} />
          <SummaryMetric label="Optional Documents" value={assembly.optionalDocuments.length} />
          <SummaryMetric label="Conditional Documents" value={assembly.conditionalDocuments.length} />
          <SummaryMetric label="Not Applicable Documents" value={assembly.notApplicableDocuments.length} />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <DocumentSection title="Required Documents" documents={assembly.requiredDocuments} />
        <DocumentSection title="Optional Documents" documents={assembly.optionalDocuments} />
        <DocumentSection title="Conditional Documents" documents={assembly.conditionalDocuments} />
        <DocumentSection title="Not Applicable Documents" documents={assembly.notApplicableDocuments} />
      </div>
    </div>
  );
}