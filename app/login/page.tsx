"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageHero from "@/components/marketing/PageHero";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nextPath = searchParams.get("next");
  const callbackHref = useMemo(() => {
    if (!nextPath || (nextPath !== "/atlas" && !nextPath.startsWith("/atlas/"))) {
      return "/atlas/institution-home";
    }

    return nextPath;
  }, [nextPath]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = typeof payload?.error === "string"
          ? payload.error
          : "Unable to sign in. Check your credentials and try again.";
        setErrorMessage(message);
        return;
      }

      router.replace(callbackHref);
      router.refresh();
    } catch {
      setErrorMessage("Unable to sign in right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-12">
      <PageHero
        eyebrow="Client Access"
        title="Institutional Access Portal"
        description="Sign in to your Deepsea Nexus workspace to continue portfolio oversight, workflow progression, and institutional collaboration."
        primaryCta={{ href: "/login", label: "Secure Sign In" }}
        secondaryCta={{ href: "/contact", label: "Need Access Support" }}
      />

      <section className="mx-auto max-w-xl rounded-3xl border border-slate-700/70 bg-[linear-gradient(165deg,rgba(11,19,33,0.95),rgba(8,16,28,0.95))] p-8 sm:p-10">
        <h2 className="text-2xl font-semibold text-slate-100">Secure Login</h2>
        <p className="mt-2 text-sm text-slate-300">
          This interface is prepared for institutional authentication integration.
        </p>

        <form className="mt-6 space-y-4" aria-label="Login form" onSubmit={handleSignIn}>
          <label className="space-y-1 block">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Work Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          <label className="space-y-1 block">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Password</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          {errorMessage ? (
            <p role="alert" className="rounded-xl border border-rose-700/60 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Signing in..." : "Sign In"}
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
