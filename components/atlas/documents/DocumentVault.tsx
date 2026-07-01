"use client";

import { sampleDocuments } from "@/atlas-core/documents/sampleDocuments";

const statusToneMap: Record<string, string> = {
  Verified: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  "Pending Review": "border-amber-500/30 bg-amber-500/15 text-amber-400",
  Missing: "border-rose-500/30 bg-rose-500/15 text-rose-400",
  "AI Extracted": "border-cyan-500/30 bg-cyan-500/15 text-cyan-400",
};

const documentIconMap: Record<string, string> = {
  Invoice: "📄",
  "KYC Documents": "🗂️",
  "Board Resolution": "⚠️",
  "Credit Summary": "🤖",
};

export default function DocumentVault() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">Deal Documents</h2>
        <p className="mt-1 text-sm text-slate-400">All documents attached to this deal.</p>
      </div>

      <div className="space-y-3">
        {sampleDocuments.map((document) => (
          <div
            key={document.id}
            className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-xl">
                {documentIconMap[document.documentType] ?? "📄"}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-white">{document.fileName}</p>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusToneMap[document.status] ?? statusToneMap.Verified}`}
                  >
                    {document.status}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-sm text-slate-400">
                  <span>{document.documentType}</span>
                  <span>{document.fileSize}</span>
                  <span>
                    AI Confidence: {document.aiConfidence !== null ? `${document.aiConfidence}%` : "N/A"}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
                  <span>Uploaded: {document.uploadedDate}</span>
                  <span>By: {document.uploadedBy}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
