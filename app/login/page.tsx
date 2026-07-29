import Link from "next/link";
import PageHero from "@/components/marketing/PageHero";

export default function LoginPage() {
  return (
    <div className="space-y-12">
      <PageHero
        eyebrow="Client Access"
        title="Institutional Access Portal"
        description="Sign in to your Deepsea Nexus workspace to continue portfolio oversight, workflow progression, and institutional collaboration."
        primaryCta={{ href: "/login", label: "Continue to Sign In" }}
        secondaryCta={{ href: "/contact", label: "Need Access Support" }}
      />

      <section className="mx-auto max-w-xl rounded-3xl border border-slate-700/70 bg-[linear-gradient(165deg,rgba(11,19,33,0.95),rgba(8,16,28,0.95))] p-8 sm:p-10">
        <h2 className="text-2xl font-semibold text-slate-100">Secure Login</h2>
        <p className="mt-2 text-sm text-slate-300">
          This interface is prepared for institutional authentication integration.
        </p>

        <form className="mt-6 space-y-4" aria-label="Login form">
          <label className="space-y-1 block">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Work Email</span>
            <input
              type="email"
              name="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          <label className="space-y-1 block">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Password</span>
            <input
              type="password"
              name="password"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <Link href="/contact" className="hover:text-cyan-200">Request access</Link>
          <Link href="/contact" className="hover:text-cyan-200">Need help?</Link>
        </div>
      </section>
    </div>
  );
}
