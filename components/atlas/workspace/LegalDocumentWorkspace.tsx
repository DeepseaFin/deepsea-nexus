"use client";

import { useMemo, useState } from "react";
import { useDeal } from "@/components/atlas/common/DealContext";
import { LegalAssemblyEngine } from "@/atlas-core/legal/LegalAssemblyEngine";
import {
  LegalDocumentGenerator,
  type LegalPackageDocumentStatus,
  type LegalPreviewSection,
} from "@/atlas-core/legal/LegalDocumentGenerator";

const documentStatusStyles: Record<LegalPackageDocumentStatus, string> = {
  Generated: "border-slate-500/40 bg-slate-500/10 text-slate-200",
  "Pending Review": "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "Pending Signatures": "border-orange-500/30 bg-orange-500/10 text-orange-300",
  "Ready For Execution": "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  Executed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
};

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</h3>;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-200"
    >
      {label}
    </button>
  );
}

function PreviewSection({ section }: { section: LegalPreviewSection }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{section.sectionName}</p>
      <div className="mt-3 space-y-3">
        {(section.clauses ?? []).map((clause) => (
          <div key={clause.clauseId} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-sm font-semibold text-slate-100">{clause.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{clause.content}</p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
              <div className="rounded-md border border-slate-800 bg-slate-900/60 p-2">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">Source</p>
                <p className="mt-1 text-xs text-slate-300">{clause.metadata.source}</p>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-900/60 p-2">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">Owner</p>
                <p className="mt-1 text-xs text-slate-300">{clause.metadata.owner}</p>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-900/60 p-2">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">Editable</p>
                <p className="mt-1 text-xs text-slate-300">{clause.metadata.editable ? "Yes" : "No"}</p>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-900/60 p-2">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">Last Updated</p>
                <p className="mt-1 text-xs text-slate-300">{clause.metadata.lastUpdated}</p>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-900/60 p-2">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">Version</p>
                <p className="mt-1 text-xs text-slate-300">{clause.metadata.version}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LegalDocumentWorkspace() {
  const { deal } = useDeal();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const assembly = useMemo(() => LegalAssemblyEngine.assembleLegalRequirements(deal), [deal]);

  const legalPackage = useMemo(
    () => LegalDocumentGenerator.generateLegalPackage(deal, assembly),
    [deal, assembly],
  );

  const documents = legalPackage.documents ?? [];
  const selectedDocument =
    documents.find((document) => document.documentId === selectedDocumentId) ?? documents[0] ?? null;

  const pendingReview = documents.filter((document) => document.documentStatus === "Pending Review").length;
  const pendingSignatures = documents.filter((document) => document.documentStatus === "Pending Signatures").length;
  const readyForExecution = documents.filter((document) => document.documentStatus === "Ready For Execution").length;

  const packageStatus =
    legalPackage.overallReadiness >= 95
      ? "Execution Complete"
      : legalPackage.overallReadiness >= 80
        ? "Execution Ready"
        : "Under Legal Preparation";

  return (
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
      <h2 className="text-2xl font-semibold text-white">Legal Document Generator</h2>
      <p className="mt-2 text-slate-400">Institutional-grade legal package generation from approved Final Executable Term Sheet</p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <SectionTitle title="Generated Legal Package" />
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-10">
          <StatCard label="Package Status" value={packageStatus} />
          <StatCard label="Version" value={legalPackage.packageVersion} />
          <StatCard label="Jurisdiction" value={legalPackage.jurisdiction} />
          <StatCard label="Governing Law" value={legalPackage.governingLaw} />
          <StatCard label="Documents Generated" value={documents.length} />
          <StatCard label="Pending Review" value={pendingReview} />
          <StatCard label="Pending Signatures" value={pendingSignatures} />
          <StatCard label="Ready For Execution" value={readyForExecution} />
          <StatCard label="Overall Readiness" value={`${legalPackage.overallReadiness}%`} />
          <StatCard label="Generated Date" value={legalPackage.generatedDate} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {documents.map((document) => {
          const isActive = selectedDocument?.documentId === document.documentId;

          return (
            <div
              key={document.documentId}
              className={`rounded-xl border bg-slate-950/70 p-4 transition ${
                isActive ? "border-cyan-500/40" : "border-slate-800"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{document.documentName}</p>
                  <p className="mt-1 text-xs text-slate-500">{document.documentId}</p>
                </div>
                <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold ${documentStatusStyles[document.documentStatus]}`}>
                  {document.documentStatus}
                </span>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard label="Version" value={document.version} />
                <StatCard label="Execution Status" value={document.executionStatus} />
                <StatCard label="Sequence" value={document.executionSequence} />
                <StatCard label="Readiness" value={`${document.readinessScore}%`} />
                <StatCard label="Jurisdiction" value={document.jurisdiction} />
                <StatCard label="Governing Law" value={document.governingLaw} />
              </div>

              <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Required Signatories</p>
                <p className="mt-1 text-sm text-slate-300">{(document.requiredSignatories ?? []).join(" | ")}</p>
              </div>

              <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Missing Inputs</p>
                {(document.missingInputs ?? []).length === 0 ? (
                  <p className="mt-1 text-sm text-emerald-300">No missing inputs.</p>
                ) : (
                  <ul className="mt-2 space-y-1 text-sm text-rose-200">
                    {(document.missingInputs ?? []).map((item, index) => (
                      <li key={`${document.documentId}-missing-${index + 1}`}>- {item}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDocumentId(document.documentId)}
                  className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-300 transition hover:bg-cyan-500/20"
                >
                  View
                </button>
                <ActionButton label="Export PDF" />
                <ActionButton label="Export DOCX" />
                <ActionButton label="Print" />
                <ActionButton label="Compare Versions" />
              </div>
            </div>
          );
        })}
      </div>

      {selectedDocument ? (
        <div className="mt-8 rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">In-App Document Preview</h3>
              <p className="mt-1 text-sm text-slate-400">{selectedDocument.documentName} | Version {selectedDocument.version}</p>
            </div>
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${documentStatusStyles[selectedDocument.documentStatus]}`}>
              {selectedDocument.documentStatus}
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Header</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Document Title" value={selectedDocument.header.documentTitle} />
              <StatCard label="Version" value={selectedDocument.header.version} />
              <StatCard label="Document Number" value={selectedDocument.header.documentNumber} />
              <StatCard label="Execution Date" value={selectedDocument.header.executionDate} />
              <StatCard label="Governing Law" value={selectedDocument.header.governingLaw} />
              <StatCard label="Jurisdiction" value={selectedDocument.header.jurisdiction} />
              <StatCard label="Prepared By" value={selectedDocument.header.preparedBy} />
              <StatCard label="Generated Timestamp" value={selectedDocument.header.generatedTimestamp} />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Parties</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Seller" value={selectedDocument.parties.seller} />
              <StatCard label="Purchaser" value={selectedDocument.parties.purchaser} />
              <StatCard label="Financier" value={selectedDocument.parties.financier} />
              <StatCard label="Collection Bank" value={selectedDocument.parties.collectionBank} />
              <StatCard label="Obligor" value={selectedDocument.parties.obligor} />
              <StatCard label="Guarantor" value={selectedDocument.parties.guarantor} />
              <StatCard label="Security Provider" value={selectedDocument.parties.securityProvider} />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Auto-Populated Fields</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {Object.entries(selectedDocument.populatedFields ?? {}).map(([field, value]) => (
                <div key={`${selectedDocument.documentId}-${field}`} className="rounded-md border border-slate-800 bg-slate-950/70 p-2">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">{field}</p>
                  <p className="mt-1 text-xs text-slate-200">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {(selectedDocument.previewSections ?? []).map((section) => (
              <PreviewSection key={`${selectedDocument.documentId}-${section.sectionName}`} section={section} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
