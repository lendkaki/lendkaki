"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  Pencil,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MatchingModal } from "@/components/ui/matching-modal";
import { loanPurposeOptions } from "@/lib/loan-data";
import { quickLeadSchema, type QuickLeadValues } from "@/lib/schemas";
import { submitLeadInBackground } from "@/lib/api/leads";
import { cn } from "@/lib/utils";
import { MYINFO_CODE_LABELS, formatAddress } from "@/lib/myinfo/codes";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby2hR6rxThjW8CIjpMDtlWePt9HI96GUivfMMkumu1xah6fwDLjSOzHY8Kh70tIt9yj/exec";

const trustBadges = [
  { icon: Users, label: "20+ Licensed Lenders", sub: "MAS & MinLaw regulated" },
  { icon: Clock, label: "Same-Day Approval", sub: "Funds within 24 hours" },
  { icon: Shield, label: "Zero Credit Impact", sub: "Soft checks only" },
  { icon: BadgeCheck, label: "100% Free", sub: "No hidden fees ever" },
];

const headlineVariants: Record<
  string,
  { before: string; highlight?: string; after?: string; subheadline: string }
> = {
  default: {
    before: "Get Your Best Loan Rate in",
    highlight: "Minutes",
    after: "",
    subheadline:
      "One simple form. Matched to 20+ licensed lenders and banks. No obligation.",
  },
};

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

