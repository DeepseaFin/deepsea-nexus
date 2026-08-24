import Button from "@/components/Button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#07111F]/80 backdrop-blur-xl border-b border-cyan-900/40 shadow-lg shadow-cyan-950/20">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold text-cyan-300">
            Deepsea Nexus
          </h1>

          <p className="text-xs text-slate-400">
            Structured Receivables & Trade Finance
          </p>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8">

          <a
            href="#home"
            className="text-slate-300 hover:text-cyan-400 transition-all duration-300"
          >
            Home
          </a>

          <a
            href="/about"
            className="text-slate-300 hover:text-cyan-400 transition-all duration-300"
          >
            About
          </a>

          <a
            href="#solutions"
            className="text-slate-300 hover:text-cyan-400 transition-all duration-300"
          >
            Solutions
          </a>

          <a
            href="#industries"
            className="text-slate-300 hover:text-cyan-400 transition-all duration-300"
          >
            Industries
          </a>

          <a
            href="#resources"
            className="text-slate-300 hover:text-cyan-400 transition-all duration-300"
          >
            Resources
          </a>

          <a
            href="#contact"
            className="text-slate-300 hover:text-cyan-400 transition-all duration-300"
          >
            Contact
          </a>

        </nav>

        {/* CTA Button */}
        <Button>
          Apply for Funding
        </Button>

      </div>

    </header>
  );
}