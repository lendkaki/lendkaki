"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Shield,
  Clock,
  Users,
  BadgeCheck,
  Star,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SingpassButton } from "@/components/forms/singpass-button";
import { StepLoanDetails } from "@/components/forms/step-loan-details";
import { StepPersonal } from "@/components/forms/step-personal";
import { StepEmployment } from "@/components/forms/step-employment";
import {
  leadFormSchema,
  stepLoanDetailsSchema,
  stepPersonalSchema,
  stepEmploymentSchema,
  type LeadFormValues,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Headline variants for ad message matching                          */
/* ------------------------------------------------------------------ */

const headlineVariants: Record<
  string,
  { headline: string; subheadline: string }
> = {
  default: {
    headline: "Compare Singapore's Best Loan Rates in 60 Seconds",
    subheadline:
      "One quick form. 50+ licensed lenders. Personalized offers — no credit score impact.",
  },
  fast: {
    headline: "Get Approved for a Loan in Under 24 Hours",
    subheadline:
      "Skip the bank queues. Apply once, get matched with 50+ lenders instantly.",
  },
  free: {
    headline: "Free Loan Comparison — Zero Credit Score Impact",
    subheadline:
      "Compare rates from 50+ licensed lenders without affecting your credit. 100% free.",
  },
  save: {
    headline: "Save Thousands on Your Next Loan",
    subheadline:
      "Our borrowers save an average of $2,000 in interest. Find your best rate now.",
  },
};

/* ------------------------------------------------------------------ */
/*  Form step definitions                                              */
/* ------------------------------------------------------------------ */

const steps = [
  {
    id: 1,
    title: "Loan Details",
    description: "How much do you need?",
    schema: stepLoanDetailsSchema,
  },
  {
    id: 2,
    title: "Personal Info",
    description: "Tell us about yourself",
    schema: stepPersonalSchema,
  },
  {
    id: 3,
    title: "Employment",
    description: "Your work details",
    schema: stepEmploymentSchema,
  },
];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
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
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    text: "As an SME owner, getting a business loan used to take weeks. Through LendKaki I got approved within 24 hours and funds were in my account the next day.",
    name: "Ahmad Rizal",
    role: "Business Loan",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    text: "Needed a bridging loan urgently for my property purchase. LendKaki connected me with a lender who disbursed the funds the same day. Lifesaver.",
    name: "Kenneth Teo",
    role: "Bridging Loan",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
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
  { icon: Users, label: "50+ Licensed Lenders", sub: "MAS & MinLaw regulated" },
  { icon: Clock, label: "Same-Day Approval", sub: "Funds within 24 hours" },
  { icon: Shield, label: "Zero Credit Impact", sub: "Soft checks only" },
  { icon: BadgeCheck, label: "100% Free", sub: "No hidden fees ever" },
];

/* ------------------------------------------------------------------ */
/*  Inner page wrapped with Suspense for useSearchParams               */
/* ------------------------------------------------------------------ */

