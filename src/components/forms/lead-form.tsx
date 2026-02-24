"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Check } from "lucide-react";
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

const valueProps = [
  "Fast, Easy Application Process",
  "Secure Match with Trusted Lenders",
  "No Hidden Fees, Full Transparency",
  "Dedicated Customer Support",
];

export function LeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

  if (isSuccess) {
    return (
      <section ref={successRef} id="apply" className="relative overflow-hidden scroll-mt-14 bg-gradient-to-br from-primary/10 via-primary/5 to-background py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-border bg-white p-8 text-center shadow-xl sm:p-12"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Application Submitted!
            </h3>
            <p className="mt-3 text-base text-slate-600">
              We are matching you with our pool of approved lenders.
            </p>
            <div className="mt-5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 px-6 py-5">
              <p className="text-lg font-bold text-[#128C7E] sm:text-xl">
                📲 You will receive a match to a lender via WhatsApp very soon!
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
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
              <span className="text-lg font-bold text-white">50+</span>
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
                    <a href="/terms" className="font-medium text-primary hover:underline">
                      Terms of Use
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="font-medium text-primary hover:underline">
                      Privacy Policy
                    </a>
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
  );
}
