"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Handshake,
  Landmark,
  Lock,
  Smartphone,
  TrendingDown,
  FileCheck,
  Zap,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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

export default function WhyLendKakiPage() {
  const reasonsRef = useRef<HTMLDivElement>(null);
  const reasonsInView = useInView(reasonsRef, { once: true, margin: "-80px" });

  const processRef = useRef<HTMLDivElement>(null);
  const processInView = useInView(processRef, { once: true, margin: "-80px" });

  const edgeRef = useRef<HTMLDivElement>(null);
  const edgeInView = useInView(edgeRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* HERO — Team photo with overlaid text */}
      <section className="relative w-full overflow-hidden">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image
            src="/images/lendkaki team.webp"
            alt="The LendKaki team"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
            <div className="mx-auto max-w-6xl">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl"
              >
                Apply Once.{" "}
                <span className="text-[#7bb8e8]">Save Thousands.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
              >
                Most people spend days contacting banks one by one. LendKaki
                lets you skip the queue — apply once, and let 20+ licensed
                lenders compete for your business.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6"
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
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUE PROPOSITION — Asymmetric layout */}
      <section ref={reasonsRef} className="dot-grid bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={reasonsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Singaporeans Pick LendKaki
            </h2>
            <p className="mt-3 max-w-lg text-base text-muted-foreground sm:text-lg">
              Taking out a loan doesn&apos;t have to be complicated or
              time-consuming.
            </p>
          </motion.div>

          {/* Featured first reason */}
          {(() => {
            const FeaturedIcon = coreReasons[0].icon;
            return (
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={reasonsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12 rounded-xl border-l-4 border-primary bg-primary/8 p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FeaturedIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                    {coreReasons[0].title}
                  </h3>
                </div>
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {coreReasons[0].description}
                </p>
              </motion.div>
            );
          })()}

          {/* Remaining 3 reasons — lighter treatment */}
          <div className="grid gap-10 sm:grid-cols-3">
            {coreReasons.slice(1).map((reason, i) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                animate={reasonsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
              >
                <div className="mb-3 h-1 w-8 rounded-full bg-primary" />
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

      {/* HOW IT WORKS — Timeline (dark section) */}
      <section ref={processRef} className="bg-slate-900 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From Application to Approval in 3 Steps
            </h2>
            <p className="mt-3 max-w-lg text-base text-slate-400 sm:text-lg">
              No paperwork upfront, no branch visits needed.
            </p>
          </motion.div>

          {/* Desktop timeline */}
          <div className="hidden sm:block">
            <div className="relative">
              <div className="absolute left-0 right-0 top-5 h-px bg-slate-700" />
              <motion.div
                initial={{ scaleX: 0 }}
                animate={processInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 right-0 top-5 h-px origin-left bg-primary"
              />

              <div className="relative grid grid-cols-3 gap-8">
                {howItWorks.map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 16 }}
                    animate={processInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.2 }}
                  >
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="sm:hidden">
            <div className="relative pl-10">
              <div className="absolute left-[15px] top-0 bottom-0 w-px bg-slate-700" />
              <motion.div
                initial={{ scaleY: 0 }}
                animate={processInView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-[15px] top-0 bottom-0 w-px origin-top bg-primary"
              />

              <div className="space-y-10">
                {howItWorks.map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -16 }}
                    animate={processInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.2 }}
                    className="relative"
                  >
                    <div className="absolute -left-10 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT SETS US APART — Alternating zigzag on blue gradient */}
      <section ref={edgeRef} className="hero-gradient py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={edgeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Honest Rates. No Gimmicks. Zero Fees.
            </h2>
            <p className="mt-3 max-w-lg text-base text-slate-700 sm:text-lg">
              Here&apos;s why borrowers keep coming back.
            </p>
          </motion.div>

          <div className="space-y-12 sm:space-y-16">
            {edgeCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={edgeInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-12 ${
                  i % 2 !== 0 ? "sm:flex-row-reverse sm:text-right" : ""
                }`}
              >
                <div className={`flex items-center gap-3 sm:w-2/5 sm:shrink-0 ${
                  i % 2 !== 0 ? "sm:justify-end" : ""
                }`}>
                  <card.icon className="h-5 w-5 shrink-0 text-slate-900" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    {card.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-700 sm:w-3/5">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PURPOSE */}
      <section className="dot-grid bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="max-w-prose"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
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
      <section className="bg-primary py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to See What You Qualify For?
          </h2>
          <p className="mt-3 text-base text-white/80 sm:text-lg">
            It takes under a minute, costs nothing, and could save you
            thousands in interest.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-12 gap-2 bg-white px-8 text-sm font-semibold text-primary shadow-lg hover:bg-white/90 sm:text-base"
          >
            <Link href="/personal-loans#apply">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
