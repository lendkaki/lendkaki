import { Hero } from "@/components/sections/hero";
import { PartnersScroller } from "@/components/sections/partners";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Advantages } from "@/components/sections/advantages";
import { Testimonials } from "@/components/sections/testimonials";
import { LeadForm } from "@/components/forms/lead-form";
import { Faq } from "@/components/sections/faq";

export default function Home() {
  return (
    <>
      <Hero />
      <PartnersScroller />
      <HowItWorks />
      <Advantages />
      <Testimonials />
      <LeadForm />
      <Faq />
    </>
  );
}
