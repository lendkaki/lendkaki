"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  Star,
  Zap,
  Handshake,
  Landmark,
  Lock,
  Smartphone,
  TrendingDown,
  FileCheck,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const coreReasons = [
  {
    icon: TrendingDown,
    title: "One Form, Multiple Rates",
    description:
      "Stop visiting every bank's website individually. Submit a single 60-second application on LendKaki and let our network of 20+ licensed lenders come back to you with their most competitive rates, saving you hours of legwork.",
  },
  {
    icon: Landmark,
    title: "Only MAS & MinLaw-Regulated Partners",
    description:
      "Every lender on LendKaki is licensed and regulated under Singapore law. We never work with unlicensed money lenders. You can verify each institution's licence on the MAS or MinLaw registries.",
  },
  {
    icon: Smartphone,
    title: "Updates Straight to Your WhatsApp",
    description:
      "No email threads to dig through. Once we match you with a lender, all next steps and instructions are sent directly to your WhatsApp so nothing slips through the cracks.",
  },
  {
    icon: Handshake,
    title: "A Real Team Behind the Platform",
    description:
      "LendKaki isn't a faceless directory. Our Singapore-based advisors are available during business hours to answer questions, clarify terms, and walk you through your options if you need a hand.",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Tell Us What You Need",
    description:
      "Share your loan amount, purpose, and a few personal details. The entire form takes under a minute. No documents required at this stage.",
  },
  {
    step: "2",
    title: "We Find Your Best Match",
    description:
      "Your profile is securely reviewed by our panel of licensed banks and financial institutions. Within minutes, we identify the lender whose criteria and rates best fit your situation.",
  },
  {
    step: "3",
    title: "Get Funded, Often the Same Day",
    description:
      "Accept the offer that suits you, complete the lender's verification, and receive your funds. Many applicants see the money in their account within 24 hours.",
  },
];

const edgeCards = [
  {
    icon: FileCheck,
    title: "No Teaser Rates, No Bait-and-Switch",
    description:
      "What you see is what you get. Every rate quoted to you is based on your actual profile, not an eye-catching headline number that only the top 1% of applicants qualify for.",
  },
  {
    icon: Lock,
    title: "Bank-Grade Data Protection",
    description:
      "Your information is encrypted end-to-end with 256-bit SSL and stored in compliance with Singapore's PDPA. We never sell or share your data with anyone you haven't approved.",
  },
  {
    icon: Zap,
    title: "Built for Urgency",
    description:
      "Need a bridging loan before your property closes? Emergency cash for your business? Our matching engine prioritises speed so you're not left waiting when time is critical.",
  },
  {
    icon: ThumbsUp,
    title: "Always Free for Borrowers",
    description:
      "LendKaki earns a referral fee from lenders, never from you. There are zero charges, zero hidden costs, and zero obligations. Walk away at any point if none of the offers suit you.",
  },
];

const numbers = [
  { value: "20+", label: "Regulated Lenders" },
  { value: "<60s", label: "To Complete the Form" },
  { value: "$0", label: "Cost to You" },
  { value: "Same Day", label: "Possible Disbursement" },
];

