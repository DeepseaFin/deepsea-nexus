export default function DeepseaNexusPlatform() {
  return (
    <div className="min-h-screen bg-[#07111F] text-white font-sans">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07111F]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-cyan-300">
              Deepsea Nexus FZCO
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Structured Trade Finance Solutions
            </p>
          </div>

          <nav className="hidden md:flex gap-8 text-sm text-slate-300">
            <a href="#services" className="hover:text-cyan-300 transition">Services</a>
            <a href="#industries" className="hover:text-cyan-300 transition">Industries</a>
            <a href="#governance" className="hover:text-cyan-300 transition">Governance</a>
            <a href="#onboarding" className="hover:text-cyan-300 transition">Onboarding</a>
            <a href="#contact" className="hover:text-cyan-300 transition">Contact</a>
          </nav>

          <button className="bg-cyan-400 text-black font-semibold px-5 py-3 rounded-2xl hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/20">
            Apply for Funding
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#07111F] via-[#0b2038] to-[#12385f] border-b border-white/10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#4da6ff,transparent_35%)]"></div>

        <div className="max-w-7xl mx-auto px-6 py-32 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm text-cyan-200 mb-8">
              Dubai Based • Institutional Receivables Platform • UAE Trade Finance
            </div>

            <h2 className="text-6xl md:text-7xl font-bold leading-tight tracking-tight">
              Institutional Trade Finance.
              <span className="text-cyan-300 block">Engineered for Scale.</span>
            </h2>

            <p className="mt-8 text-xl text-slate-300 leading-relaxed max-w-3xl">
              Deepsea Nexus FZCO delivers structured forfaiting, receivables financing,
              and commercial investment solutions for fintechs, trade businesses,
              logistics operators, and institutional counterparties across the UAE.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="bg-cyan-400 text-black font-semibold px-8 py-4 rounded-2xl hover:bg-cyan-300 transition-all shadow-2xl shadow-cyan-500/20">
                Start Qualification
              </button>

              <button className="border border-white/20 px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
                Request Corporate Profile
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              <div>
                <div className="text-4xl font-bold text-cyan-300">AED 100K+</div>
                <div className="text-slate-400 mt-2">Minimum Ticket Size</div>
              </div>

              <div>
                <div className="text-4xl font-bold text-cyan-300">UAE</div>
                <div className="text-slate-400 mt-2">Primary Market</div>
              </div>

              <div>
                <div className="text-4xl font-bold text-cyan-300">B2B</div>
                <div className="text-slate-400 mt-2">Corporate Focus</div>
              </div>

              <div>
                <div className="text-4xl font-bold text-cyan-300">24/7</div>
                <div className="text-slate-400 mt-2">Risk Oversight</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="py-24 bg-[#08131f] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl border border-white/10 p-10 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-40 h-40 rounded-full border-4 border-cyan-300 mx-auto bg-white/5"></div>
              <div className="mt-6 text-2xl font-bold">Deepak Singh</div>
              <div className="text-cyan-300 mt-2">Founder & Strategic Advisor</div>
            </div>
          </div>

          <div>
            <div className="text-cyan-300 uppercase tracking-[0.3em] text-sm font-semibold mb-4">
              Founder-Led Platform
            </div>

            <h3 className="text-5xl font-bold leading-tight">
              Built around transparency, payment control, and scalable trade finance infrastructure.
            </h3>

            <p className="mt-8 text-lg text-slate-300 leading-relaxed">
              Deepsea Nexus was established to create a modern institutional framework for receivables financing and forfaiting transactions supported by structured collection mechanisms, enhanced transaction visibility, and disciplined risk governance.
            </p>

            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              The platform is designed to support fintech ecosystems, trade businesses, logistics operators, and commercial counterparties seeking scalable working capital solutions.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-gradient-to-b from-[#0a1726] to-[#0e2238] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-cyan-300 uppercase tracking-[0.3em] text-sm font-semibold mb-4">
              Core Services
            </div>

            <h3 className="text-5xl font-bold">
              Institutional Financial Infrastructure
            </h3>

            <p className="mt-6 text-slate-300 text-lg leading-relaxed">
              Structured receivables financing and commercial investment solutions engineered for modern B2B ecosystems.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-cyan-400/40 transition-all hover:-translate-y-2">
              <div className="text-cyan-300 text-5xl font-bold mb-6">01</div>
              <h4 className="text-2xl font-bold mb-5">Forfaiting Services</h4>
              <p className="text-slate-300 leading-relaxed">
                Purchase and acquisition of receivables, bills of exchange, promissory notes, letters of credit, and trade obligations on discounted settlement terms.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-cyan-400/40 transition-all hover:-translate-y-2">
              <div className="text-cyan-300 text-5xl font-bold mb-6">02</div>
              <h4 className="text-2xl font-bold mb-5">Structured Receivables Financing</h4>
              <p className="text-slate-300 leading-relaxed">
                Invoice discounting and receivables financing frameworks supported by controlled payment routing and institutional monitoring systems.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-cyan-400/40 transition-all hover:-translate-y-2">
              <div className="text-cyan-300 text-5xl font-bold mb-6">03</div>
              <h4 className="text-2xl font-bold mb-5">Commercial Investment Management</h4>
              <p className="text-slate-300 leading-relaxed">
                Strategic investment management across commercial enterprises, transport, contracting, and finance-related businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="industries" className="py-24 bg-[#08131f] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="text-cyan-300 uppercase tracking-[0.3em] text-sm font-semibold mb-4">
              Industries We Serve
            </div>

            <h3 className="text-5xl font-bold">Multi-Industry Financing Ecosystem</h3>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16">
            {[
              'Fintech',
              'Logistics',
              'Shipping',
              'Telecom',
              'Distribution',
              'Insurance',
              'Contracting',
              'Trade Companies'
            ].map((industry) => (
              <div key={industry} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-cyan-400/30 transition-all">
                <div className="text-xl font-semibold text-cyan-300">{industry}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GOVERNANCE */}
      <section id="governance" className="py-24 bg-gradient-to-b from-[#08131f] to-[#0b2038] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-cyan-300 uppercase tracking-[0.3em] text-sm font-semibold mb-4">
              Risk & Governance
            </div>

            <h3 className="text-5xl font-bold leading-tight">
              Institutional-grade controls built into every transaction.
            </h3>
          </div>

          <div className="space-y-6">
            {[
              'Dedicated Collection Account Structures',
              'Virtual IBAN Payment Routing',
              'Assignment-Based Receivables Control',
              'Real-Time Cash Flow Visibility',
              'Enhanced Compliance & KYC Monitoring',
              'Structured Reporting & Reconciliation'
            ].map((item) => (
              <div key={item} className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-cyan-400/30 transition-all">
                <div className="text-lg font-semibold text-cyan-300">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ONBOARDING */}
      <section id="onboarding" className="py-24 bg-[#08131f] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-cyan-300 uppercase tracking-[0.3em] text-sm font-semibold mb-4">
              Client Onboarding Portal
            </div>

            <h3 className="text-5xl font-bold">
              Institutional Funding Qualification
            </h3>

            <p className="mt-6 text-slate-300 text-lg leading-relaxed">
              Complete the initial qualification process for receivables financing and forfaiting assessment.
            </p>
          </div>

          <div className="mt-16 bg-white/5 border border-white/10 rounded-3xl p-10 space-y-8">
            <div>
              <label className="block text-sm text-slate-400 mb-3">Legal Company Name</label>
              <input className="w-full bg-[#0c1c2c] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400" placeholder="Enter company name" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-3">Country of Incorporation</label>
                <input className="w-full bg-[#0c1c2c] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400" placeholder="UAE" />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-3">Annual Turnover</label>
                <input className="w-full bg-[#0c1c2c] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400" placeholder="AED" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-3">Nature of Receivables</label>
              <textarea rows="4" className="w-full bg-[#0c1c2c] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400" placeholder="Describe receivables structure"></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-3">Monthly Receivables Volume</label>
                <input className="w-full bg-[#0c1c2c] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400" placeholder="AED" />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-3">Average Payment Tenor</label>
                <input className="w-full bg-[#0c1c2c] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400" placeholder="30 days" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-3">Which Banks Are Involved?</label>
              <input className="w-full bg-[#0c1c2c] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400" placeholder="Mashreq, RAKBANK etc." />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-3">Upload Supporting Documents</label>
              <div className="border-2 border-dashed border-white/20 rounded-3xl p-10 text-center text-slate-400 hover:border-cyan-400/40 transition-all">
                Drag & Drop Files or Click to Upload
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <input type="checkbox" className="w-5 h-5" />
              <span>I confirm the information provided is accurate and consent to KYC/AML verification.</span>
            </div>

            <button className="w-full bg-cyan-400 text-black font-semibold py-5 rounded-2xl hover:bg-cyan-300 transition-all shadow-2xl shadow-cyan-500/20 text-lg">
              Submit Qualification Request
            </button>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="py-24 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="text-cyan-300 uppercase tracking-[0.3em] text-sm font-semibold mb-4">
            Funding Calculator
          </div>

          <h3 className="text-5xl font-bold">
            Estimate Your Funding Structure
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mt-14 text-left">
            <div>
              <label className="block text-sm text-slate-400 mb-3">Invoice Amount</label>
              <input className="w-full bg-[#0c1c2c] border border-white/10 rounded-2xl px-5 py-4" placeholder="AED 1,000,000" />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-3">Funding Days</label>
              <input className="w-full bg-[#0c1c2c] border border-white/10 rounded-2xl px-5 py-4" placeholder="30" />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-3">Advance Rate</label>
              <input className="w-full bg-[#0c1c2c] border border-white/10 rounded-2xl px-5 py-4" placeholder="85%" />
            </div>
          </div>

          <button className="mt-10 bg-cyan-400 text-black font-semibold px-10 py-4 rounded-2xl hover:bg-cyan-300 transition-all">
            Calculate
          </button>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 bg-[#050b12]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-5xl font-bold">
            Build Your Financing Partnership With Deepsea Nexus.
          </h3>

          <p className="mt-8 text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We work with institutional counterparties, fintechs, and commercial enterprises seeking scalable receivables financing and forfaiting solutions.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <button className="bg-cyan-400 text-black font-semibold px-8 py-4 rounded-2xl hover:bg-cyan-300 transition-all">
              Schedule Discussion
            </button>

            <button className="border border-white/20 px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
              Email Deepsea Nexus
            </button>
          </div>

          <div className="mt-16 text-slate-400">
            <div className="text-2xl font-bold text-cyan-300">Deepsea Nexus FZCO</div>
            <div className="mt-4">Dubai • United Arab Emirates</div>
            <div className="mt-2">info@deepseanexus.com</div>
          </div>
        </div>
      </section>
    </div>
  );
}