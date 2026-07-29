"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UIButton from "@/components/ui/Button";
import UICard from "@/components/ui/Card";

export type JourneyStepId =
  | "product-home"
  | "dashboard"
  | "clients"
  | "business-passport"
  | "documents"
  | "evidence"
  | "knowledge"
  | "relationship-workspace"
  | "workflow"
  | "activity";

interface JourneyStep {
  readonly id: JourneyStepId;
  readonly label: string;
  readonly href: string;
}

const JOURNEY_STEPS: readonly JourneyStep[] = [
  { id: "product-home", label: "Product Home", href: "/atlas/product-home" },
  { id: "dashboard", label: "Dashboard", href: "/atlas/dashboard" },
  { id: "clients", label: "Clients", href: "/atlas/clients" },
  { id: "business-passport", label: "Business Passport", href: "/atlas/business-passport" },
  { id: "documents", label: "Documents", href: "/atlas/business-passport/documents" },
  { id: "evidence", label: "Evidence", href: "/atlas/business-passport/evidence" },
  { id: "knowledge", label: "Knowledge", href: "/atlas/business-passport/knowledge" },
  { id: "relationship-workspace", label: "Relationship Workspace", href: "/atlas/business-passport/relationship-workspace" },
  { id: "workflow", label: "Workflow", href: "/atlas/business-passport/workflow" },
  { id: "activity", label: "Activity", href: "/atlas/business-passport/activity" },
] as const;

export interface CustomerJourneyNavigatorProps {
  readonly currentStep: JourneyStepId;
}

function withContext(href: string, params: URLSearchParams): string {
  const nextParams = new URLSearchParams(params.toString());

  if (!nextParams.get("customerId")) {
    nextParams.set("customerId", "cust-crescent-trade-holdings");
  }

  if (!nextParams.get("passportId")) {
    nextParams.set("passportId", "BPP-UAE-2026-0148");
  }

  if (!nextParams.get("workspace")) {
    nextParams.set("workspace", "atlas");
  }

  const query = nextParams.toString();
  return query ? `${href}?${query}` : href;
}

export default function CustomerJourneyNavigator({ currentStep }: CustomerJourneyNavigatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeIndex = useMemo(() => {
    return JOURNEY_STEPS.findIndex((step) => step.id === currentStep);
  }, [currentStep]);

  const previousStep = activeIndex > 0 ? JOURNEY_STEPS[activeIndex - 1] : null;
  const nextStep = activeIndex >= 0 && activeIndex < JOURNEY_STEPS.length - 1 ? JOURNEY_STEPS[activeIndex + 1] : null;

  return (
    <UICard variant="subtle" className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Customer Journey</p>
          <p className="mt-1 text-sm text-slate-300">End-to-end navigation with preserved business context.</p>
        </div>

        <div className="flex items-center gap-2">
          <UIButton
            variant="ghost"
            size="sm"
            disabled={!previousStep}
            onClick={() => {
              if (!previousStep) {
                return;
              }

              router.push(withContext(previousStep.href, new URLSearchParams(searchParams.toString())));
            }}
          >
            Previous
          </UIButton>
          <UIButton
            variant="primary"
            size="sm"
            disabled={!nextStep}
            onClick={() => {
              if (!nextStep) {
                return;
              }

              router.push(withContext(nextStep.href, new URLSearchParams(searchParams.toString())));
            }}
          >
            Next
          </UIButton>
        </div>
      </div>

      <ol className="mt-4 flex flex-wrap gap-2">
        {JOURNEY_STEPS.map((step) => {
          const active = step.id === currentStep;
          return (
            <li key={step.id}>
              <Link
                href={withContext(step.href, new URLSearchParams(searchParams.toString()))}
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium ds-motion ${
                  active
                    ? "border-cyan-500/70 bg-cyan-900/30 text-cyan-100"
                    : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500 hover:text-slate-100"
                }`}
                aria-current={active ? "step" : undefined}
              >
                {step.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </UICard>
  );
}
