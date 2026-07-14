import type { OracleUploadResult } from "@/src/capabilities/institution-wizard/types/OracleUploadResult";

type UploadStepProps = {
  uploadedFiles: readonly string[];
  onSimulateUpload: () => Promise<void>;
  isProcessing: boolean;
  oracleResult: OracleUploadResult | null;
  oracleError: string | null;
};

function confidenceTone(confidence: number): string {
  if (confidence >= 90) return "text-emerald-200";
  if (confidence >= 80) return "text-cyan-200";
  return "text-amber-200";
}

export default function UploadStep({
  uploadedFiles,
  onSimulateUpload,
  isProcessing,
  oracleResult,
  oracleError,
}: UploadStepProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Upload Trade License</h2>
      <p className="mt-1 text-sm text-slate-400">Placeholder ORACLE extraction flow. No OCR is executed.</p>

      <div className="mt-4 rounded border border-dashed border-cyan-700/50 bg-cyan-950/20 p-4">
        <p className="text-sm text-cyan-100">Trade license document area</p>
        <p className="mt-1 text-xs text-slate-300">Accepted format placeholder: PDF</p>
        <button
          type="button"
          onClick={() => {
            void onSimulateUpload();
          }}
          disabled={isProcessing}
          className="mt-3 rounded border border-cyan-700/40 bg-cyan-950/40 px-3 py-2 text-sm font-medium text-cyan-100 disabled:opacity-50"
        >
          {isProcessing ? "Processing with ORACLE..." : "Simulate Upload"}
        </button>
      </div>

      {oracleError && (
        <p className="mt-3 rounded border border-rose-700/40 bg-rose-950/20 px-3 py-2 text-sm text-rose-200">
          {oracleError}
        </p>
      )}

      {oracleResult && (
        <div className="mt-3 rounded border border-emerald-700/30 bg-emerald-950/20 px-3 py-2 text-sm">
          <p className="font-medium text-emerald-100">{oracleResult.message}</p>
          <p className="mt-1 text-xs text-slate-300">Reference: {oracleResult.oracleReference}</p>
          <p className={`mt-1 text-xs ${confidenceTone(oracleResult.confidenceScore)}`}>
            Confidence: {oracleResult.confidenceScore}%
          </p>
        </div>
      )}

      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Uploaded Files</p>
        <div className="mt-2 space-y-1">
          {uploadedFiles.length === 0 && (
            <p className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1 text-sm text-slate-400">No files uploaded yet.</p>
          )}
          {uploadedFiles.map((file) => (
            <p key={file} className="rounded border border-emerald-700/40 bg-emerald-950/20 px-2 py-1 text-sm text-emerald-200">
              {file}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}