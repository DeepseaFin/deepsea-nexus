import Link from "next/link";
import UICard from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";
import JourneyScreen from "@/components/customer/passport/JourneyScreen";

export default function ClientsPage() {
  const primaryJourneyHref = "/atlas/business-passport?customerId=cust-crescent-trade-holdings&passportId=BPP-UAE-2026-0148&workspace=atlas";

  return (
    <JourneyScreen>
      <UICard variant="subtle" className="p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Clients</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Select Relationship Context</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Choose a business profile to enter the Business Passport workspace and continue the complete customer journey.
        </p>

        <div className="mt-5 grid gap-3">
          <Link href={primaryJourneyHref} className="rounded-2xl border border-cyan-700/50 bg-cyan-950/25 p-4 ds-motion hover:border-cyan-500/60 hover:bg-cyan-900/30">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">Crescent Trade Holdings Limited</p>
                <p className="mt-1 text-xs text-slate-400">Primary relationship | Passport BPP-UAE-2026-0148</p>
              </div>
              <StatusChip label="Journey Ready" variant="success" />
            </div>
          </Link>
        </div>
      </UICard>

      <CustomerJourneyNavigator currentStep="clients" />
    </JourneyScreen>
  );
}
