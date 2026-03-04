"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Loader2, Check } from "lucide-react";
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
import { PolicyModal } from "@/components/ui/policy-modal";
import { MatchingModal } from "@/components/ui/matching-modal";
import { TermsContent } from "@/components/content/terms-content";
import { PrivacyContent } from "@/components/content/privacy-content";

const valueProps = [
  "Fast, Easy Application Process",
  "Secure Match with Trusted Lenders",
  "No Hidden Fees, Full Transparency",
  "Dedicated Customer Support",
];

export function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showMatching, setShowMatching] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isSuccess && successRef.current) {
      successRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby2hR6rxThjW8CIjpMDtlWePt9HI96GUivfMMkumu1xah6fwDLjSOzHY8Kh70tIt9yj/exec";

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

      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead", {
          content_name: "Loan Application",
          content_category: "Lead Form",
        });
      }

      setShowMatching(true);
    } catch {
      setError("root", {
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section ref={successRef} id="apply" className="relative overflow-hidden scroll-mt-14 bg-gradient-to-br from-primary/10 via-primary/5 to-background py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
          <motion.div
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
        </div>
      </section>
    );
  }

  return (
    <>
    <section
      id="apply"
      ref={sectionRef}
      className="relative overflow-hidden scroll-mt-14 bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
        >
          {/* Left: Marketing content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5"
            >
              <span className="text-lg font-bold text-white">20+</span>
              <span className="text-sm font-medium text-white/80">
                Trusted Lenders to Choose From
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            >
              Explore Your Personal Loan Options Now
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-8 space-y-4 sm:mt-10"
            >
              {valueProps.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -15 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 justify-center lg:justify-start"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-base font-medium text-slate-800">
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Form card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8"
            >
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <Label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Name
                  </Label>
                  <input
                    id="fullName"
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
                  <Label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Mobile Number
                  </Label>
                  <input
                    id="phone"
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
                  <Label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email Address
                  </Label>
                  <input
                    id="email"
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
                  <Label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Desired Loan Amount
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                      $
                    </span>
                    <input
                      id="amount"
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
          </motion.div>
        </motion.div>
      </div>
    </section>

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
    </>
  );
}
