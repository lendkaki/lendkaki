"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardCheck, BarChart3, Banknote } from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Apply Once",
    description:
      "Fill in your details in under 2 minutes. One simple form — no need to apply at every bank separately.",
    step: "01",
  },
  {
    icon: BarChart3,
    title: "Compare Offers",
    description:
      "Receive personalized rates from 50+ licensed lenders. Compare interest rates, tenure, and monthly instalments side by side.",
    step: "02",
  },
  {
    icon: Banknote,
    title: "Get Funded",
    description:
      "Choose the best offer for you. Funds can be disbursed as fast as the same day, directly to your account.",
    step: "03",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get matched with the best loan offers in three simple steps.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.15 }}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Step number */}
              <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 font-mono text-xs font-bold text-primary-foreground">
                {step.step}
              </span>

              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
              >
                <step.icon className="h-6 w-6" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
