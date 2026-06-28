import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#07111F] text-white flex items-center">
        <div className="max-w-4xl mx-auto px-8 text-center">

          <h1 className="text-6xl font-bold text-cyan-300 mb-6">
            About Deepsea Nexus
          </h1>

          <p className="text-xl text-slate-300 leading-relaxed">
            Deepsea Nexus FZCO is a UAE-based structured receivables and trade
            finance platform focused on unlocking liquidity through disciplined
            risk management, transparent transaction structures and strong
            governance standards.
          </p>

        </div>
      </main>

    </>
  );
}