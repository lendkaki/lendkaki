"use client";

import { Feature } from "@/components/ui/feature";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-slate-900">
      <Feature
        badge="How It Works"
        title="Get matched with the best loan offers"
        subtitle="Apply once and receive personalized rates from 50+ licensed lenders in three simple steps."
        features={[
          {
            title: "Apply Once",
            description:
              "Fill in your details in under 2 minutes. One simple form — no need to apply at every bank separately.",
          },
          {
            title: "Compare Offers",
            description:
              "Receive personalized rates from 50+ licensed lenders. Compare interest rates, tenure, and monthly instalments side by side.",
          },
          {
            title: "Get Funded",
            description:
              "Choose the best offer for you. Funds can be disbursed as fast as the same day, directly to your account.",
          },
        ]}
        imageUrl="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Financial planning and loan comparison"
      />
    </section>
  );
}