function randomRecentDate(): string {
  const msIn30Days = 30 * 24 * 60 * 60 * 1000;
  const date = new Date(Date.now() - Math.random() * msIn30Days);
  return date.toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ApplyReviewPage() {
  const router = useRouter();
  const { before, highlight, after, subheadline } = headlineVariants.default;

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [myinfo, setMyinfo] = useState<any | null>(null);
  const [customerProfileId, setCustomerProfileId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuickLeadValues>({
    resolver: zodResolver(quickLeadSchema),
    mode: "onTouched",
    defaultValues: {
      agreedToTerms: false,
    },
  });

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (!res.ok) {
          if (!cancelled) router.replace("/apply");
          return;
        }
        const json = await res.json();
        if (!cancelled) {
          setMyinfo(json);

          const profile = (json as any).profile;
          if (profile) {
            if (profile.id) setCustomerProfileId(profile.id);
            if (profile.loan_amount != null) setValue("amount", Number(profile.loan_amount));
            if (profile.loan_purpose) setValue("purpose", profile.loan_purpose as any);
            if (profile.name) setValue("name", profile.name);
            if (profile.email) setValue("email", profile.email);
            if (profile.mobileno) setValue("phone", profile.mobileno);

            const res_status = (profile.residential_status ?? "").toUpperCase();
            const isForeigner = res_status === "A";
            setValue("nationality", isForeigner ? "foreigner" : "Singaporean_PR");
          } else {
            // Fallback for old sessions without customer_profiles
            const amount = (json as any).loan_amount;
            const purpose = (json as any).loan_purpose;
            if (amount != null && !Number.isNaN(Number(amount))) setValue("amount", Number(amount));
            if (purpose) setValue("purpose", purpose as any);

            const person = (json as any).person_info ?? json;
            const fullName = (person?.name as any)?.value ?? null;
            const email =
              (person?.email as any)?.value ??
              (person?.emailaddress as any)?.value ??
              null;
            const mobile =
              (person?.mobileno as any)?.nbr?.value ??
              (person?.mobileno as any)?.value ??
              null;

            if (fullName) setValue("name", fullName);
            if (email) setValue("email", email);
            if (mobile) setValue("phone", mobile);

            const natDesc = ((person?.nationality as any)?.desc ?? "").toLowerCase();
            const isForeigner = natDesc && !natDesc.includes("singapore");
            setValue("nationality", isForeigner ? "foreigner" : "Singaporean_PR");
          }
        }
      } catch {
        if (!cancelled) router.replace("/apply");
        return;
      } finally {
        if (!cancelled) setCheckingAuth(false);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [router, setValue]);

  const [testimonialDates, setTestimonialDates] = useState<string[]>([]);
  useEffect(() => {
    setTestimonialDates(testimonials.map(() => randomRecentDate()));
  }, []);


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMatching, setShowMatching] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(true);
  const submitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted || typeof window === "undefined") return;
    const el = submitRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowScrollBtn(!entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [submitted, myinfo]);

  const onSubmit = (data: QuickLeadValues) => {
    setIsSubmitting(true);
    setShowMatching(true);
    setIsSubmitting(false);

    submitLeadInBackground(data, {
      landing_page:
        typeof window !== "undefined" ? window.location.pathname : "/apply-review",
      customer_profile_id: customerProfileId ?? undefined,
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
        purpose:
          loanPurposeOptions.find((o) => o.value === data.purpose)?.label ?? data.purpose,
        nationality: data.nationality === "foreigner" ? "Foreigner" : "Singaporean_PR",
        landingpage: typeof window !== "undefined" ? window.location.pathname : "",
      }),
    });
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Loading your Singpass session…</span>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="Go to home page"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3673ae]">
              <span className="font-[family-name:var(--font-vampiro)] text-sm text-white">
                LK
              </span>
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

      <section className="hero-gradient relative overflow-hidden pt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 pb-12 pt-10 sm:pb-16 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pb-12 lg:pt-10">
            <div className="hidden flex-col lg:flex">
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

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6 flex items-center justify-between gap-3 sm:mt-8 sm:justify-start lg:block"
              >
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

                <motion.img
                  src="/images/otter point down.webp"
                  alt="LendKaki mascot"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: 0.35 }}
                  className="mr-4 w-24 shrink-0 object-contain drop-shadow-md sm:mr-6 sm:w-28 lg:hidden"
                />
              </motion.div>

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

              <motion.img
                src="/images/otter point right.webp"
                alt="LendKaki mascot"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 hidden w-56 self-center object-contain drop-shadow-lg lg:block xl:w-64"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="w-full"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={submitted
                  ? "relative overflow-hidden rounded-2xl"
                  : "relative overflow-hidden rounded-2xl bg-white/95 p-6 shadow-2xl ring-1 ring-slate-900/5 sm:p-7"
                }
              >
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-2xl bg-[#0f1b3d] px-6 py-8 text-center shadow-2xl sm:px-10 sm:py-10"
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Singpass verified
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      Review & submit your application
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Your details were retrieved via Myinfo. Review everything below before submitting.
                    </p>
                  </div>


                  {(() => {
                    const p = (myinfo as any)?.profile;
                    if (!p) return (
                      <p className="text-xs text-slate-500">No profile data available.</p>
                    );

                    const Row = ({ label, value }: { label: string; value: string }) => (
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 py-1.5 last:border-0">
                        <span className="shrink-0 text-[11px] font-medium text-slate-400">{label}</span>
                        <span className="text-right text-[11px] font-semibold text-slate-800">{value || "—"}</span>
                      </div>
                    );

                    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
                      <div className="rounded-lg bg-slate-50/80 p-3">
                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{title}</p>
                        {children}
                      </div>
                    );

                    const rc = (cat: string, code: string | null) =>
                      MYINFO_CODE_LABELS[cat]?.[code ?? ""] ?? code ?? "—";

                    const cpfObj = p.cpf_contributions as Record<string, unknown> | null;
                    const cpf = (cpfObj?.history ?? cpfObj) as any[] | null;
                    const noa = p.noa_basic as Record<string, unknown> | null;
                    const vehicles = p.vehicles as any[] | null;
                    const hdbown = p.hdbownership as any[] | null;
                    const isForeigner = (p.residential_status ?? "").toUpperCase() === "A";

                    return (
                      <div className="space-y-3 lg:max-h-[60vh] lg:overflow-y-auto lg:pr-1">
                        {/* Contact — editable fields first */}
                        <Section title="Contact Details">
                          <p className="mb-2 text-[10px] text-slate-400">Tap the fields below to update if needed.</p>
                          <div className="flex items-center justify-between gap-2 border-b border-slate-100 py-1.5">
                            <span className="shrink-0 text-[11px] font-medium text-slate-400">Mobile</span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="tel"
                                className="w-36 rounded-md border border-slate-200 bg-white px-2 py-1 text-right text-[11px] font-semibold text-slate-800 shadow-sm transition-colors hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-48"
                                {...register("phone")}
                              />
                              <Pencil className="h-3 w-3 shrink-0 text-primary/40" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2 border-b border-slate-100 py-1.5">
                            <span className="shrink-0 text-[11px] font-medium text-slate-400">Email</span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="email"
                                className="w-36 rounded-md border border-slate-200 bg-white px-2 py-1 text-right text-[11px] font-semibold text-slate-800 shadow-sm transition-colors hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-48"
                                {...register("email")}
                              />
                              <Pencil className="h-3 w-3 shrink-0 text-primary/40" />
                            </div>
                          </div>
                          <Row label="Registered Address" value={formatAddress(p.regadd)} />
                        </Section>

                        {/* Identity */}
                        <Section title="Identity">
                          <Row label="NRIC / FIN" value={p.uinfin ?? "—"} />
                          <Row label="Full Name" value={p.name ?? "—"} />
                          <Row label="Alias" value={p.aliasname ?? "—"} />
                          <Row label="Hanyu Pinyin" value={p.hanyupinyinname ?? "—"} />
                          <Row label="Hanyu Pinyin (Alias)" value={p.hanyupinyinaliasname ?? "—"} />
                          <Row label="Married Name" value={p.marriedname ?? "—"} />
                          <Row label="Date of Birth" value={p.dob ?? "—"} />
                          <Row label="Sex" value={rc("sex", p.sex)} />
                          <Row label="Race" value={p.race ?? "—"} />
                          <Row label="Nationality" value={p.nationality ?? "—"} />
                          <Row label="Country of Birth" value={p.birthcountry ?? "—"} />
                          <Row label="Residential Status" value={rc("residential", p.residential_status)} />
                          <Row label="Marital Status" value={rc("marital", p.marital_status)} />
                        </Section>

                        {/* Housing */}
                        <Section title="Housing">
                          <Row label="Housing Type (Private)" value={p.housingtype ? rc("housingtype", p.housingtype) : "—"} />
                          <Row label="HDB Type" value={p.hdbtype ? rc("hdbtype", p.hdbtype) : "—"} />
                          <div className="mt-1 space-y-1">
                            <p className="text-[10px] font-semibold text-slate-500">HDB Ownership</p>
                            {hdbown && hdbown.length > 0 ? (
                              hdbown.map((h: any, i: number) => {
                                const hVal = (key: string) => {
                                  const v = h[key];
                                  if (v == null) return "—";
                                  return typeof v === "object" ? (v.value ?? v.code ?? "—") : String(v);
                                };
                                return (
                                  <div key={i} className="rounded border border-slate-200 bg-white p-2 text-[10px]">
                                    <Row label="Type" value={rc("hdbtype", typeof h.hdbtype === "object" ? h.hdbtype?.code : h.hdbtype)} />
                                    <Row label="Date of Purchase" value={hVal("dateofpurchase")} />
                                    <Row label="Monthly Instalment" value={hVal("monthlyloaninstalment") !== "—" ? `$${Number(hVal("monthlyloaninstalment")).toLocaleString()}` : "—"} />
                                    <Row label="Outstanding Loan" value={hVal("outstandingloanbalance") !== "—" ? `$${Number(hVal("outstandingloanbalance")).toLocaleString()}` : "—"} />
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-[10px] text-slate-400">No HDB ownership records.</p>
                            )}
                          </div>
                          <Row label="Owns Private Property" value={p.ownerprivate === true ? "Yes" : p.ownerprivate === false ? "No" : "—"} />
                        </Section>

                        {/* Employment */}
                        <Section title="Employment">
                          <Row label="Employment" value={p.employment ?? "—"} />
                          <Row label="Sector" value={p.employmentsector ?? "—"} />
                          <Row label="Occupation" value={p.occupation ?? "—"} />
                        </Section>

                        {/* Pass Info (applicable for foreigners / FIN holders) */}
                        <Section title="Pass Information">
                          <Row label="Pass Type" value={rc("passtype", p.passtype)} />
                          <Row label="Pass Status" value={p.passstatus ?? "—"} />
                          <Row label="Expiry Date" value={p.passexpirydate ?? "—"} />
                          {!isForeigner && !p.passtype && (
                            <p className="mt-0.5 text-[10px] text-slate-400">Not applicable for Citizens / PRs.</p>
                          )}
                        </Section>

                        {/* NOA */}
                        <Section title="Notice of Assessment">
                          {(() => {
                            if (!noa) return (
                              <p className="text-[10px] text-slate-400">
                                Not available. This may be due to a default assessment, pending tax filing, or foreign tax residency.
                              </p>
                            );
                            const noaList = (noa.noas ?? noa.noahistory) as any[] | undefined;
                            if (noaList && Array.isArray(noaList) && noaList.length > 0) {
                              return (
                                <div className="space-y-2">
                                  {noaList.map((entry: any, i: number) => {
                                    const year = entry.yearofassessment?.value ?? entry.yearofassessment ?? "—";
                                    const amount = entry.amount?.value ?? entry.amount ?? 0;
                                    return (
                                      <div key={i} className="rounded border border-slate-200 bg-white p-2 text-[10px]">
                                        <Row label="Year of Assessment" value={String(year)} />
                                        <Row label="Assessable Income" value={`$${Number(amount).toLocaleString()}`} />
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            }
                            return (
                              <>
                                {Object.entries(noa).map(([key, val]) => {
                                  if (key === "source" || key === "classification" || key === "lastupdated") return null;
                                  const display = typeof val === "object" && val !== null && "value" in (val as any) ? String((val as any).value) : String(val ?? "—");
                                  const label = key === "amount" ? "Assessable Income" : key === "yearofassessment" ? "Year of Assessment" : key;
                                  return <Row key={key} label={label} value={key === "amount" ? `$${Number(display).toLocaleString()}` : display} />;
                                })}
                              </>
                            );
                          })()}
                        </Section>

                        {/* CPF Contributions */}
                        <Section title="CPF Contributions">
                          {cpf && cpf.length > 0 ? (
                            <div className="lg:max-h-32 lg:overflow-y-auto">
                              <table className="w-full text-[10px]">
                                <thead>
                                  <tr className="border-b border-slate-200 text-left">
                                    <th className="py-1 pr-2 font-semibold text-slate-500">Month</th>
                                    <th className="py-1 pr-2 font-semibold text-slate-500">Employer</th>
                                    <th className="py-1 text-right font-semibold text-slate-500">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cpf.map((c: any, i: number) => {
                                    const month = c.month?.value ?? c.month ?? "—";
                                    const employer = c.employer?.value ?? c.employer ?? "—";
                                    const amount = c.amount?.value ?? c.amount ?? 0;
                                    return (
                                      <tr key={i} className="border-b border-slate-100 last:border-0">
                                        <td className="whitespace-nowrap py-1 pr-2 text-slate-400">{month}</td>
                                        <td className="truncate py-1 pr-2 text-slate-600">{employer}</td>
                                        <td className="whitespace-nowrap py-1 text-right font-semibold text-slate-800">${Number(amount).toLocaleString()}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-400">Not available for this profile.</p>
                          )}
                        </Section>

                        {/* CPF Housing Withdrawal */}
                        <Section title="CPF Housing Withdrawal">
                          {(() => {
                            const hw = p.cpf_housing_withdrawal as Record<string, unknown> | null;
                            const details = (hw?.withdrawaldetails ?? []) as any[];
                            if (!hw || details.length === 0)
                              return <p className="text-[10px] text-slate-400">Not available for this profile.</p>;
                            return (
                              <div className="space-y-2">
                                {details.map((d: any, i: number) => {
                                  const addr = d.address;
                                  const addrStr = addr
                                    ? [addr.block?.value, addr.street?.value, addr.floor?.value ? `#${addr.floor?.value}-${addr.unit?.value ?? ""}` : null, `S(${addr.postal?.value})`].filter(Boolean).join(" ")
                                    : "—";
                                  return (
                                    <div key={i} className="rounded border border-slate-200 bg-white p-2 text-[10px]">
                                      <Row label="Property" value={addrStr} />
                                      <Row label="Principal Withdrawn" value={`$${Number(d.principalwithdrawalamt?.value ?? 0).toLocaleString()}`} />
                                      <Row label="Accrued Interest" value={`$${Number(d.accruedinterestamt?.value ?? 0).toLocaleString()}`} />
                                      <Row label="Monthly Instalment" value={`$${Number(d.monthlyinstalmentamt?.value ?? 0).toLocaleString()}`} />
                                      <Row label="Total CPF Allowed" value={`$${Number(d.totalamountofcpfallowedforproperty?.value ?? 0).toLocaleString()}`} />
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </Section>

                        {/* Vehicles */}
                        <Section title="Vehicle Ownership">
                          {vehicles && vehicles.length > 0 ? (
                            vehicles.map((v: any, i: number) => {
                              const make = v.make?.value ?? v.make ?? "—";
                              const model = v.model?.value ?? v.model ?? "";
                              const ownership = v.effectiveownership?.value ?? v.effectiveownership ?? "—";
                              return (
                                <div key={i} className="rounded border border-slate-200 bg-white p-2 text-[10px]">
                                  <Row label="Vehicle" value={`${make} ${model}`.trim()} />
                                  <Row label="Effective Ownership" value={String(ownership)} />
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-[10px] text-slate-400">No registered vehicles.</p>
                          )}
                        </Section>

                        {/* Loan Request */}
                        <Section title="Loan Request">
                          <Row label="Amount" value={`$${Number(p.loan_amount ?? 0).toLocaleString()}`} />
                          <Row label="Purpose" value={loanPurposeOptions.find((o) => o.value === p.loan_purpose)?.label ?? p.loan_purpose ?? "—"} />
                        </Section>

                        {/* Raw Myinfo JSON (debug) — hidden for now
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/80 p-3">
                          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Raw Myinfo Payload (from Singpass)</p>
                          <pre className="max-h-48 overflow-auto rounded bg-slate-900/95 p-3 text-[10px] leading-snug text-slate-100">
{JSON.stringify(p?.raw ?? null, null, 2)}
                          </pre>
                        </div> */}

                        {/* Parsed customer profile (debug) — hidden for now
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/80 p-3">
                          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Parsed Customer Profile (from DB)</p>
                          <pre className="max-h-48 overflow-auto rounded bg-slate-900/95 p-3 text-[10px] leading-snug text-slate-100">
{JSON.stringify(p, null, 2)}
                          </pre>
                        </div> */}
                      </div>
                    );
                  })()}

                  <input type="hidden" {...register("name")} />
                  <input type="hidden" {...register("nationality")} />

                  <div ref={submitRef}>
                    <label className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-primary"
                        {...register("agreedToTerms")}
                      />
                      <span className="text-xs leading-relaxed text-slate-500">
                        By proceeding the application, I agree to LendKaki&apos;s{" "}
                        <button type="button" className="font-medium text-primary hover:underline">Terms of Use</button>{" "}
                        and{" "}
                        <button type="button" className="font-medium text-primary hover:underline">Privacy Policy</button>
                        , and consent to receive marketing messages.
                      </span>
                    </label>
                    {errors.agreedToTerms && (
                      <p className="mt-1 text-xs font-medium text-red-500">{errors.agreedToTerms.message}</p>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4">
                      <Button
                        type="submit"
                        className="gap-2 rounded-full px-6"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting…
                          </>
                        ) : (
                          <>
                            Submit application
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating scroll-to-submit button — mobile only, hides when submit area is visible */}
      <AnimatePresence>
        {!submitted && showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            type="button"
            onClick={() => submitRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform active:scale-95 lg:hidden"
          >
            Confirm & Submit
            <ChevronDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <section className="border-y border-border/50 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 sm:h-12 sm:w-12">
                  <badge.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground sm:text-base">{badge.label}</p>
                  <p className="text-[10px] text-muted-foreground sm:text-xs">{badge.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5 sm:p-6"
              >
                <div className="mb-3 flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-300">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <img src={t.image} alt={t.name} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                    {testimonialDates[i] && (
                      <p className="mt-0.5 text-[10px] text-slate-500">{testimonialDates[i]}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="mb-6 text-center text-2xl font-bold text-foreground sm:mb-8 sm:text-3xl">
            Common Questions
          </h2>
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <FaqItem key={index} question={item.question} answer={item.answer} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="hero-gradient py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Ready to find your best rate?
          </h2>
          <p className="mt-3 text-sm text-slate-900/70 sm:text-base">
            Join thousands of Singaporeans who save on their loans every month.
          </p>
          <Button
            onClick={() => router.push("/apply")}
            size="lg"
            className="mt-6 h-12 gap-2 bg-primary px-8 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 sm:text-base"
          >
            Get My Best Rates
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <footer className="border-t border-border bg-slate-900 px-4 py-6 sm:px-6">
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

      <MatchingModal
        isOpen={showMatching}
        onComplete={() => {
          setShowMatching(false);
          setSubmitted(true);
        }}
      />
    </div>
  );
}

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
          className="shrink-0"
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
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
          >
            <div className="px-4 pb-3.5 pt-1 sm:px-5 sm:pb-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
