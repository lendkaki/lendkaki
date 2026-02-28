"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
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
  Zap,
  Star,
  ChevronDown,
  DollarSign,
  Calendar,
  Percent,
  Home,
  Banknote,
  HeartHandshake,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loanPurposeOptions, calculateMonthlyInstallment } from "@/lib/loan-data";
import { quickLeadSchema, type QuickLeadValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { PolicyModal } from "@/components/ui/policy-modal";
import { MatchingModal } from "@/components/ui/matching-modal";
import { TermsContent } from "@/components/content/terms-content";
import { PrivacyContent } from "@/components/content/privacy-content";

const trustBadges = [
  { icon: Users, label: "20+ Licensed Lenders", sub: "MAS & MinLaw regulated" },
  { icon: Clock, label: "Same-Day Disbursement", sub: "Urgent approvals available" },
  { icon: Shield, label: "Secured Against Property", sub: "Competitive low rates" },
  { icon: BadgeCheck, label: "100% Free", sub: "No hidden fees ever" },
];

const benefits = [
  {
    icon: Home,
    title: "Property Purchase Bridge",
    description:
      "Bridge the gap between your new property purchase and the sale of your existing one. Get the funds you need quickly without missing out on your dream home.",
  },
  {
    icon: Timer,
    title: "Fast Approval & Disbursement",
    description:
      "Time is critical with bridging loans. Many of our lender partners can approve and disburse bridging loans within 24 hours of your application.",
  },
  {
    icon: Banknote,
    title: "Competitive Bridging Rates",
    description:
      "Access bridging loan rates from banks and licensed financial institutions. Compare multiple offers in one place and choose what works best for you.",
  },
  {
    icon: HeartHandshake,
    title: "Flexible Repayment Terms",
    description:
      "Bridging loans are short-term by nature. We match you with lenders who offer flexible terms tailored to your property transaction timeline.",
  },
];

const testimonials = [
  {
    text: "Needed a bridging loan urgently for my property purchase. LendKaki connected me with a lender who disbursed the funds the same day. Absolute lifesaver.",
    name: "Kenneth Teo",
    role: "Bridging Loan · $300,000",
    image: "/testimonials/kenneth teo.webp",
  },
  {
    text: "My HDB sale was delayed and I needed to complete my new condo purchase. LendKaki got me a bridging loan within 24 hours. Very smooth experience.",
    name: "Tan Wei Ming",
    role: "Bridging Loan · $180,000",
    image: "/testimonials/tan wei ming.webp",
  },
  {
    text: "Was worried about missing my option to purchase deadline. LendKaki matched me with a lender immediately and the rate was better than my bank's quote.",
    name: "Priya Nair",
    role: "Bridging Loan · $250,000",
    image: "/testimonials/priya nair.webp",
  },
];

const faqItems = [
  {
    question: "What is a bridging loan?",
    answer:
      "A bridging loan is a short-term loan that helps you 'bridge' the gap between the purchase of a new property and the completion of the sale of your existing one. It gives you the funds needed to complete your new property purchase before your current property is sold.",
  },
  {
    question: "How quickly can I get a bridging loan?",
    answer:
      "Bridging loans are designed for urgency. Many of our lender partners can approve and disburse within 24 hours of receiving your application and supporting documents. Having your property documents ready will speed up the process significantly.",
  },
  {
    question: "What are the interest rates for bridging loans?",
    answer:
      "Bridging loan rates in Singapore typically range from 1.5% to 5% per month, depending on the lender, loan amount, and your financial profile. Our platform allows you to compare rates from multiple lenders so you can find the most competitive offer.",
  },
  {
    question: "How much can I borrow with a bridging loan?",
    answer:
      "The loan amount is typically based on the expected sale proceeds from your existing property. Lenders usually offer up to 80–90% of the anticipated net proceeds. The exact amount depends on the lender's assessment and your property's valuation.",
  },
  {
    question: "What documents do I need for a bridging loan?",
    answer:
      "Typically, you will need your NRIC, Option to Purchase (OTP) for the new property, the sale and purchase agreement for your existing property, latest CPF statements, and recent bank statements. Requirements vary by lender.",
  },
  {
    question: "Is LendKaki's service really free?",
    answer:
      "Yes, absolutely. LendKaki is 100% free for borrowers. We earn a commission from lenders when you successfully take up a loan. There are no fees or charges for using our platform.",
  },
];

const fmt = new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtWhole = new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD", minimumFractionDigits: 0, maximumFractionDigits: 0 });

function SliderField({ icon: Icon, label, value, displayValue, min, max, step, minLabel, maxLabel, onChange }: { icon: React.ElementType; label: string; value: number; displayValue: string; min: number; max: number; step: number; minLabel: string; maxLabel: string; onChange: (val: number) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"><Icon className="h-4 w-4 text-primary" /></div>
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-lg font-bold text-foreground tabular-nums sm:text-xl">{displayValue}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} className="[&_[data-slot=slider-thumb]]:h-10 [&_[data-slot=slider-thumb]]:w-10 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-track]]:h-2.5" />
      <div className="flex justify-between text-xs text-muted-foreground"><span>{minLabel}</span><span>{maxLabel}</span></div>
    </div>
  );
}

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.3, delay: index * 0.08 }} className={cn("rounded-lg border bg-white transition-all duration-200", isOpen ? "border-primary/30 shadow-sm" : "border-border/50")}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex h-auto w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5 sm:py-4">
        <span className={cn("flex-1 text-sm font-medium transition-colors sm:text-base", isOpen ? "text-foreground" : "text-foreground/70")}>{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
          <ChevronDown className={cn("h-4 w-4 transition-colors", isOpen ? "text-primary" : "text-muted-foreground")} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }} exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}>
            <div className="px-4 pb-3.5 pt-1 sm:px-5 sm:pb-4"><p className="text-sm leading-relaxed text-muted-foreground">{answer}</p></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function randomRecentDate(): string {
  const msIn30Days = 30 * 24 * 60 * 60 * 1000;
  const date = new Date(Date.now() - Math.random() * msIn30Days);
  return date.toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
}