function LandingPageInner() {
  const searchParams = useSearchParams();
  const variant = searchParams.get("v") || "default";
  const { headline, subheadline } =
    headlineVariants[variant] || headlineVariants.default;

  /* UTM params */
  const utmSource = searchParams.get("utm_source") || "";
  const utmMedium = searchParams.get("utm_medium") || "";
  const utmCampaign = searchParams.get("utm_campaign") || "";
  const utmContent = searchParams.get("utm_content") || "";
  const utmTerm = searchParams.get("utm_term") || "";

  /* Form state */
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { loanAmount: 20000, tenure: 24 },
    mode: "onTouched",
  });

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goToNext = async () => {
    const currentSchema = steps[currentStep].schema;
    const fieldsToValidate = Object.keys(
      currentSchema.shape
    ) as (keyof LeadFormValues)[];
    const isValid = await methods.trigger(fieldsToValidate);
    if (!isValid) return;
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          utm_term: utmTerm,
          landing_page: "apply",
          variant,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      setIsSuccess(true);
    } catch {
      methods.setError("root", {
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
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="Scroll to top"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <span className="text-sm font-bold text-white">LK</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              LendKaki
            </span>
          </button>
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
                {headline}
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
                  "50+ licensed lenders in one place",
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
                  {[32, 44, 75].map((id) => (
                    <img
                      key={id}
                      src={`https://randomuser.me/api/portraits/${id === 44 ? "women" : "men"}/${id}.jpg`}
                      alt="Borrower"
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
                <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-xl sm:p-8">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                    Application Submitted!
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                    We&apos;re matching you with the best loan offers from our
                    network of 50+ licensed lenders. You&apos;ll receive your
                    personalized rates via email within minutes.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-7">
                  {/* Form header */}
                  <div className="mb-5 text-center">
                    <h2 className="text-lg font-bold text-foreground sm:text-xl">
                      Get Your Best Rates
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      Takes less than 2 minutes
                    </p>
                  </div>

                  {/* Singpass */}
                  <div className="mb-5">
                    <SingpassButton />
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-card px-4 text-xs text-muted-foreground">
                          or fill in manually
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress steps */}
                  <div className="mb-5">
                    <div className="mx-auto flex max-w-xs items-center justify-center">
                      {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-1 items-center">
                          <div className="flex w-full flex-col items-center">
                            <motion.div
                              animate={
                                index === currentStep
                                  ? { scale: [1, 1.15, 1] }
                                  : { scale: 1 }
                              }
                              transition={{
                                duration: 0.4,
                                ease: [0.34, 1.56, 0.64, 1],
                              }}
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                                index <= currentStep
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-background text-muted-foreground"
                              )}
                            >
                              {index < currentStep ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                step.id
                              )}
                            </motion.div>
                            <span className="mt-1.5 hidden text-center text-[10px] font-medium text-muted-foreground sm:block">
                              {step.title}
                            </span>
                          </div>
                          {index < steps.length - 1 && (
                            <div
                              className={cn(
                                "mx-1.5 h-0.5 flex-1 rounded transition-colors",
                                index < currentStep ? "bg-primary" : "bg-border"
                              )}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step title */}
                  <div className="mb-4">
                    <h3 className="text-base font-semibold text-foreground">
                      {steps[currentStep].title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {steps[currentStep].description}
                    </p>
                  </div>

                  {/* Form */}
                  <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={currentStep}
                          custom={direction}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          {currentStep === 0 && <StepLoanDetails />}
                          {currentStep === 1 && <StepPersonal />}
                          {currentStep === 2 && <StepEmployment />}
                        </motion.div>
                      </AnimatePresence>

                      {methods.formState.errors.root && (
                        <p className="mt-3 text-sm text-destructive">
                          {methods.formState.errors.root.message}
                        </p>
                      )}

                      {/* Navigation */}
                      <div className="mt-6 flex items-center justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={goToPrev}
                          disabled={currentStep === 0}
                          className="gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </Button>

                        {currentStep < steps.length - 1 ? (
                          <Button
                            type="button"
                            onClick={goToNext}
                            className="gap-2 bg-slate-900 text-white hover:bg-slate-800"
                          >
                            Next
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="gap-2 bg-slate-900 text-white hover:bg-slate-800"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                Submit Application
                                <ArrowRight className="h-4 w-4" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </form>
                  </FormProvider>

                  {/* Privacy note */}
                  <p className="mt-4 text-center text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
                    Your data is encrypted and secure. By submitting, you agree
                    to our Terms of Service and Privacy Policy.
                  </p>
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
      {/*  PARTNER LOGOS                                                */}
      {/* ============================================================ */}
      <section className="bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="mb-6 text-center text-sm font-medium text-muted-foreground">
            Trusted by Singapore&apos;s top banks and lenders
          </p>
          <div className="grid grid-cols-4 items-center gap-4 sm:gap-6 lg:grid-cols-8">
            {partnerLogos.map((logo) => (
              <div
                key={logo.alt}
                className="flex items-center justify-center grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={80}
                  height={40}
                  className="h-8 w-auto object-contain sm:h-10"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

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
            className="mt-6 h-12 gap-2 bg-slate-900 px-8 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 sm:text-base"
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
            LendKaki is a loan comparison platform. We are not a lender. All
            loan products are offered by licensed banks and financial
            institutions regulated by the Monetary Authority of Singapore (MAS)
            and/or the Ministry of Law (MinLaw). Rates shown are indicative and
            subject to change. By submitting an application, you agree to our
            Terms of Service and Privacy Policy.
          </p>
          <p className="mt-3 text-center text-[10px] text-slate-500">
            &copy; {new Date().getFullYear()} LendKaki. All rights reserved.
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
              className="h-12 w-full gap-2 bg-slate-900 text-sm font-semibold text-white shadow-lg hover:bg-slate-800"
            >
              Get My Best Rates
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
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
