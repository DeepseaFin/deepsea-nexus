import { useMemo } from "react";
import UIButton from "@/components/ui/Button";
import UICard from "@/components/ui/Card";
import { getAllSections, getSection, type BusinessPassportSectionId } from "@/lib/customer/passport/business-passport-section-registry";
import type { BusinessPassportValidationStatus } from "@/lib/customer/passport/business-passport-workspace-orchestrator.types";

export interface ContextNavigationItem {
  readonly id: string;
  readonly label: string;
  readonly active?: boolean;
  readonly completed?: boolean;
  readonly disabled?: boolean;
  readonly dirty?: boolean;
  readonly validation?: BusinessPassportValidationStatus;
  readonly recommended?: boolean;
}

export interface ContextNavigationProps {
  readonly items: readonly ContextNavigationItem[];
  readonly onSelectSection?: (sectionId: string) => void;
  readonly onPreviousSection?: () => void;
  readonly onNextSection?: () => void;
  readonly canGoPrevious?: boolean;
  readonly canGoNext?: boolean;
  readonly recommendedSectionId?: string | null;
}

function validationClass(status: BusinessPassportValidationStatus | undefined): string {
  if (status === "error") {
    return "text-rose-300";
  }

  if (status === "warning") {
    return "text-amber-300";
  }

  if (status === "success") {
    return "text-emerald-300";
  }

  return "text-slate-400";
}

export default function ContextNavigation({
  items,
  onSelectSection,
  onPreviousSection,
  onNextSection,
  canGoPrevious = false,
  canGoNext = false,
  recommendedSectionId,
}: ContextNavigationProps) {
  const visibleItems = useMemo(() => {
    const orderById = new Map(getAllSections().map((section) => [section.id, section.order] as const));

    return items
      .filter((item) => {
        const section = getSection(item.id as BusinessPassportSectionId);
        return section?.navigationVisible ?? true;
      })
      .sort((left, right) => {
        const leftOrder = orderById.get(left.id as BusinessPassportSectionId) ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = orderById.get(right.id as BusinessPassportSectionId) ?? Number.MAX_SAFE_INTEGER;
        return leftOrder - rightOrder;
      });
  }, [items]);

  return (
    <UICard variant="subtle" className="p-4 sm:p-5" aria-label="Business passport context navigation">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Context Navigation</h3>
        <div className="flex items-center gap-2">
          <UIButton variant="ghost" size="sm" disabled={!canGoPrevious} onClick={onPreviousSection}>
            Previous Section
          </UIButton>
          <UIButton variant="primary" size="sm" disabled={!canGoNext} onClick={onNextSection}>
            Next Section
          </UIButton>
        </div>
      </div>

      <nav aria-label="Section navigation" className="mt-3">
        <ul className="flex flex-wrap gap-2">
          {visibleItems.map((item) => {
            const isRecommended = item.recommended ?? (recommendedSectionId != null && recommendedSectionId === item.id);
            const stateLabel = item.completed
              ? "Completed"
              : item.disabled
                ? "Blocked"
                : isRecommended
                  ? "Recommended"
                  : item.dirty
                    ? "Edited"
                    : "Open";

            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={item.disabled}
                  onClick={() => onSelectSection?.(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ds-motion ${
                    item.active
                      ? "border-cyan-500/70 bg-cyan-900/30 text-cyan-100"
                      : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500 hover:text-slate-100"
                  } ${item.disabled ? "cursor-not-allowed opacity-55" : ""}`}
                  aria-current={item.active ? "true" : undefined}
                  aria-disabled={item.disabled ? true : undefined}
                >
                  <span>{item.label}</span>
                  <span className={`text-[10px] uppercase tracking-[0.11em] ${validationClass(item.validation)}`}>
                    {stateLabel}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </UICard>
  );
}
