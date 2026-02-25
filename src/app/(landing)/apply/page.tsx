"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Shield,
  Clock,
  Users,
  BadgeCheck,
  Star,
  ChevronDown,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loanPurposeOptions } from "@/lib/loan-data";
import { quickLeadSchema, type QuickLeadValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { PolicyModal } from "@/components/ui/policy-modal";
import { TermsContent } from "@/components/content/terms-content";
import { PrivacyContent } from "@/components/content/privacy-content";

/* ------------------------------------------------------------------ */
/*  Headline variants for ad message matching                          */
/* ------------------------------------------------------------------ */

const headlineVariants: Record<
  string,
  { before: string; highlight?: string; after?: string; subheadline: string }
> = {
  default: {
    before: "Compare Singapore's Best Loan Rates in",
    highlight: "60 Seconds",
    subheadline:
      "One application, 20+ licensed lenders and banks. Personalised offers.",
  },
  fast: {
    before: "Get Approved for a Loan in Under",
    highlight: "24 Hours",
    subheadline:
      "Skip the bank queues. Apply once, get matched with 20+ lenders instantly.",
  },
  free: {
    before: "Free Loan Comparison — Zero Credit Score Impact",
    subheadline:
      "Compare rates from 20+ licensed lenders without affecting your credit. 100% free.",
  },
  save: {
    before: "Save Thousands on Your Next Loan",
    subheadline:
      "Our borrowers save an average of $2,000 in interest. Find your best rate now.",
  },
};

/* ------------------------------------------------------------------ */
/*  Partner logos                                                       */
/* ------------------------------------------------------------------ */

const partnerLogos = [
  { src: "/logos/dbs.png", alt: "DBS Bank" },
  { src: "/logos/ocbc.png", alt: "OCBC Bank" },
  { src: "/logos/uob.png", alt: "UOB Bank" },
  { src: "/logos/standard-chartered.png", alt: "Standard Chartered" },
  { src: "/logos/hsbc.png", alt: "HSBC" },
  { src: "/logos/citibank.png", alt: "Citibank" },
  { src: "/logos/maybank.png", alt: "Maybank" },
  { src: "/logos/cimb.png", alt: "CIMB Bank" },
];

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */

const testimonials = [
  {
    text: "I was dreading applying to multiple banks. LendKaki matched me with 5 offers in under a minute — I saved over $2,000 in interest compared to my bank's rate.",
    name: "Tan Wei Ming",
    role: "Personal Loan",
    image: "/testimonials/tan wei ming.webp",
  },
  {
    text: "As an SME owner, getting a business loan used to take weeks. Through LendKaki I got approved within 24 hours and funds were in my account the next day.",
    name: "Ahmad Rizal",
    role: "Business Loan",
    image: "/testimonials/ahmad rizal.webp",
  },
  {
    text: "Needed a bridging loan urgently for my property purchase. LendKaki connected me with a lender who disbursed the funds the same day. Lifesaver.",
    name: "Kenneth Teo",
    role: "Bridging Loan",
    image: "/testimonials/kenneth teo.webp",
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ items                                                          */
/* ------------------------------------------------------------------ */

const faqItems = [
  {
    question: "Is LendKaki's service really free?",
    answer:
      "Yes, absolutely! LendKaki is 100% free for borrowers. We earn a commission from lenders when you successfully take up a loan, so there are no hidden fees or charges for using our platform.",
  },
  {
    question: "Will checking rates affect my credit score?",
    answer:
      "No, checking your rates on LendKaki will not affect your credit score. We use a soft credit inquiry that doesn't impact your credit report. Only when you proceed to accept a loan offer and the lender performs a hard credit check will it affect your score.",
  },
  {
    question: "How quickly can I get approved?",
    answer:
      "Most applications are processed within minutes, and you'll typically receive loan offers within 24 hours. Once you accept an offer, funds can be disbursed as quickly as the same day. Some lenders offer instant approval for amounts up to $30,000.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We use bank-level 256-bit SSL encryption to protect your data. Your information is only shared with lenders you choose to proceed with, and we never sell your data to third parties. We comply with Singapore's PDPA.",
  },
];

/* ------------------------------------------------------------------ */
/*  Trust badges                                                       */
/* ------------------------------------------------------------------ */

const trustBadges = [
  { icon: Users, label: "20+ Licensed Lenders", sub: "MAS & MinLaw regulated" },
  { icon: Clock, label: "Same-Day Approval", sub: "Funds within 24 hours" },
  { icon: Shield, label: "Zero Credit Impact", sub: "Soft checks only" },
  { icon: BadgeCheck, label: "100% Free", sub: "No hidden fees ever" },
];

/* ------------------------------------------------------------------ */
/*  Helper: random date within the last 30 days                       */
/* ------------------------------------------------------------------ */

function randomRecentDate(): string {
  const msIn30Days = 30 * 24 * 60 * 60 * 1000;
  const date = new Date(Date.now() - Math.random() * msIn30Days);
  return date.toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Inner page wrapped with Suspense for useSearchParams               */
/* ------------------------------------------------------------------ */

function LandingPageInner() {
  const searchParams = useSearchParams();
  const variant = searchParams.get("v") || "default";
  const { before, highlight, after, subheadline } =
    headlineVariants[variant] || headlineVariants.default;

  /* UTM params */
  const utmSource = searchParams.get("utm_source") || "";
  const utmMedium = searchParams.get("utm_medium") || "";
  const utmCampaign = searchParams.get("utm_campaign") || "";
  const utmContent = searchParams.get("utm_content") || "";
  const utmTerm = searchParams.get("utm_term") || "";

  /* Testimonial dates — generated client-side to avoid hydration mismatch */
  const [testimonialDates, setTestimonialDates] = useState<string[]>([]);
  useEffect(() => {
    setTestimonialDates(testimonials.map(() => randomRecentDate()));
  }, []);

  /* Form state */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSuccess]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm<QuickLeadValues>({
    resolver: zodResolver(quickLeadSchema),
    mode: "onTouched",
  });

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwK6FZhJ7GVvA5Jz9LwKzwc4N9d1eo6jv4J47B5xbVQzaVGn2iIjlSRO_eACRx2YI_h/exec";

  const onSubmit = async (data: QuickLeadValues) => {
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          amount: String(data.amount),
          purpose: loanPurposeOptions.find((o) => o.value === data.purpose)?.label ?? data.purpose,
          nationality: data.nationality === "foreigner" ? "Foreigner" : data.nationality,
        }),
      });
      setIsSuccess(true);
    } catch {
      setError("root", {
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Sticky CTA visibility */
  const [showStickyCta, setShowStickyCta] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!formRef.current || !footerRef.current) return;
      const formRect = formRef.current.getBoundingClientRect();
      const footerRect = footerRef.current.getBoundingClientRect();
      
      // Show CTA when form is scrolled past AND footer is not visible yet
      const formScrolledPast = formRect.bottom < 0;
      const footerVisible = footerRect.top < window.innerHeight;
      
      setShowStickyCta(formScrolledPast && !footerVisible);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Section refs for animations */
  const trustRef = useRef<HTMLDivElement>(null);
  const trustInView = useInView(trustRef, { once: true, margin: "-50px" });
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const testimonialsInView = useInView(testimonialsRef, {
    once: true,
    margin: "-50px",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* ============================================================ */}
      {/*  MINIMAL HEADER                                               */}
      {/* ============================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="Go to home page"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3673ae]">
              <span className="font-[family-name:var(--font-vampiro)] text-sm text-white">LK</span>
            </div>
            <span className="font-[family-name:var(--font-vampiro)] text-xl tracking-tight text-[#3673ae]">
              LendKaki
            </span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/*  HERO + FORM                                                  */}
      {/* ============================================================ */}
      <section className="hero-gradient relative overflow-hidden pt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={formRef}
            className="grid items-start gap-8 pb-12 pt-10 sm:pb-16 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pb-20 lg:pt-16"
          >
            {/* Left: Headline + Value Props */}
            <div className="flex flex-col justify-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
              >
                {before}
                {highlight && (
                  <>
                    {" "}
                    <span className="relative inline-flex items-center gap-1.5 -rotate-2 rounded-lg bg-[#E5FF00] px-3 py-0.5 text-slate-900 sm:gap-2 sm:px-4 sm:py-1">
                      <motion.span
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, -10, 10, -10, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                        className="inline-flex"
                      >
                        <Zap className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 fill-yellow-400 text-yellow-600" />
                      </motion.span>
                      {highlight}
                    </span>
                  </>
                )}
                {after && <> {after}</>}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4 text-base leading-relaxed text-slate-900/70 sm:text-lg lg:text-xl"
              >
                {subheadline}
              </motion.p>

              {/* Value prop bullets */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 space-y-3 sm:mt-8"
              >
                {[
                  "20+ licensed lenders in one place",
                  "100% free — no hidden fees",
                  "No credit score impact",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-900/80 sm:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Social proof snippet - desktop only */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 hidden items-center gap-3 lg:flex"
              >
                <div className="flex -space-x-2">
                  {[
                    { src: "/testimonials/tan wei ming.webp", alt: "Tan Wei Ming" },
                    { src: "/testimonials/priya nair.webp", alt: "Priya Nair" },
                    { src: "/testimonials/ahmad rizal.webp", alt: "Ahmad Rizal" },
                  ].map((avatar) => (
                    <img
                      key={avatar.alt}
                      src={avatar.src}
                      alt={avatar.alt}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-900/60">
                  Trusted by thousands of Singaporeans
                </span>
              </motion.div>
            </div>

            {/* Right: Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="w-full"
            >
              {isSuccess ? (
                <div ref={successRef} className="rounded-2xl border border-border bg-card p-6 text-center shadow-xl sm:p-8">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                    Application Submitted!
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                    We are matching you with our pool of approved lenders.
                  </p>
                  <div className="mt-5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 px-5 py-4">
                    <p className="text-base font-bold text-[#128C7E] sm:text-lg">
                      📲 You will receive a match to a lender via WhatsApp very soon!
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8"
                >
                  <div className="space-y-5">
                    {/* Name */}
                    <div>
                      <Label htmlFor="lp-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Name
                      </Label>
                      <input
                        id="lp-name"
                        placeholder="Enter your name here"
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs font-medium text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <Label htmlFor="lp-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Mobile Number
                      </Label>
                      <input
                        id="lp-phone"
                        placeholder="Enter your mobile number here"
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs font-medium text-red-500">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="lp-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Email Address
                      </Label>
                      <input
                        id="lp-email"
                        type="email"
                        placeholder="Enter your email address here"
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs font-medium text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Desired Loan Amount */}
                    <div>
                      <Label htmlFor="lp-amount" className="mb-1.5 block text-sm font-medium text-slate-700">
                        Desired Loan Amount
                      </Label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                          $
                        </span>
                        <input
                          id="lp-amount"
                          type="number"
                          placeholder="Enter desired loan amount"
                          className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-7 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          {...register("amount", { valueAsNumber: true })}
                        />
                      </div>
                      {errors.amount && (
                        <p className="mt-1 text-xs font-medium text-red-500">{errors.amount.message}</p>
                      )}
                    </div>

                    {/* Purpose of Loan */}
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Purpose of Loan
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("purpose", value as QuickLeadValues["purpose"], {
                            shouldValidate: true,
                          })
                        }
                      >
                        <SelectTrigger className="h-11 w-full rounded-lg border-slate-300 bg-white text-sm text-slate-700 shadow-none focus:border-primary focus:ring-2 focus:ring-primary/20 data-[placeholder]:text-slate-400">
                          <SelectValue placeholder="Select purpose of loan" />
                        </SelectTrigger>
                        <SelectContent>
                          {loanPurposeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.purpose && (
                        <p className="mt-1 text-xs font-medium text-red-500">{errors.purpose.message}</p>
                      )}
                    </div>

                    {/* Nationality — radio buttons */}
                    <div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="Singaporean_PR"
                            className="h-4 w-4 border-slate-300 text-primary accent-primary"
                            {...register("nationality")}
                          />
                          <span className="text-sm text-slate-600">Singapore/PR</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            value="foreigner"
                            className="h-4 w-4 border-slate-300 text-primary accent-primary"
                            {...register("nationality")}
                          />
                          <span className="text-sm text-slate-600">Foreigner</span>
                        </label>
                      </div>
                      {errors.nationality && (
                        <p className="mt-1 text-xs font-medium text-red-500">{errors.nationality.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 h-12 w-full gap-2 rounded-full bg-primary text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Get Your Loan Options
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {errors.root && (
                    <p className="mt-3 text-center text-sm text-red-500">
                      {errors.root.message}
                    </p>
                  )}

                  {/* Terms checkbox */}
                  <div className="mt-4">
                    <label className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-primary"
                        {...register("agreedToTerms")}
                      />
                      <span className="text-xs leading-relaxed text-slate-500">
                        By proceeding the application, I agree to LendKaki&apos;s{" "}
                        <button type="button" onClick={() => setShowTerms(true)} className="font-medium text-primary hover:underline">
                          Terms of Use
                        </button>{" "}
                        and{" "}
                        <button type="button" onClick={() => setShowPrivacy(true)} className="font-medium text-primary hover:underline">
                          Privacy Policy
                        </button>
                        , and consent to receive marketing messages.
                      </span>
                    </label>
                    {errors.agreedToTerms && (
                      <p className="mt-1 text-xs font-medium text-red-500">{errors.agreedToTerms.message}</p>
                    )}
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TRUST STRIP                                                  */}
      {/* ============================================================ */}
      <section ref={trustRef} className="border-y border-border/50 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 15 }}
                animate={trustInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 sm:h-12 sm:w-12">
                  <badge.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground sm:text-base">
                    {badge.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground sm:text-xs">
                    {badge.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ============================================================ */}
      {/*  SOCIAL PROOF - TESTIMONIALS                                  */}
      {/* ============================================================ */}
      <section
        ref={testimonialsRef}
        className="bg-slate-900 py-12 sm:py-16"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center sm:mb-10"
          >
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Real Results from Real Borrowers
            </h2>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Join thousands of Singaporeans who found better rates with us.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 15 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5 sm:p-6"
              >
                <div className="mb-3 flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                    {testimonialDates[i] && (
                      <p className="text-[10px] text-slate-500 mt-0.5">{testimonialDates[i]}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FAQ                                                          */}
      {/* ============================================================ */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="mb-6 text-center text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl">
            Common Questions
          </h2>
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <FaqItem
                key={index}
                question={item.question}
                answer={item.answer}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FINAL CTA BANNER                                             */}
      {/* ============================================================ */}
      <section className="hero-gradient py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Ready to find your best rate?
          </h2>
          <p className="mt-3 text-sm text-slate-900/70 sm:text-base">
            Join thousands of Singaporeans who save on their loans every month.
          </p>
          <Button
            onClick={scrollToForm}
            size="lg"
            className="mt-6 h-12 gap-2 bg-primary px-8 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 sm:text-base"
          >
            Get My Best Rates
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  LEGAL FOOTER                                                 */}
      {/* ============================================================ */}
      <footer ref={footerRef} className="border-t border-border bg-slate-900 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-[10px] leading-relaxed text-slate-400 sm:text-xs">
            LendKaki is managed and operated by Lendkaki Pay Pte. Ltd. (UEN: 202607335C). LendKaki is a loan comparison platform. We are not a lender. All
            loan products are offered by licensed banks and financial
            institutions regulated by the Monetary Authority of Singapore (MAS)
            and/or the Ministry of Law (MinLaw). Rates shown are indicative and
            subject to change. By submitting an application, you agree to our{" "}
            <a href="/terms" className="underline hover:text-slate-300">Terms of Use</a>,{" "}
            <a href="/privacy" className="underline hover:text-slate-300">Privacy Policy</a>, and{" "}
            <a href="/pdpa" className="underline hover:text-slate-300">PDPA Compliance</a>.
          </p>
          <p className="mt-3 text-center text-[10px] text-slate-500">
            &copy; 2026 LendKaki. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ============================================================ */}
      {/*  STICKY MOBILE CTA                                            */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showStickyCta && !isSuccess && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden"
          >
            <Button
              onClick={scrollToForm}
              className="h-12 w-full gap-2 bg-primary text-sm font-semibold text-white shadow-lg hover:bg-primary/90"
            >
              Get My Best Rates
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <PolicyModal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms of Use">
        <TermsContent />
      </PolicyModal>
      <PolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
        <PrivacyContent />
      </PolicyModal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline FAQ Item (simplified, no external dependencies)             */
/* ------------------------------------------------------------------ */

function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
      className={cn(
        "rounded-lg bg-white border transition-all duration-200",
        isOpen ? "border-primary/30 shadow-sm" : "border-border/50"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-auto w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5 sm:py-4"
      >
        <span
          className={cn(
            "flex-1 text-sm font-medium transition-colors sm:text-base",
            isOpen ? "text-foreground" : "text-foreground/70"
          )}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-colors",
              isOpen ? "text-primary" : "text-muted-foreground"
            )}
          />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
          >
            <div className="px-4 pb-3.5 pt-1 sm:px-5 sm:pb-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page export with Suspense boundary for useSearchParams             */
/* ------------------------------------------------------------------ */

export default function ApplyLandingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LandingPageInner />
    </Suspense>
  );
}
