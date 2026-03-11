 "use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { loanPurposeOptions } from "@/lib/loan-data";
import { quickLeadSchema, type QuickLeadValues } from "@/lib/schemas";
import { submitLeadInBackground } from "@/lib/api/leads";
import { cn } from "@/lib/utils";

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

function randomRecentDate(): string {
  const msIn30Days = 30 * 24 * 60 * 60 * 1000;
  const date = new Date(Date.now() - Math.random() * msIn30Days);
  return date.toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ApplyNowExpressReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const variant = searchParams.get("v") || "default";
  const { before, highlight, after, subheadline } =
    headlineVariants[variant] || headlineVariants.default;

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [myinfo, setMyinfo] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuickLeadValues>({
    resolver: zodResolver(quickLeadSchema),
    mode: "onTouched",
    defaultValues: {
      agreedToTerms: false,
    },
  });

  const formatSummaryValue = (v: unknown): string => {
    if (v === undefined || v === null || v === "") return "—";
    if (typeof v === "string" || typeof v === "number") return String(v);
    return JSON.stringify(v);
  };

  useEffect(() => {
    const amountParam = searchParams.get("amount");
    const purposeParam = searchParams.get("purpose");
    if (amountParam) {
      const n = Number(amountParam);
      if (!Number.isNaN(n)) setValue("amount", n);
    }
    if (purposeParam) {
      setValue("purpose", purposeParam as any);
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (!res.ok) {
          if (!cancelled) router.replace("/apply-now-express");
          return;
        }
        const json = await res.json();
        if (!cancelled) {
          setMyinfo(json);
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

          // Singpass users are always SG citizens/PRs
          const natDesc = ((person?.nationality as any)?.desc ?? "").toLowerCase();
          const isForeigner = natDesc && !natDesc.includes("singapore");
          setValue("nationality", isForeigner ? "foreigner" : "Singaporean_PR");
        }
      } catch {
        if (!cancelled) router.replace("/apply-now-express");
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
    setTestimonialDates(trustBadges.map(() => randomRecentDate()));
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data: QuickLeadValues) => {
    setIsSubmitting(true);

    submitLeadInBackground(data, {
      landing_page:
        typeof window !== "undefined" ? window.location.pathname : "/apply-now-express-review",
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

    setSubmitted(true);
    setIsSubmitting(false);
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

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Application submitted!</h2>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            Thank you! We&apos;re matching you with the best lenders now. You&apos;ll hear from us within 24 hours.
          </p>
          <Button
            className="mt-4 gap-2 rounded-full px-6"
            onClick={() => router.push("/")}
          >
            Back to home
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
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

            {/* Right: Review Card instead of multi-step form */}
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
                className="relative overflow-hidden rounded-2xl bg-white/95 p-6 shadow-2xl ring-1 ring-slate-900/5 sm:p-7"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Express flow
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      Review & submit your application
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      We&apos;ve pulled your details from Singpass. Confirm they look correct before
                      submitting.
                    </p>
                  </div>

                  <div className="space-y-2.5 rounded-xl bg-slate-50 p-4">
                    {[
                      {
                        label: "Loan Amount",
                        value: `$${Number(
                          (watch("amount") as number | undefined) ?? 0
                        ).toLocaleString()}`,
                      },
                      {
                        label: "Purpose",
                        value:
                          loanPurposeOptions.find(
                            (o) => o.value === (watch("purpose") as string | undefined)
                          )?.label ?? "—",
                      },
                      { label: "Name", value: watch("name") },
                      { label: "Email", value: watch("email") },
                      { label: "Phone", value: watch("phone") },
                      {
                        label: "Nationality",
                        value: watch("nationality") === "foreigner" ? "Foreigner" : "Singaporean / PR",
                      },
                    ].map(({ label, value }, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 * i, duration: 0.25 }}
                        className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 last:border-0 last:pb-0"
                      >
                        <span className="text-xs font-medium text-slate-500">{label}</span>
                        <span className="text-sm font-semibold text-slate-900">
                          {formatSummaryValue(value)}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Editable fields for name/email/phone to keep UX cohesive */}
                  <div className="space-y-3 rounded-xl border border-slate-200 bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Edit your contact details
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Full name
                        </label>
                        <input
                          type="text"
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="mt-1 text-[11px] font-medium text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Mobile number
                        </label>
                        <input
                          type="tel"
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          {...register("phone")}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-[11px] font-medium text-red-500">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600">
                          Email address
                        </label>
                        <input
                          type="email"
                          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-xs shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="mt-1 text-[11px] font-medium text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <input type="hidden" {...register("nationality")} />

                  <div>
                    <label className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-primary"
                        {...register("agreedToTerms")}
                      />
                      <span className="text-xs leading-relaxed text-slate-500">
                        By proceeding the application, I agree to LendKaki&apos;s{" "}
                        <button
                          type="button"
                          className="font-medium text-primary hover:underline"
                        >
                          Terms of Use
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          className="font-medium text-primary hover:underline"
                        >
                          Privacy Policy
                        </button>
                        , and consent to receive marketing messages.
                      </span>
                    </label>
                    {errors.agreedToTerms && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {errors.agreedToTerms.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Myinfo profile (from Singpass)
                    </p>
                    {!myinfo && (
                      <p className="text-xs text-slate-500">
                        We could not show your Myinfo payload. You can still submit, but we
                        recommend re-starting the Singpass flow if this persists.
                      </p>
                    )}
                    {myinfo && (
                      <pre className="max-h-56 overflow-auto rounded bg-slate-900/95 p-3 text-[11px] leading-snug text-slate-100">
{JSON.stringify((myinfo as any).person_info ?? myinfo, null, 2)}
                      </pre>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
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
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

