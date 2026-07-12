"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { businessUnderstandingService, type BusinessUnderstandingResult } from "@/lib/business/businessUnderstandingService";

const GOAL_CARDS = [
  { icon: "💰", title: "Improve Cash Flow" },
  { icon: "📈", title: "Grow My Business" },
  { icon: "🏭", title: "Finance My Invoices" },
  { icon: "🌍", title: "Expand Internationally" },
  { icon: "💡", title: "I'm Exploring Options" },
];

const TRUST_HIGHLIGHTS = [
  "Minimal Documents",
  "AI-Guided Business Assessment",
  "Relationship-First Approach",
];

const ORACLE_INTERACTIONS = [
  { icon: "🎤", title: "Speak" },
  { icon: "⌨️", title: "Type" },
  { icon: "📄", title: "Upload a Document" },
  { icon: "📷", title: "Take a Photo" },
];

const FUNDING_OPTIONS = ["AED 500K", "AED 1M", "AED 5M", "AED 10M+", "I'm Not Sure"] as const;

type ConversationStep = "confirmation" | "funding";
type WorkspaceStep = "workspace" | "relationship";

export default function Home() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [placeholderMessage, setPlaceholderMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadConfirmation, setUploadConfirmation] = useState<BusinessUnderstandingResult | null>(null);
  const [conversationStep, setConversationStep] = useState<ConversationStep>("confirmation");
  const [fundingGoal, setFundingGoal] = useState<string | null>(null);
  const [workspaceCreated, setWorkspaceCreated] = useState(false);
  const [workspaceStep, setWorkspaceStep] = useState<WorkspaceStep>("workspace");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isConversationStarted = selectedGoal !== null;

  const startConversation = (goalTitle: string) => {
    setSelectedGoal(goalTitle);
    setPlaceholderMessage("");
    setUploadError("");
    setConversationStep("confirmation");
    setFundingGoal(null);
    setWorkspaceCreated(false);
    setWorkspaceStep("workspace");
  };

  const handleInteractionPlaceholder = () => {
    setPlaceholderMessage("This capability will be enabled in the next step.");
    setUploadError("");
  };

  const handleUploadSelection = async (file: File) => {
    setIsUploading(true);
    setUploadError("");
    setUploadConfirmation(null);
    setConversationStep("confirmation");
    setFundingGoal(null);
    setWorkspaceCreated(false);
    setWorkspaceStep("workspace");
    setPlaceholderMessage("Uploading and processing your document...");

    try {
      const result = await businessUnderstandingService.analyze(file);
      setUploadConfirmation(result);
      setConversationStep("confirmation");
      setWorkspaceCreated(false);
      setWorkspaceStep("workspace");
      setPlaceholderMessage("Document processed. Please confirm the extracted details.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Document upload failed.";
      setUploadError(message);
      setPlaceholderMessage("");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile) {
      return;
    }

    void handleUploadSelection(selectedFile);
  };

  const onInteractionSelect = (interactionTitle: string) => {
    if (interactionTitle === "Upload a Document") {
      if (isUploading) {
        return;
      }

      setPlaceholderMessage("Select a document to begin upload.");
      setUploadError("");
      fileInputRef.current?.click();
      return;
    }

    setUploadConfirmation(null);
    setConversationStep("confirmation");
    setFundingGoal(null);
    setWorkspaceCreated(false);
    setWorkspaceStep("workspace");
    handleInteractionPlaceholder();
  };

  const onConfirmBusinessUnderstanding = () => {
    setConversationStep("funding");
    setPlaceholderMessage("Great. How much funding are you looking for?");
  };

  const onEditInformation = () => {
    setPlaceholderMessage("Editing will be enabled in the next step.");
  };

  const onSelectFundingGoal = (goal: string) => {
    setFundingGoal(goal);
    setPlaceholderMessage(`Funding goal selected: ${goal}`);
  };

  const onCreateWorkspace = () => {
    setWorkspaceCreated(true);
    setWorkspaceStep("workspace");
    setPlaceholderMessage("");
    setUploadError("");
  };

  const onContinueToRelationship = () => {
    setWorkspaceStep("relationship");
    setPlaceholderMessage("");
    setUploadError("");
  };

  const onWorkspaceAction = (message: string) => {
    setPlaceholderMessage(message);
    setUploadError("");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f9fc_0%,#ffffff_32%,#f7fafc_100%)] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/75 bg-white/85 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-900" aria-label="Deepsea home">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-600" />
            DEEPSEA
          </Link>

          <ul className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <li><a href="#solutions" className="transition-colors hover:text-slate-900">Solutions</a></li>
            <li><a href="#how-it-works" className="transition-colors hover:text-slate-900">How It Works</a></li>
            <li><a href="#insights" className="transition-colors hover:text-slate-900">Insights</a></li>
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="#meeting"
              className="rounded-full border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 sm:px-4 sm:text-sm"
            >
              Book a Meeting
            </Link>
            <Link
              href="/atlas"
              className="rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 sm:px-4 sm:text-sm"
            >
              Login
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-20">
        <section className="relative overflow-hidden" id="solutions" aria-live="polite">
          <div
            className={[
              "transition-all duration-500 ease-out",
              isConversationStarted
                ? "pointer-events-none -translate-y-3 opacity-0"
                : "translate-y-0 opacity-100",
            ].join(" ")}
            aria-hidden={isConversationStarted}
          >
            <div className="max-w-3xl">
              <p className="text-sm font-medium tracking-wide text-cyan-700">Deepsea Nexus</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Let&apos;s build your business together.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                We understand your business first, then recommend the right financial solution.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
                <Link
                  href="#how-it-works"
                  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Start Conversation
                </Link>
                <a
                  href="#how-it-works"
                  className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
                >
                  Learn How It Works
                </a>
              </div>
            </div>

            <div className="mt-14 sm:mt-20" aria-labelledby="goals-heading">
              <h2 id="goals-heading" className="text-xl font-semibold text-slate-900 sm:text-2xl">What are you solving right now?</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" id="how-it-works">
                {GOAL_CARDS.map((goal) => (
                  <button
                    key={goal.title}
                    type="button"
                    onClick={() => startConversation(goal.title)}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                    aria-label={`Start ORACLE conversation about ${goal.title}`}
                  >
                    <p className="text-2xl" aria-hidden="true">{goal.icon}</p>
                    <p className="mt-4 text-base font-semibold text-slate-900 sm:text-lg">{goal.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={[
              "transition-all duration-500 ease-out",
              isConversationStarted
                ? "relative translate-y-0 opacity-100"
                : "pointer-events-none absolute inset-0 translate-y-3 opacity-0",
            ].join(" ")}
            aria-hidden={!isConversationStarted}
          >
            {workspaceCreated && uploadConfirmation ? (
              workspaceStep === "workspace" ? (
                <section className="mt-2 space-y-5" aria-label="Business workspace">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                      Welcome, {uploadConfirmation.companyName}
                    </h1>
                    <p className="mt-3 text-base text-slate-600 sm:text-lg">Your Business Workspace has been created.</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Business Profile">
                      <h2 className="text-lg font-semibold text-slate-900">Business Profile</h2>
                      <div className="mt-4 space-y-2 text-sm text-slate-700 sm:text-base">
                        <p><span className="font-semibold text-slate-900">Company Name:</span> {uploadConfirmation.companyName}</p>
                        <p><span className="font-semibold text-slate-900">Document Type:</span> {uploadConfirmation.documentType}</p>
                        <p><span className="font-semibold text-slate-900">Jurisdiction:</span> {uploadConfirmation.jurisdiction}</p>
                      </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Funding Readiness workspace card">
                      <h2 className="text-lg font-semibold text-slate-900">Funding Readiness</h2>
                      <p className="mt-3 text-sm text-slate-600 sm:text-base">
                        Funding Goal: <span className="font-semibold text-slate-900">{fundingGoal ?? "Not selected"}</span>
                      </p>
                      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                        <div className="h-full w-1/2 rounded-full bg-cyan-600" />
                      </div>
                      <p className="mt-2 text-sm font-medium text-slate-600">Current Progress: 50%</p>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Documents">
                      <h2 className="text-lg font-semibold text-slate-900">Documents</h2>
                      <p className="mt-3 text-sm text-slate-600 sm:text-base">Workspace document center is ready for your next uploads.</p>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Relationship Timeline">
                      <h2 className="text-lg font-semibold text-slate-900">Relationship Timeline</h2>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Today</p>
                      <ul className="mt-2 space-y-2 text-sm text-slate-700 sm:text-base">
                        <li>Business profile created</li>
                        <li>Funding goal recorded</li>
                      </ul>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2 xl:col-span-2" aria-label="AI Advisor">
                      <h2 className="text-lg font-semibold text-slate-900">AI Advisor</h2>
                      <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                        I&apos;ve understood your business. Uploading one recent invoice will allow me to prepare a much more accurate funding assessment.
                      </p>
                    </article>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <button
                      type="button"
                      onClick={onContinueToRelationship}
                      className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                    >
                      Continue
                    </button>
                  </div>
                </section>
              ) : (
                <section className="mt-2 space-y-5" aria-label="Relationship begins">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                    <p className="text-sm font-medium tracking-wide text-cyan-700">🎉 Congratulations!</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Your Business Workspace is ready.</h1>
                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
                      ORACLE has completed your initial business understanding. A Deepsea Relationship Manager can now review your requirements and guide you through the next steps.
                    </p>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Assessment Summary">
                      <h2 className="text-lg font-semibold text-slate-900">Assessment Summary</h2>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:text-base">
                          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Business Profile</span>
                          <span className="mt-1 block font-semibold text-slate-900">Complete</span>
                        </p>
                        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:text-base">
                          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Business Intelligence Score</span>
                          <span className="mt-1 block font-semibold text-slate-900">82%</span>
                        </p>
                        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:text-base">
                          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Funding Goal</span>
                          <span className="mt-1 block font-semibold text-slate-900">{fundingGoal ?? "Not selected"}</span>
                        </p>
                        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:text-base">
                          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated Response</span>
                          <span className="mt-1 block font-semibold text-slate-900">Within 24 Hours</span>
                        </p>
                      </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Timeline">
                      <h2 className="text-lg font-semibold text-slate-900">Timeline</h2>
                      <ol className="mt-4 space-y-3 text-sm text-slate-700 sm:text-base">
                        <li className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-medium text-emerald-900">✓ Business Profile Created</li>
                        <li className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-medium text-emerald-900">✓ Funding Requirement Recorded</li>
                        <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700">→ Relationship Manager Review</li>
                        <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700">→ Funding Discussion</li>
                        <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-700">→ Indicative Offer</li>
                      </ol>
                    </article>
                  </div>

                  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Quick Actions">
                    <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <button
                        type="button"
                        onClick={() => onWorkspaceAction("This capability will be enabled in the next release.")}
                        className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                      >
                        <p className="text-2xl" aria-hidden="true">📅</p>
                        <p className="mt-3 text-sm font-semibold text-slate-900 sm:text-base">Schedule a Meeting</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => onWorkspaceAction("This capability will be enabled in the next release.")}
                        className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                      >
                        <p className="text-2xl" aria-hidden="true">📤</p>
                        <p className="mt-3 text-sm font-semibold text-slate-900 sm:text-base">Email My Assessment</p>
                      </button>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left opacity-60" aria-disabled="true">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-2xl" aria-hidden="true">📄</p>
                            <p className="mt-3 text-sm font-semibold text-slate-700 sm:text-base">Download Business Profile</p>
                          </div>
                          <span className="rounded-full border border-slate-300 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Coming Soon</span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left opacity-60" aria-disabled="true">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-2xl" aria-hidden="true">💬</p>
                            <p className="mt-3 text-sm font-semibold text-slate-700 sm:text-base">Ask ORACLE Another Question</p>
                          </div>
                          <span className="rounded-full border border-slate-300 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Coming Soon</span>
                        </div>
                      </div>
                    </div>

                    {placeholderMessage && (
                      <p className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-900 sm:text-base" role="status">
                        {placeholderMessage}
                      </p>
                    )}
                  </article>
                </section>
              )
            ) : (
              <>
                <div className="max-w-3xl">
                  <p className="text-sm font-medium tracking-wide text-cyan-700">ORACLE</p>
                  <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                    Hello. I&apos;m ORACLE.
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                    I&apos;ll understand your business before recommending anything.
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                    How would you like to tell me about your business?
                  </p>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {ORACLE_INTERACTIONS.map((interaction) => (
                    <button
                      key={interaction.title}
                      type="button"
                      onClick={() => onInteractionSelect(interaction.title)}
                      disabled={isUploading && interaction.title === "Upload a Document"}
                      className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 sm:p-7"
                      aria-label={`${interaction.title} input option`}
                    >
                      <p className="text-3xl" aria-hidden="true">{interaction.icon}</p>
                      <p className="mt-4 text-lg font-semibold text-slate-900 sm:text-xl">{interaction.title}</p>
                    </button>
                  ))}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                  onChange={onFileInputChange}
                />

                <p
                  className="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-900 sm:text-base"
                  role="status"
                >
                  {isUploading ? "Uploading and processing your document..." : placeholderMessage || "Select any option to continue."}
                </p>

                {uploadError && (
                  <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900 sm:text-base" role="alert">
                    {uploadError}
                  </p>
                )}
              </>
            )}

            {uploadConfirmation && conversationStep === "confirmation" && (
              <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7" aria-label="Business confirmation">
                <h2 className="text-xl font-semibold text-slate-900">✓ I think I understand your business.</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:text-base">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Company Name</span>
                    <span className="mt-1 block font-semibold text-slate-900">{uploadConfirmation.companyName}</span>
                  </p>
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:text-base">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Document Type</span>
                    <span className="mt-1 block font-semibold text-slate-900">{uploadConfirmation.documentType}</span>
                  </p>
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:text-base">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Jurisdiction</span>
                    <span className="mt-1 block font-semibold text-slate-900">{uploadConfirmation.jurisdiction}</span>
                  </p>
                  <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:text-base">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Confidence</span>
                    <span className="mt-1 block font-semibold text-slate-900">{uploadConfirmation.confidence}%</span>
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onConfirmBusinessUnderstanding}
                    className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                  >
                    Yes, Continue
                  </button>
                  <button
                    type="button"
                    onClick={onEditInformation}
                    className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                  >
                    Edit Information
                  </button>
                </div>
              </article>
            )}

            {uploadConfirmation && conversationStep === "funding" && (
              <div className="mt-6 space-y-5">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7" aria-label="Funding goal selection">
                  <h2 className="text-2xl font-semibold text-slate-900">How much funding are you looking for?</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {FUNDING_OPTIONS.map((option) => {
                      const isSelected = fundingGoal === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => onSelectFundingGoal(option)}
                          aria-pressed={isSelected}
                          className={[
                            "rounded-2xl border px-5 py-4 text-left text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2",
                            isSelected
                              ? "border-cyan-500 bg-cyan-50 text-cyan-900"
                              : "border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-slate-300",
                          ].join(" ")}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7" aria-label="Funding readiness">
                  <h2 className="text-xl font-semibold text-slate-900">Funding Readiness</h2>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                    <div className="h-full w-1/2 rounded-full bg-cyan-600" />
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-600">Progress: 50%</p>

                  <div className="mt-5 space-y-3">
                    <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 sm:text-base">
                      ✓ Business Understood
                    </p>
                    <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 sm:text-base">
                      ⬜ One Recent Invoice
                    </p>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                    Uploading one recent invoice will significantly improve your funding assessment.
                  </p>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={onCreateWorkspace}
                      className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2"
                    >
                      Upload Invoice
                    </button>
                  </div>
                </article>
              </div>
            )}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:mt-20 sm:p-8" id="insights" aria-labelledby="trust-heading">
          <h2 id="trust-heading" className="text-xl font-semibold text-slate-900 sm:text-2xl">Built for trust from the first conversation.</h2>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">
            {TRUST_HIGHLIGHTS.map((item) => (
              <p key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 sm:text-base">
                <span className="mr-2 text-emerald-600">✓</span>
                {item}
              </p>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white" id="meeting">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>Deepsea Nexus</p>
          <p>Institutional finance, designed with clarity and discipline.</p>
        </div>
      </footer>
    </div>
  );
}