import { Hero } from "@/components/sections/hero";
import { TrustIndicators } from "@/components/sections/trust-indicators";
import { HowItWorks } from "@/components/sections/how-it-works";
import { LeadForm } from "@/components/forms/lead-form";
import { LoanMarketplace } from "@/components/sections/loan-marketplace";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustIndicators />
      <HowItWorks />
      <LeadForm />
      <LoanMarketplace />
    </>
  );
}
