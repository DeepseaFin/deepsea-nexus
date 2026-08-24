import Link from "next/link";
import ProductHome from "@/components/product/home/ProductHome";
import UICard from "@/components/ui/Card";
import { composeInstitutionHomePageModel } from "@/lib/application/InstitutionHomeComposer";
import { getOperationsCenterContexts } from "@/lib/workflows/DemoScenario";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institution Home | Deepsea Nexus",
  description: "Institution command home focused on immediate priorities, next actions, and journey progression.",
};

export default function AtlasInstitutionHomePage() {
  const pageModel = composeInstitutionHomePageModel({
    contexts: getOperationsCenterContexts(),
  });

  return (
    <div className="space-y-4">
      <UICard variant="accent" className="p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Institution Home</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">What matters right now</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Focus on the next institutional action and move from context to completion.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Current Context</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">{pageModel.hero.currentContextLabel}</p>
            <p className="mt-1 text-xs text-slate-400">
              {pageModel.hero.currentContextLifecycleLabel}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/55 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Next Action</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">
              {pageModel.hero.nextActionLabel}
            </p>
            <p className="mt-1 text-xs text-slate-400">{pageModel.hero.nextActionDescription}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={pageModel.hero.journeyHref}
            className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 ds-motion hover:bg-cyan-300"
          >
            Open Journey Workspace
          </Link>
          <Link
            href={pageModel.hero.workQueueHref}
            className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-100 ds-motion hover:border-cyan-400/60 hover:text-cyan-200"
          >
            Open Work Queue
          </Link>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Need full context for the current opportunity? Open{" "}
          <Link href={pageModel.hero.opportunityHref} className="text-cyan-300 hover:text-cyan-200">
            Opportunity Workspace
          </Link>
          .
        </p>
      </UICard>

      <ProductHome
        welcome={pageModel.welcome}
        insights={pageModel.insights}
        workQueue={pageModel.workQueue}
        quickActions={pageModel.quickActions}
      />
    </div>
  );
}