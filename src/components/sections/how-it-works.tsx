"use client";

import { Feature } from "@/components/ui/feature";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-background scroll-mt-14">
      <Feature
        badge="How It Works"
        title="Get matched with the best loan offers"
        subtitle="Apply once and receive personalised rates from 20+ licensed lenders in three simple steps."
        features={[
          {
            title: "Apply Once",
            description:
              "Fill in your details in under 2 minutes. One simple form — no need to apply at every bank separately.",
          },
          {
            title: "Compare Offers",
            description:
              "Receive personalised rates from 20+ licensed lenders. Compare interest rates, tenure, and monthly instalments side by side.",
          },
          {
            title: "Get Funded",
            description:
              "Choose the best offer for you. Funds can be disbursed as fast as the same day, directly to your account.",
          },
        ]}
        imageUrl="/images/lendkaki how it works.webp"
        imageAlt="LendKaki — how it works"
      />
    </section>
  );
}
