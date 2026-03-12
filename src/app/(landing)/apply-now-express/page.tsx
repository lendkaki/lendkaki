"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  ChevronLeft,
  Zap,
  Check,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { submitLeadInBackground } from "@/lib/api/leads";
import { loanPurposeOptions } from "@/lib/loan-data";
import { quickLeadSchema, type QuickLeadValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PolicyModal } from "@/components/ui/policy-modal";
import { MatchingModal } from "@/components/ui/matching-modal";
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
    before: "Get Your Best Loan Rate in",
    highlight: "Minutes",
    subheadline:
      "One simple form. Matched to 20+ licensed lenders and banks. No obligation.",
  },
  fast: {
    before: "Stop Overpaying — Find a Better Rate in",
    highlight: "60 Seconds",
    subheadline:
      "Apply once, compare offers from 20+ lenders, and get funded fast.",
  },
  free: {
    before: "Free Loan Matching | No Credit Score Impact",
    subheadline:
      "We do the searching for you. 20+ licensed lenders, zero cost to you.",
  },
  save: {
    before: "Find the Lowest Rate and Save Thousands",
    subheadline:
      "Our borrowers save an average of $2,000 in interest. Start comparing now.",
  },
};

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */

const testimonials = [
  {
    text: "I was dreading applying to multiple banks. LendKaki matched me with 5 offers in under a minute. I saved over $2,000 in interest compared to my bank's rate.",
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
      "No, checking your rates on LendKaki will not affect your credit score. We use a soft credit enquiry that doesn't impact your credit report. Only when you proceed to accept a loan offer and the lender performs a hard credit check will it affect your score.",
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
/*  Multi-step form constants                                          */
/* ------------------------------------------------------------------ */

const TOTAL_STEPS = 3;

const STEP_LABELS = ["Loan Info", "Connect with Singpass", "Review"];

const STEP_FIELDS: (keyof QuickLeadValues)[][] = [
  ["amount", "purpose"],
  ["name", "email", "phone"],
  ["agreedToTerms"],
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

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
  const router = useRouter();
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
  const [showMatching, setShowMatching] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const successRef = useRef<HTMLDivElement>(null);

  // Myinfo profile loaded from secured API (only after Singpass login)
  const [myinfo, setMyinfo] = useState<any | null>(null);
  const [myinfoLoaded, setMyinfoLoaded] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSuccess]);

  // Load Myinfo profile (if logged in) so we can show it on the review step
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) setMyinfo(json);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setMyinfoLoaded(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // When returning from Singpass for the express flow, jump user straight to final step (review)
  useEffect(() => {
    const from = searchParams.get("from");
    const stepParam = searchParams.get("step");
    if (from === "singpass" && stepParam && myinfo) {
      const stepNum = Number(stepParam);
      if (!Number.isNaN(stepNum) && stepNum >= 0 && stepNum < TOTAL_STEPS) {
        setCurrentStep(stepNum);
      }
    }
  }, [searchParams, myinfo]);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    getValues,
    formState: { errors },
    setError,
  } = useForm<QuickLeadValues>({
    resolver: zodResolver(quickLeadSchema),
    mode: "onTouched",
    defaultValues: {
      agreedToTerms: false,
    },
  });

  const watchedPurpose = watch("purpose");
  const watchedNationality = watch("nationality");

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[currentStep]);
    if (!valid) return;

    const nextStep = Math.min(currentStep + 1, TOTAL_STEPS - 1);

    // Prevent reaching the final review step without Singpass/Myinfo
    if (nextStep === TOTAL_STEPS - 1 && !myinfo) {
      setError("root", {
        type: "manual",
        message:
          "Please complete Singpass login before reviewing and submitting your application.",
      });
      return;
    }

    setDirection(1);
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleExpressSingpass = async () => {
    // Validate first-step fields (loan amount + purpose) before redirecting
    const ok = await trigger(STEP_FIELDS[0]);
    if (!ok) return;
    const values = getValues();
    const qs = new URLSearchParams();
    if (values.amount != null) qs.set("amount", String(values.amount));
    if (values.purpose) qs.set("purpose", values.purpose);
    if (variant) qs.set("v", variant);
    const href = qs.toString()
      ? `/login?flow=apply-now-express&${qs.toString()}`
      : "/login?flow=apply-now-express";
    router.push(href);
  };

  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby2hR6rxThjW8CIjpMDtlWePt9HI96GUivfMMkumu1xah6fwDLjSOzHY8Kh70tIt9yj/exec";

  const onSubmit = (data: QuickLeadValues) => {
    setIsSubmitting(true);
    setShowMatching(true);
    setIsSubmitting(false);

    submitLeadInBackground(data, {
      landing_page: typeof window !== "undefined" ? window.location.pathname : "/apply-now",
      variant,
      utm_source: utmSource || undefined,
      utm_medium: utmMedium || undefined,
      utm_campaign: utmCampaign || undefined,
      utm_content: utmContent || undefined,
      utm_term: utmTerm || undefined,
    });
    fetch(GOOGLE_SCRIPT_URL, {
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
        landingpage: typeof window !== "undefined" ? window.location.pathname : "",
      }),
    });
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", {
        content_name: "Loan Application",
        content_category: "Lead Form",
      });
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
            className="grid items-start gap-8 pb-12 pt-10 sm:pb-16 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pb-12 lg:pt-10"
          >
            {/* Left: Headline + Value Props */}
            <div className="flex flex-col">
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

              {/* Value prop bullets + mascot side-by-side on mobile/tablet */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 flex items-center justify-between gap-3 sm:mt-8 sm:justify-start lg:block"
              >
                {/* Bullets */}
                <div className="space-y-3">
                  {[
                    "20+ licensed lenders in one place",
                    "100% free, no hidden fees",
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
                </div>

                {/* Mascot pointing down – mobile/tablet only, beside bullets */}
                <motion.img
                  src="/images/otter point down.webp"
                  alt="LendKaki mascot"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: 0.35 }}
                  className="mr-4 w-24 shrink-0 object-contain drop-shadow-md sm:mr-6 sm:w-28 lg:hidden"
                />
              </motion.div>

              {/* Social proof – all viewports */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 flex items-center gap-3 sm:mt-8"
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

              {/* Mascot pointing right – desktop only */}
              <motion.img
                src="/images/otter point right.webp"
                alt="LendKaki mascot"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 hidden w-56 self-center object-contain drop-shadow-lg lg:block xl:w-64"
              />
            </div>

            {/* Right: Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="w-full"
            >
              {isSuccess ? (
                <motion.div
                  ref={successRef}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative overflow-hidden rounded-2xl bg-[#0f1b3d] px-6 py-8 text-center shadow-2xl sm:px-10 sm:py-10"
                >
                  <motion.h3
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.1 }}
                    className="text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl"
                  >
                    What to Do Next?
                  </motion.h3>

                  <motion.ol
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="mt-6 space-y-4 text-left"
                  >
                    {[
                      { n: "1", text: "Our system is now matching your request to the most suitable lender from our network of 20+ licensed financial institutions." },
                      { n: "2", text: "A LendKaki agent will reach out to you via WhatsApp shortly with your personalised loan offer and next steps." },
                      { n: "3", text: "Simply reply to our WhatsApp message, and our agent will guide you through the process. Once verified, your loan will be disbursed directly from the lender." },
                    ].map(({ n, text }, i) => (
                      <motion.li
                        key={n}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.1, duration: 0.35 }}
                        className="flex gap-3"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                          {n}
                        </span>
                        <p className="text-sm leading-relaxed text-white/80 sm:text-base">{text}</p>
                      </motion.li>
                    ))}
                  </motion.ol>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65 }}
                    className="my-5 flex items-center gap-3"
                  >
                    <span className="h-px flex-1 bg-white/15" />
                    <span className="text-xs font-medium uppercase tracking-wider text-white/40">or</span>
                    <span className="h-px flex-1 bg-white/15" />
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm text-white/60"
                  >
                    Can&apos;t wait? Chat with us now
                  </motion.p>

                  <motion.a
                    href="https://wa.me/6589009628?text=Hi,I%20just%20submitted%20loan%20application"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.78, duration: 0.35 }}
                    className="mt-3 inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#25D366]">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Us Now
                  </motion.a>
                </motion.div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
                  {/* ---- Progress indicator ---- */}
                  <div className="border-b border-border/50 bg-slate-50/80 px-6 py-4 sm:px-8">
                    <div className="flex items-center justify-between">
                      {STEP_LABELS.map((label, i) => (
                        <div key={label} className="flex flex-col items-center gap-1.5">
                          <motion.div
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors duration-300",
                              i < currentStep
                                ? "bg-primary text-white"
                                : i === currentStep
                                  ? "bg-primary text-white ring-4 ring-primary/20"
                                  : "bg-slate-200 text-slate-400"
                            )}
                            whileTap={i <= currentStep ? { scale: 0.9 } : undefined}
                            onClick={() => {
                              if (i < currentStep) {
                                setDirection(-1);
                                setCurrentStep(i);
                              }
                            }}
                            style={{ cursor: i < currentStep ? "pointer" : "default" }}
                          >
                            {i < currentStep ? <Check className="h-3.5 w-3.5" /> : i + 1}
                          </motion.div>
                          <span
                            className={cn(
                              "hidden text-[10px] font-medium sm:block",
                              i === currentStep ? "text-primary" : "text-slate-400"
                            )}
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        animate={{ width: `${(currentStep / (TOTAL_STEPS - 1)) * 100}%` }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                      />
                    </div>
                  </div>

                  {/* ---- Step content ---- */}
                  <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
                    <div className="min-h-[320px]">
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={currentStep}
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          {/* ====== Step 0: Loan Details ====== */}
                          {currentStep === 0 && (
                            <div className="space-y-5">
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                  How much do you need?
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                  Tell us about your loan requirements
                                </p>
                              </div>

                              <div>
                                <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                                  Desired Loan Amount
                                </Label>
                                <div className="relative">
                                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">
                                    $
                                  </span>
                                  <input
                                    type="number"
                                    placeholder="e.g. 10000"
                                    className="h-14 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 text-lg font-semibold outline-none transition-all placeholder:text-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    {...register("amount", { valueAsNumber: true })}
                                  />
                                </div>
                                {errors.amount && (
                                  <p className="mt-1 text-xs font-medium text-red-500">{errors.amount.message}</p>
                                )}
                              </div>

                              <div>
                                <Label className="mb-2 block text-sm font-medium text-slate-700">
                                  What&apos;s the loan for?
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                  {loanPurposeOptions.map((opt) => (
                                    <motion.button
                                      key={opt.value}
                                      type="button"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.97 }}
                                      onClick={() =>
                                        setValue("purpose", opt.value as QuickLeadValues["purpose"], {
                                          shouldValidate: true,
                                        })
                                      }
                                      className={cn(
                                        "relative rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all duration-200",
                                        watchedPurpose === opt.value
                                          ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                                          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                      )}
                                    >
                                      {watchedPurpose === opt.value && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary"
                                        >
                                          <Check className="h-2.5 w-2.5 text-white" />
                                        </motion.div>
                                      )}
                                      {opt.label}
                                    </motion.button>
                                  ))}
                                </div>
                                {errors.purpose && (
                                  <p className="mt-1 text-xs font-medium text-red-500">{errors.purpose.message}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* ====== Step 1: Connect with Singpass (express) ====== */}
                          {currentStep === 1 && (
                            <div className="space-y-5">
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                  Almost there!
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                  Use Singpass to auto-fill your details.
                                </p>
                              </div>

                              <div className="rounded-xl bg-slate-50 p-4 text-sm">
                                <p className="font-semibold text-slate-900">
                                  Loan summary
                                </p>
                                <p className="mt-1 text-xs text-slate-600">
                                  Amount: $
                                  {(getValues("amount") ?? 0).toLocaleString()} • Purpose:{" "}
                                  {loanPurposeOptions.find(
                                    (o) => o.value === getValues("purpose")
                                  )?.label ?? "—"}
                                </p>
                              </div>

                              {isSubmitting ? (
                                <div className="flex h-[44px] items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Redirecting…
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="block w-full transition-opacity hover:opacity-80 disabled:opacity-60"
                                  onClick={handleExpressSingpass}
                                  disabled={isSubmitting}
                                >
                                  <img
                                    src="/images/buttons/myinfo-neutral.svg"
                                    alt="Retrieve MyInfo with Singpass"
                                    className="h-[44px] w-full"
                                  />
                                </button>
                              )}

                              <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-slate-200" />
                                <span className="text-xs font-medium text-slate-400">or</span>
                                <div className="h-px flex-1 bg-slate-200" />
                              </div>

                              <button
                                type="button"
                                className="flex w-full items-center justify-center gap-1.5 py-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
                                onClick={() => router.push("/apply-now")}
                              >
                                Fill in manually instead
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}

                          {/* ====== Final Step: Review & Submit ====== */}
                          {currentStep === TOTAL_STEPS - 1 && (
                            <div className="space-y-5">
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                  Review your application
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                  Make sure everything looks right before submitting
                                </p>
                              </div>

                              <div className="space-y-2.5 rounded-xl bg-slate-50 p-4">
                                {[
                                  { label: "Loan Amount", value: `$${(getValues("amount") ?? 0).toLocaleString()}` },
                                  { label: "Purpose", value: loanPurposeOptions.find((o) => o.value === getValues("purpose"))?.label ?? "—" },
                                  { label: "Name", value: getValues("name") || "—" },
                                  { label: "Email", value: getValues("email") || "—" },
                                  { label: "Phone", value: getValues("phone") || "—" },
                                ].map(({ label, value }, i) => (
                                  <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.04 * i, duration: 0.25 }}
                                    className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 last:border-0 last:pb-0"
                                  >
                                    <span className="text-xs font-medium text-slate-500">{label}</span>
                                    <span className="text-sm font-semibold text-slate-900">{value}</span>
                                  </motion.div>
                                ))}
                              </div>

                              <div>
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

                              {/* Myinfo debug panel */}
                              <div className="space-y-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                  Myinfo profile (from Singpass)
                                </p>
                                {!myinfoLoaded && (
                                  <p className="text-xs text-slate-500">Loading Myinfo data…</p>
                                )}
                                {myinfoLoaded && !myinfo && (
                                  <p className="text-xs text-red-500">
                                    We could not load your Myinfo profile. Please complete Singpass login again.
                                  </p>
                                )}
                                {myinfo && (
                                  <pre className="max-h-48 overflow-auto rounded bg-slate-900/95 p-3 text-[11px] leading-snug text-slate-100">
{JSON.stringify((myinfo as any).person_info ?? myinfo, null, 2)}
                                  </pre>
                                )}
                              </div>

                              {errors.root && (
                                <p className="text-center text-sm text-red-500">{errors.root.message}</p>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* ---- Navigation ---- */}
                    {currentStep < TOTAL_STEPS - 1 ? (
                      <div className="mt-6 flex items-center gap-3">
                        {currentStep > 0 && (
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleBack}
                              className="gap-1 rounded-full"
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Back
                            </Button>
                          </motion.div>
                        )}
                        <div className="flex-1" />
                        {currentStep === 0 && (
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button
                              type="button"
                              onClick={handleNext}
                              className="gap-1 rounded-full px-6"
                            >
                              Next
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-6 flex flex-col items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full"
                        >
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-14 w-full gap-2 rounded-full bg-primary text-base font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                Get Your Loan Options
                                <ArrowRight className="h-5 w-5" />
                              </>
                            )}
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleBack}
                            className="gap-1 rounded-full text-slate-500"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                          </Button>
                        </motion.div>
                      </div>
                    )}

                    {/* Step counter */}
                    <p className="mt-3 text-center text-xs text-slate-400">
                      Step {currentStep + 1} of {TOTAL_STEPS}
                    </p>
                  </form>
                </div>
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
      {/*  SOCIAL PROOF - TESTIMONIALS                                  */}
      {/* ============================================================ */}
      <section ref={testimonialsRef} className="bg-slate-900 py-12 sm:py-16">
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

      <MatchingModal
        isOpen={showMatching}
        onComplete={() => {
          setShowMatching(false);
          setIsSuccess(true);
        }}
      />
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
/*  Inline FAQ Item                                                    */
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

export default function ApplyNowLandingPage() {
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
