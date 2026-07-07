"use client";

import { useMemo, useState } from "react";
import { useDeal } from "@/components/atlas/common/DealContext";
import { LegalDocumentationEngine } from "@/atlas-core/evaluation/LegalDocumentationEngine";
import { LegalAssemblyEngine } from "@/atlas-core/legal/LegalAssemblyEngine";
import { LegalDocumentGenerator } from "@/atlas-core/legal/LegalDocumentGenerator";
import LegalAssemblyWorkspace from "@/components/atlas/workspace/LegalAssemblyWorkspace";
import LegalDocumentWorkspace from "@/components/atlas/workspace/LegalDocumentWorkspace";
import LegalClauseLibrary from "@/components/atlas/workspace/LegalClauseLibrary";
import WorkspaceTabs from "@/components/atlas/workspace/WorkspaceTabs";

type LegalTab = "Overview" | "Documents" | "Viewer" | "Clause Library" | "Execution" | "Checklist" | "Audit Trail";

const LEGAL_TABS: LegalTab[] = [
  "Overview",
  "Documents",
  "Viewer",
  "Clause Library",
  "Execution",
  "Checklist",
  "Audit Trail",
];

const statusStyles: Record<string, string> = {
  Generated: "border-slate-600 bg-slate-800/70 text-slate-200",
  "Ready for Review": "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  Approved: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  Executed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "Pending Signatures": "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "Missing Inputs": "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

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

export default function LegalWorkspace() {
  const [activeTab, setActiveTab] = useState<LegalTab>("Overview");
  const { deal } = useDeal();
  const legal = useMemo(() => LegalDocumentationEngine.generateLegalDocumentation(deal), [deal]);
  const assembly = useMemo(() => LegalAssemblyEngine.assembleLegalRequirements(deal), [deal]);
  const legalPackage = useMemo(() => LegalDocumentGenerator.generateLegalPackage(deal, assembly), [deal, assembly]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
        <h2 className="text-2xl font-semibold text-white">Legal Workspace</h2>
        <p className="mt-2 text-slate-400">Institutional Legal Documentation Dashboard (Read-Only)</p>

        <WorkspaceTabs tabs={LEGAL_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6 space-y-4">
          {activeTab === "Overview" ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="1. Executive Legal Summary" />
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <SummaryMetric label="Overall Legal Readiness" value={`${legal.executiveSummary.overallLegalReadiness}%`} />
              <SummaryMetric label="Documents Generated" value={legal.executiveSummary.documentsGenerated} />
              <SummaryMetric label="Documents Pending" value={legal.executiveSummary.documentsPending} />
              <SummaryMetric label="Documents Executed" value={legal.executiveSummary.documentsExecuted} />
              <SummaryMetric label="Missing Mandatory Inputs" value={legal.executiveSummary.missingMandatoryInputs} />
              <SummaryMetric label="Legal Recommendation" value={legal.executiveSummary.legalRecommendation} />
            </div>
          </div> : null}

          {activeTab === "Documents" ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="2. Generated Documents" />
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2 font-medium">Document Name</th>
                    <th className="px-3 py-2 font-medium">Version</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Required Signatories</th>
                    <th className="px-3 py-2 font-medium">Pending Signatures</th>
                    <th className="px-3 py-2 font-medium">Generated Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {legal.generatedDocuments.map((doc) => (
                    <tr key={doc.documentName} className="border-b border-slate-800/70 text-slate-200">
                      <td className="px-3 py-3">{doc.documentName}</td>
                      <td className="px-3 py-3">{doc.version}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${statusStyles[doc.status]}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">{doc.requiredSignatories.length}</td>
                      <td className="px-3 py-3">{doc.pendingSignatures}</td>
                      <td className="px-3 py-3">{doc.generatedTimestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> : null}

          {activeTab === "Documents" ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="3. Documents Ready For Review" />
            <div className="mt-3 space-y-2">
              {legal.documentsReadyForReview.length === 0 ? (
                <p className="text-sm text-slate-400">No documents are currently ready for review.</p>
              ) : (
                legal.documentsReadyForReview.map((doc) => (
                  <div key={`ready-${doc.documentName}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                    <p className="text-sm font-semibold text-slate-100">{doc.documentName}</p>
                    <p className="mt-1 text-xs text-slate-400">Auto-populated fields: {doc.autoPopulatedFields.length}</p>
                  </div>
                ))
              )}
            </div>
          </div> : null}

          {activeTab === "Execution" ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="4. Documents Awaiting Signatures" />
            <div className="mt-3 space-y-2">
              {legal.documentsAwaitingSignatures.length === 0 ? (
                <p className="text-sm text-slate-400">No documents are awaiting signatures.</p>
              ) : (
                legal.documentsAwaitingSignatures.map((doc) => (
                  <div key={`signature-${doc.documentName}`} className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                    <p className="text-sm font-semibold text-amber-200">{doc.documentName}</p>
                    <p className="mt-1 text-xs text-amber-100">Pending Signatures: {doc.pendingSignatures}</p>
                  </div>
                ))
              )}
            </div>
          </div> : null}

          {activeTab === "Checklist" ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="5. Missing Information" />
            <div className="mt-3 space-y-2">
              {legal.missingInformation.length === 0 ? (
                <p className="text-sm text-slate-400">No missing information detected.</p>
              ) : (
                legal.missingInformation.map((item, index) => (
                  <div key={`missing-${index + 1}`} className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-100">
                    {item}
                  </div>
                ))
              )}
            </div>
          </div> : null}

          {activeTab === "Checklist" ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="6. Execution Checklist" />
            <div className="mt-3 space-y-2">
              {legal.executionChecklist.map((item, index) => (
                <div key={`exec-check-${index + 1}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div> : null}

          {activeTab === "Checklist" ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="7. Closing Checklist" />
            <div className="mt-3 space-y-2">
              {legal.closingChecklist.map((item, index) => (
                <div key={`closing-check-${index + 1}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div> : null}

          {activeTab === "Audit Trail" ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="8. Document Dependency Matrix" />
            <div className="mt-3 space-y-2">
              {legal.documentDependencyMatrix.map((row) => (
                <div key={`deps-${row.documentName}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                  <p className="text-sm font-semibold text-slate-100">{row.documentName}</p>
                  <p className="mt-1 text-xs text-slate-400">{row.dependencies.join(" | ")}</p>
                </div>
              ))}
            </div>
          </div> : null}

          {activeTab === "Overview" ? <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="9. Executive Legal Narrative" />
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{legal.executiveLegalNarrative}</p>
          </div> : null}
        </div>
      </div>

      {activeTab === "Overview" ? <LegalAssemblyWorkspace /> : null}
      {activeTab === "Viewer" ? <LegalDocumentWorkspace /> : null}
      {activeTab === "Clause Library" ? <LegalClauseLibrary clauses={legalPackage.clauseRepository} /> : null}
    </div>
  );
}
