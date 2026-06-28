import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Solutions from "@/components/Solutions";
import Industries from "@/components/Industries";
import WhyNexus from "@/components/WhyNexus";
import FundingProcess from "@/components/FundingProcess";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Solutions />
      <Industries />
      <WhyNexus />
      <FundingProcess />
    </>
  );
}