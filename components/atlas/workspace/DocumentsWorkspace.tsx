"use client";

import { useMemo, useState } from "react";
import { FileCheck } from "lucide-react";
import DocumentUploadZone, { type UploadedFileView } from "@/components/atlas/documents/DocumentUploadZone";
import { useDeal } from "@/components/atlas/common/DealContext";
import { EvidenceEngine } from "@/atlas-core/evidence/EvidenceEngine";

const statusBadgeStyles: Record<string, string> = {
  verified: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  missing: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

const warningSeverityStyles: Record<string, string> = {
  low: "border-slate-700 bg-slate-800/80 text-slate-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  high: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</h3>;
}

export default function DocumentsWorkspace() {
  const { deal } = useDeal();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileView[]>([]);
  const [showUploadZone, setShowUploadZone] = useState(false);

  const evidence = useMemo(() => {
    return EvidenceEngine.evaluateEvidence({
      deal,
      uploads: uploadedFiles.map((file) => ({
        name: file.name,
        documentType: file.documentType,
        confidence: file.confidence,
      })),
    });
  }, [deal, uploadedFiles]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
        <h2 className="text-2xl font-semibold text-white">Documents Workspace</h2>
        <p className="mt-2 text-slate-400">Institutional Evidence Workstation</p>

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Executive Evidence Summary</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Evidence Readiness</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{evidence.readiness}%</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Recommendation</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{evidence.recommendation}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Missing Documents</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{evidence.missingMandatoryDocuments.length}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Verified Documents</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{evidence.verifiedDocuments.length}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Critical Documents Pending</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{evidence.criticalDocumentsPending}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <SectionTitle title="4. Evidence Warnings" />
              <div className="mt-3 space-y-2">
                {evidence.warnings.length === 0 ? (
                  <p className="text-sm text-slate-400">No evidence warnings.</p>
                ) : (
                  evidence.warnings.map((warning) => (
                    <div key={warning.code} className={`rounded-lg border p-3 text-sm ${warningSeverityStyles[warning.severity]}`}>
                      <p className="font-semibold uppercase tracking-wide">{warning.code}</p>
                      <p className="mt-1">{warning.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <SectionTitle title="5. Evidence Blockers" />
              <div className="mt-3 space-y-2">
                {evidence.criticalBlockers.length === 0 ? (
                  <p className="text-sm text-slate-400">No evidence blockers.</p>
                ) : (
                  evidence.criticalBlockers.map((blocker) => (
                    <div key={blocker.code} className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3 text-sm text-rose-100">
                      <p className="font-semibold uppercase tracking-wide">{blocker.code}</p>
                      <p className="mt-1">{blocker.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="6. Required Actions" />
            <div className="mt-3 space-y-2">
              {evidence.requiredActions.length === 0 ? (
                <p className="text-sm text-slate-400">No required actions.</p>
              ) : (
                evidence.requiredActions.map((action) => (
                  <div key={action.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
                    <p className="font-medium text-slate-100">{action.action}</p>
                    <p className="mt-1 text-xs text-slate-500">Owner: {action.owner}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="Executive Evidence Narrative" />
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Evidence readiness is {evidence.readiness}%. Missing mandatory documents: {evidence.missingMandatoryDocuments.length}. Evidence blockers: {evidence.criticalBlockers.length}. Recommendation: {evidence.recommendation}.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{evidence.summary.narrative}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="1. Required Documents" />
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="pb-2 pr-4">Document Name</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">Mandatory / Optional</th>
                    <th className="pb-2 pr-4">Verified / Pending</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {evidence.requiredDocuments.map((document) => (
                    <tr key={document.id} className="border-t border-slate-800">
                      <td className="py-2 pr-4">
                        <p className="font-medium text-slate-100">{document.name}</p>
                        <p className="text-xs text-slate-500">{document.category}</p>
                      </td>
                      <td className="py-2 pr-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusBadgeStyles[document.status]}`}>
                          {document.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4">{document.mandatory ? "Mandatory" : "Optional"}</td>
                      <td className="py-2 pr-4">{document.verification === "verified" ? "Verified" : "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <SectionTitle title="2. Missing Documents" />
              <div className="mt-3 space-y-2">
                {evidence.missingMandatoryDocuments.length === 0 ? (
                  <p className="text-sm text-slate-400">No missing mandatory documents.</p>
                ) : (
                  evidence.missingMandatoryDocuments.map((document) => (
                    <div key={document.id} className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3 text-sm text-rose-100">
                      {document.category}: {document.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <SectionTitle title="3. Verified Documents" />
              <div className="mt-3 space-y-2">
                {evidence.verifiedDocuments.length === 0 ? (
                  <p className="text-sm text-slate-400">No verified documents yet.</p>
                ) : (
                  evidence.verifiedDocuments.map((document) => (
                    <div key={document.id} className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-3 text-sm text-emerald-100">
                      {document.category}: {document.name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTitle title="Upload Zone" />
              <button
                type="button"
                onClick={() => setShowUploadZone((current) => !current)}
                className="rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-900/40"
              >
                Upload Documents
              </button>
            </div>

            {showUploadZone ? (
              <div className="mt-4">
                <DocumentUploadZone onFilesChange={setUploadedFiles} />
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                Upload zone is collapsed by default. Click &quot;Upload Documents&quot; to expand.
              </p>
            )}
          </div>
        </div>
      </div>

      {uploadedFiles.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-400">
          <div className="inline-flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Upload documents to populate live evidence evaluation outputs.
          </div>
        </div>
      )}
    </div>
  );
}
