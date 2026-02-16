"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, ShieldCheck, Zap, BadgeDollarSign } from "lucide-react";

const advantages = [
  {
    icon: Building2,
    title: "50+ Licensed Lenders",
    description:
      "Access Singapore's widest network of MAS-regulated banks and MinLaw-licensed lenders in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Credit Score Impact",
    description:
      "Your credit score stays untouched. We use soft checks only to match you with the best rates.",
  },
  {
    icon: Zap,
    title: "Same-Day Approval",
    description:
      "75% of our applicants get approved within 24 hours. Some lenders disburse funds the same day.",
  },
  {
    icon: BadgeDollarSign,
    title: "100% Free, No Hidden Fees",
    description:
      "Our service is completely free for borrowers. We never charge you a single cent.",
  },
];

export function Advantages() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The LendKaki Advantage
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Why thousands of Singaporeans choose us to find their best loan
            rates.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {advantages.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:p-10"
            >
              {/* Decorative gradient on hover */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Icon */}
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="h-7 w-7" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