export default function BridgingLoansPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showMatching, setShowMatching] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = useCallback(() => { formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, []);

  useEffect(() => { if (isSuccess) window.scrollTo({ top: 0, behavior: "smooth" }); }, [isSuccess]);

  const { register, handleSubmit, setValue, formState: { errors }, setError } = useForm<QuickLeadValues>({ resolver: zodResolver(quickLeadSchema), mode: "onTouched" });

  useEffect(() => { setValue("purpose", "bridging"); }, [setValue]);

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwK6FZhJ7GVvA5Jz9LwKzwc4N9d1eo6jv4J47B5xbVQzaVGn2iIjlSRO_eACRx2YI_h/exec";

  const onSubmit = async (data: QuickLeadValues) => {
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name, phone: data.phone, email: data.email,
          amount: String(data.amount),
          purpose: loanPurposeOptions.find((o) => o.value === data.purpose)?.label ?? data.purpose,
          nationality: data.nationality === "foreigner" ? "Foreigner" : data.nationality,
        }),
      });
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead", { content_name: "Bridging Loan Application", content_category: "Lead Form" });
      }
      setShowMatching(true);
    } catch {
      setError("root", { message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [loanAmount, setLoanAmount] = useState(10000);
  const [tenure, setTenure] = useState(12);
  const [interestRate, setInterestRate] = useState(6);

  const calcResults = useMemo(() => {
    const monthly = calculateMonthlyInstallment(loanAmount, interestRate, tenure);
    const totalPayable = monthly * tenure;
    const totalInterest = totalPayable - loanAmount;
    return { monthly, totalPayable, totalInterest };
  }, [loanAmount, interestRate, tenure]);

  const interestPct = loanAmount > 0 ? (calcResults.totalInterest / calcResults.totalPayable) * 100 : 0;

  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    const handleScroll = () => { if (!formRef.current) return; setShowStickyCta(formRef.current.getBoundingClientRect().bottom < 0); };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [testimonialDates, setTestimonialDates] = useState<string[]>([]);
  useEffect(() => { setTestimonialDates(testimonials.map(() => randomRecentDate())); }, []);

  const trustRef = useRef<HTMLDivElement>(null);
  const trustInView = useInView(trustRef, { once: true, margin: "-50px" });
  const benefitsRef = useRef<HTMLDivElement>(null);
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-50px" });
  const calcRef = useRef<HTMLDivElement>(null);
  const calcInView = useInView(calcRef, { once: true, margin: "-50px" });
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-50px" });
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-50px" });

  return (
    <>
      {/* HERO + FORM */}
      <section className="hero-gradient relative overflow-hidden scroll-mt-14 pt-6 sm:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div ref={formRef} id="apply" className="grid items-start gap-8 pb-12 pt-4 sm:pb-16 sm:pt-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pb-20 lg:pt-12">
            <div className="flex flex-col justify-center">
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Singapore&apos;s Best Bridging Loan Rates —{" "}
                <span className="relative inline-flex items-center gap-1.5 -rotate-2 rounded-lg bg-[#E5FF00] px-3 py-0.5 text-slate-900 sm:gap-2 sm:px-4 sm:py-1">
                  <motion.span animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }} className="inline-flex">
                    <Zap className="h-6 w-6 fill-yellow-400 text-yellow-600 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
                  </motion.span>
                  Fast
                </span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-4 text-base leading-relaxed text-slate-900/70 sm:text-lg lg:text-xl">
                Bridge the gap on your property purchase. 20+ licensed lenders, same-day disbursement available.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-6 space-y-3 sm:mt-8">
                {["Same-day disbursement available", "Secured against your property equity", "100% free, no hidden fees"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900"><CheckCircle2 className="h-3.5 w-3.5 text-white" /></div>
                    <span className="text-sm font-medium text-slate-900/80 sm:text-base">{item}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-8 hidden items-center gap-3 lg:flex">
                <div className="flex -space-x-2">
                  {[{ src: "/testimonials/kenneth teo.webp", alt: "Kenneth Teo" }, { src: "/testimonials/tan wei ming.webp", alt: "Tan Wei Ming" }, { src: "/testimonials/priya nair.webp", alt: "Priya Nair" }].map((a) => (
                    <img key={a.alt} src={a.src} alt={a.alt} width={32} height={32} className="h-8 w-8 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                <span className="text-sm text-slate-900/60">Trusted by Singapore homeowners</span>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }} className="w-full">
              {isSuccess ? (
                <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-xl sm:p-8">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"><CheckCircle2 className="h-7 w-7 text-primary" /></div>
                  <h3 className="text-xl font-bold text-foreground sm:text-2xl">Thank You for Your Submission!</h3>
                  <div className="mt-5 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-5 py-4">
                    <p className="text-base font-bold text-[#128C7E] sm:text-lg">📲 We will contact you via WhatsApp with further instructions on your loan and matched lender.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8">
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="brg-name" className="mb-1.5 block text-sm font-medium text-slate-700">Name</Label>
                      <input id="brg-name" placeholder="Enter your name here" className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register("name")} />
                      {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="brg-phone" className="mb-1.5 block text-sm font-medium text-slate-700">Mobile Number</Label>
                      <input id="brg-phone" placeholder="Enter your mobile number here" className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register("phone")} />
                      {errors.phone && <p className="mt-1 text-xs font-medium text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="brg-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email Address</Label>
                      <input id="brg-email" type="email" placeholder="Enter your email address here" className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register("email")} />
                      {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="brg-amount" className="mb-1.5 block text-sm font-medium text-slate-700">Desired Loan Amount</Label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">$</span>
                        <input id="brg-amount" type="number" placeholder="Enter desired loan amount" className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-7 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register("amount", { valueAsNumber: true })} />
                      </div>
                      {errors.amount && <p className="mt-1 text-xs font-medium text-red-500">{errors.amount.message}</p>}
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-sm font-medium text-slate-700">Purpose of Loan</Label>
                      <Select defaultValue="bridging" onValueChange={(value) => setValue("purpose", value as QuickLeadValues["purpose"], { shouldValidate: true })}>
                        <SelectTrigger className="h-11 w-full rounded-lg border-slate-300 bg-white text-sm text-slate-700 shadow-none focus:border-primary focus:ring-2 focus:ring-primary/20 data-[placeholder]:text-slate-400"><SelectValue placeholder="Select purpose of loan" /></SelectTrigger>
                        <SelectContent>{loanPurposeOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                      </Select>
                      {errors.purpose && <p className="mt-1 text-xs font-medium text-red-500">{errors.purpose.message}</p>}
                    </div>
                    <div>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2"><input type="radio" value="Singaporean_PR" className="h-4 w-4 border-slate-300 text-primary accent-primary" {...register("nationality")} /><span className="text-sm text-slate-600">Singapore/PR</span></label>
                        <label className="flex items-center gap-2"><input type="radio" value="foreigner" className="h-4 w-4 border-slate-300 text-primary accent-primary" {...register("nationality")} /><span className="text-sm text-slate-600">Foreigner</span></label>
                      </div>
                      {errors.nationality && <p className="mt-1 text-xs font-medium text-red-500">{errors.nationality.message}</p>}
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="mt-6 h-12 w-full gap-2 rounded-full bg-primary text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl">
                    {isSubmitting ? (<><Loader2 className="h-4 w-4 animate-spin" />Submitting...</>) : (<>Get Your Bridging Loan Rates<ArrowRight className="h-4 w-4" /></>)}
                  </Button>
                  {errors.root && <p className="mt-3 text-center text-sm text-red-500">{errors.root.message}</p>}
                  <div className="mt-4">
                    <label className="flex items-start gap-2.5">
                      <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-primary" {...register("agreedToTerms")} />
                      <span className="text-xs leading-relaxed text-slate-500">
                        By proceeding with the application, I agree to LendKaki&apos;s{" "}
                        <button type="button" onClick={() => setShowTerms(true)} className="font-medium text-primary hover:underline">Terms of Use</button>{" "}and{" "}
                        <button type="button" onClick={() => setShowPrivacy(true)} className="font-medium text-primary hover:underline">Privacy Policy</button>, and consent to receive marketing messages.
                      </span>
                    </label>
                    {errors.agreedToTerms && <p className="mt-1 text-xs font-medium text-red-500">{errors.agreedToTerms.message}</p>}
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section ref={trustRef} className="border-y border-border/50 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {trustBadges.map((badge, i) => (
              <motion.div key={badge.label} initial={{ opacity: 0, y: 15 }} animate={trustInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.1 }} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 sm:h-12 sm:w-12"><badge.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" /></div>
                <div><p className="text-sm font-semibold text-foreground sm:text-base">{badge.label}</p><p className="text-[10px] text-muted-foreground sm:text-xs">{badge.sub}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE LENDKAKI */}
      <section ref={benefitsRef} className="bg-background py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={benefitsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-10 text-center sm:mb-14">
            <span className="inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Why LendKaki</span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">Why Choose LendKaki for Your Bridging Loan</h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">We make securing your bridging loan fast, simple, and free.</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {benefits.map((benefit, i) => (
              <motion.div key={benefit.title} initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={benefitsInView ? { opacity: 1, scale: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }} className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20"><benefit.icon className="h-6 w-6 text-primary" /></div>
                <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section ref={calcRef} className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={calcInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-8 text-center sm:mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Bridging Loan Calculator</h2>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">Estimate your monthly repayments before you apply.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={calcInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8">
            <div className="space-y-8">
              <SliderField icon={DollarSign} label="Loan Amount" value={loanAmount} displayValue={fmtWhole.format(loanAmount)} min={1000} max={100000} step={1000} minLabel="$1,000" maxLabel="≥ $100,000" onChange={setLoanAmount} />
              <SliderField icon={Calendar} label="Tenure" value={tenure} displayValue={`${tenure} month${tenure === 1 ? "" : "s"}`} min={1} max={24} step={1} minLabel="1 month" maxLabel="≥ 24 months" onChange={setTenure} />
              <SliderField icon={Percent} label="Interest Rate (p.a.)" value={interestRate} displayValue={`${interestRate.toFixed(1)}%`} min={1} max={48} step={0.1} minLabel="1%" maxLabel="48%" onChange={setInterestRate} />
            </div>
            <div className="my-8 border-t border-border" />
            <div className="space-y-6">
              <div className="rounded-xl bg-primary/5 p-5 text-center sm:p-6">
                <p className="text-sm font-medium text-muted-foreground">Monthly Instalment</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-primary sm:text-5xl">{fmt.format(calcResults.monthly)}</p>
                <p className="mt-1 text-xs text-muted-foreground">per month</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[{ label: "Principal", value: fmt.format(loanAmount) }, { label: "Total Interest", value: fmt.format(calcResults.totalInterest) }, { label: "Total Payable", value: fmt.format(calcResults.totalPayable) }].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-border bg-slate-50 p-4 text-center"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-1 text-lg font-bold text-foreground tabular-nums">{value}</p></div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex h-4 w-full overflow-hidden rounded-full">
                  <div className="bg-primary transition-all duration-300" style={{ width: `${100 - interestPct}%` }} />
                  <div className="bg-primary/30 transition-all duration-300" style={{ width: `${interestPct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />Principal ({(100 - interestPct).toFixed(1)}%)</div>
                  <div className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-primary/30" />Interest ({interestPct.toFixed(1)}%)</div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="mt-8 text-center">
            <Button onClick={scrollToForm} size="lg" className="h-12 gap-2 bg-primary px-8 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 sm:text-base">Apply Now (Free)<ArrowRight className="h-4 w-4" /></Button>
          </div>
          <p className="mt-6 text-center text-[10px] leading-relaxed text-muted-foreground sm:text-xs">This calculator provides indicative estimates only and does not constitute a loan offer. Actual bridging loan terms, interest rates, and monthly instalments may vary depending on the lender and your financial profile.</p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section ref={testimonialsRef} className="bg-slate-900 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={testimonialsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-8 text-center sm:mb-10">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Real Results from Real Homeowners</h2>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">Join hundreds of Singaporeans who secured their bridging loans with us.</p>
          </motion.div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 15 }} animate={testimonialsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.1 + i * 0.12 }} className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-1">{[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-sm leading-relaxed text-slate-300">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <img src={t.image} alt={t.name} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                    {testimonialDates[i] && <p className="mt-0.5 text-[10px] text-slate-500">{testimonialDates[i]}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Bridging Loan FAQs</h2>
            <p className="mt-2 text-base text-muted-foreground">Everything you need to know about bridging loans in Singapore.</p>
          </div>
          <div className="space-y-2">{faqItems.map((item, index) => <FaqItem key={index} question={item.question} answer={item.answer} index={index} />)}</div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section ref={ctaRef} className="hero-gradient py-14 sm:py-20">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Need a Bridging Loan Fast?</h2>
          <p className="mt-3 text-sm text-slate-900/70 sm:text-base">Compare bridging loan rates from 20+ lenders in 60 seconds. It&apos;s 100% free.</p>
          <Button onClick={scrollToForm} size="lg" className="mt-6 h-12 gap-2 bg-primary px-8 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 sm:text-base">Compare Rates Now<ArrowRight className="h-4 w-4" /></Button>
        </motion.div>
      </section>

      {/* STICKY MOBILE CTA */}
      <AnimatePresence>
        {showStickyCta && !isSuccess && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ duration: 0.3 }} className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
            <Button onClick={scrollToForm} className="h-12 w-full gap-2 bg-primary text-sm font-semibold text-white shadow-lg hover:bg-primary/90">Get My Bridging Loan Rates<ArrowRight className="h-4 w-4" /></Button>
          </motion.div>
        )}
      </AnimatePresence>

      <MatchingModal isOpen={showMatching} onComplete={() => { setShowMatching(false); setIsSuccess(true); }} />
      <PolicyModal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms of Use"><TermsContent /></PolicyModal>
      <PolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy"><PrivacyContent /></PolicyModal>
    </>
  );
}
