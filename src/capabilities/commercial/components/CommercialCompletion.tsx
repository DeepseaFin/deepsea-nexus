type CommercialCompletionProps = {
  readonly onSubmitForApproval?: () => void;
  readonly isSubmitting?: boolean;
  readonly feedbackMessage?: string;
  readonly validationMessage?: string;
};

export default function CommercialCompletion({
  onSubmitForApproval,
  isSubmitting = false,
  feedbackMessage,
  validationMessage,
}: CommercialCompletionProps) {
  return (
    <section className="rounded-lg border border-emerald-700/40 bg-emerald-950/20 p-4">
      <h2 className="text-lg font-semibold text-emerald-100">Ready for Approval</h2>
      <p className="mt-2 text-sm text-emerald-200">
        READY FOR APPROVAL
      </p>
      <p className="mt-2 text-sm text-slate-300">
        The commercial origination package is complete and can now be routed to approval committees without leaving this workspace.
      </p>
      <div className="mt-4">
        <button
          type="button"
          onClick={onSubmitForApproval}
          disabled={isSubmitting}
          className="rounded border border-cyan-700/40 bg-cyan-950/20 px-3 py-2 text-sm font-medium text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit for Approval →"}
        </button>
      </div>
      {feedbackMessage ? (
        <p className="mt-3 rounded border border-emerald-700/40 bg-emerald-950/30 px-3 py-2 text-xs text-emerald-100">
          {feedbackMessage}
        </p>
      ) : null}
      {validationMessage ? (
        <p className="mt-3 rounded border border-amber-700/40 bg-amber-950/30 px-3 py-2 text-xs text-amber-100">
          {validationMessage}
        </p>
      ) : null}
    </section>
  );
}