export default function WhyLendKakiPage() {
  const reasonsRef = useRef<HTMLDivElement>(null);
  const reasonsInView = useInView(reasonsRef, { once: true, margin: "-50px" });

  const processRef = useRef<HTMLDivElement>(null);
  const processInView = useInView(processRef, { once: true, margin: "-50px" });

  const edgeRef = useRef<HTMLDivElement>(null);
  const edgeInView = useInView(edgeRef, { once: true, margin: "-50px" });

  const numbersRef = useRef<HTMLDivElement>(null);
  const numbersInView = useInView(numbersRef, { once: true, margin: "-50px" });

  const purposeRef = useRef<HTMLDivElement>(null);
  const purposeInView = useInView(purposeRef, { once: true, margin: "-50px" });

  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-50px" });

  return (
    <>
      {/* HERO */}
      <section className="hero-gradient relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary"
          >
            Why LendKaki?
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Apply Once.{" "}
            <span className="text-primary">Save Thousands.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-700 sm:text-xl"
          >
            Most people spend days contacting banks one by one. LendKaki lets
            you skip the queue. Apply once, and let 20+ licensed lenders
            compete to give you the lowest rate.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
          >
            <Button
              asChild
              size="lg"
              className="h-12 gap-2 bg-primary px-8 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 sm:text-base"
            >
              <Link href="/personal-loans#apply">
                Get My Free Rates
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-sm font-semibold sm:text-base"
            >
              <Link href="/loan-calculator">Estimate My Repayments</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* NUMBERS */}
      <section
        ref={numbersRef}
        className="border-y border-border/50 bg-white py-10 sm:py-12"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {numbers.map((n, i) => (
              <motion.div
                key={n.label}
                initial={{ opacity: 0, y: 15 }}
                animate={numbersInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-primary sm:text-4xl">
                  {n.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{n.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE REASONS */}
      <section ref={reasonsRef} className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={reasonsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center sm:mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Four Reasons Singaporeans Pick LendKaki
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Taking out a loan doesn&apos;t have to be complicated or time-consuming.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2">
            {coreReasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={
                  reasonsInView ? { opacity: 1, scale: 1, y: 0 } : {}
                }
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className="group rounded-2xl border border-border bg-white p-7 shadow-sm transition-shadow hover:shadow-md sm:p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <reason.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        ref={processRef}
        className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 sm:py-24"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center sm:mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              From Application to Approval in 3 Steps
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              No paperwork upfront, no branch visits needed.
            </p>
          </motion.div>

          <div className="space-y-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={processInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.15 }}
                className="flex gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm sm:gap-6 sm:p-8"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR EDGE */}
      <section ref={edgeRef} className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={edgeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center sm:mb-16"
          >
            <span className="inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              What Sets Us Apart
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Honest Rates. No Gimmicks. Zero Fees.
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Here&apos;s why borrowers keep coming back to LendKaki.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2">
            {edgeCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={edgeInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className="flex gap-4 rounded-2xl border border-border bg-slate-50/50 p-6 sm:p-7"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-slate-900 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mb-6 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-6 w-6 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Real Stories from Real Borrowers
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-400">
            Thousands of Singaporeans have used LendKaki to secure better
            rates. Here are a few of their experiences.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                text: "I'd been putting off refinancing my personal loan for months because I didn't want to visit every bank. One form on LendKaki and I had three quotes by lunchtime.",
                name: "Tan Wei Ming",
              },
              {
                text: "My SME needed a short-term bridging facility fast. LendKaki connected me with a licensed lender the same afternoon and funds arrived the next morning.",
                name: "Ahmad Rizal",
              },
              {
                text: "Was sceptical at first, but the whole thing was genuinely free. I ended up saving roughly $1,800 in interest versus my previous bank's rate.",
                name: "Priya Nair",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5 text-left"
              >
                <p className="text-sm leading-relaxed text-slate-300">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-white">
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PURPOSE */}
      <section ref={purposeRef} className="bg-background py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={purposeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Our Purpose
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Levelling the Playing Field for Borrowers
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Singapore has dozens of licensed lenders, yet most people only
              approach the one or two banks they already know. That means
              they&apos;re likely over-paying on interest without realising it.
              LendKaki exists to close that gap by giving every borrower
              visibility across the full market so you can make a genuinely
              informed decision.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              We partner exclusively with financial institutions regulated by
              the Monetary Authority of Singapore (MAS) or the Ministry of Law
              (MinLaw). Our matching service is entirely free for borrowers, and
              it always will be.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              {[
                "MAS & MinLaw Regulated Partners",
                "Full PDPA Compliance",
                "256-bit SSL Encrypted",
              ].map((badge) => (
                <div key={badge} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section ref={ctaRef} className="hero-gradient py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl px-4 text-center sm:px-6"
        >
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Ready to See What You Qualify For?
          </h2>
          <p className="mt-3 text-base text-slate-900/70 sm:text-lg">
            It takes under a minute, costs nothing, and could save you
            thousands in interest.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-12 gap-2 bg-primary px-8 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 sm:text-base"
          >
            <Link href="/personal-loans#apply">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </>
  );
}
