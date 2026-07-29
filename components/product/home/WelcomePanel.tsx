import UICard from "@/components/ui/Card";
import UIButton from "@/components/ui/Button";
import StatusChip from "@/components/ui/StatusChip";

export interface WelcomePanelProps {
  readonly greeting: string;
  readonly headline: string;
  readonly summary: string;
  readonly context: string;
  readonly chips?: readonly string[];
  readonly primaryActionLabel?: string;
  readonly secondaryActionLabel?: string;
}

export default function WelcomePanel({
  greeting,
  headline,
  summary,
  context,
  chips = [],
  primaryActionLabel,
  secondaryActionLabel,
}: WelcomePanelProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{greeting}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">{headline}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">{summary}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">{context}</p>

      {chips.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <StatusChip key={chip} label={chip} variant="info" />
          ))}
        </div>
      ) : null}

      {primaryActionLabel || secondaryActionLabel ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {primaryActionLabel ? <UIButton variant="primary">{primaryActionLabel}</UIButton> : null}
          {secondaryActionLabel ? <UIButton variant="ghost">{secondaryActionLabel}</UIButton> : null}
        </div>
      ) : null}
    </UICard>
  );
}
