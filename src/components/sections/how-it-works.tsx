"use client";

import { Feature } from "@/components/ui/feature";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-background scroll-mt-20">
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
        imageUrl="/lendkaki how it works.webp"
        imageAlt="LendKaki — how it works"
      />
    </section>
  );
}
