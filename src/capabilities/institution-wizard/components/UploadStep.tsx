type UploadStepProps = {
  uploadedFiles: readonly string[];
  onSimulateUpload: () => void;
};

export default function UploadStep({ uploadedFiles, onSimulateUpload }: UploadStepProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Upload Trade License</h2>
      <p className="mt-1 text-sm text-slate-400">Placeholder upload interaction. No OCR is executed.</p>

      <div className="mt-4 rounded border border-dashed border-cyan-700/50 bg-cyan-950/20 p-4">
        <p className="text-sm text-cyan-100">Trade license document area</p>
        <p className="mt-1 text-xs text-slate-300">Accepted format placeholder: PDF</p>
        <button
          type="button"
          onClick={onSimulateUpload}
          className="mt-3 rounded border border-cyan-700/40 bg-cyan-950/40 px-3 py-2 text-sm font-medium text-cyan-100"
        >
          Simulate Upload
        </button>
      </div>

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