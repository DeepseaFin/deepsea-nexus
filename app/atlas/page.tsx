import Link from "next/link";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";
import JourneyScreen from "@/components/customer/passport/JourneyScreen";
import UICard from "@/components/ui/Card";

const PASSENGER_CONTEXT_QUERY = "customerId=cust-crescent-trade-holdings&passportId=BPP-UAE-2026-0148&workspace=atlas";

export default function AtlasPage() {
  return (
    <JourneyScreen>
      <UICard variant="subtle" className="p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">ATLAS</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Institution Operating Surface</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          This is the ATLAS entry point for the customer demonstration flow. Continue to the customer list and launch the
          Business Passport operational workspace.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/atlas/clients?${PASSENGER_CONTEXT_QUERY}`}
            className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 ds-motion hover:bg-cyan-300"
          >
            Open Customer List
          </Link>
          <Link
            href={`/atlas/business-passport?${PASSENGER_CONTEXT_QUERY}`}
            className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-100 ds-motion hover:border-cyan-400/60 hover:text-cyan-200"
          >
            Open Business Passport
          </Link>
        </div>
      </UICard>

      <CustomerJourneyNavigator currentStep="atlas" />
    </JourneyScreen>
  );
}
