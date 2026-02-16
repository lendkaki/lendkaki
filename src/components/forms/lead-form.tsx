"use client";

import { useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
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
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export function LeadForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      loanAmount: 20000,
      tenure: 24,
    },
    mode: "onTouched",
  });

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
        body: JSON.stringify(data),
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

  if (isSuccess) {
    return (
      <section id="apply" className="hero-gradient py-16 sm:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto w-full rounded-2xl border border-white/10 bg-card p-8 text-center shadow-2xl sm:p-12 lg:p-14"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
              Application Submitted!
            </h3>
            <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">
              We&apos;re matching you with the best loan offers from our network
              of 50+ licensed lenders. You&apos;ll receive your personalized
              rates via email within minutes.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="apply" className="hero-gradient py-16 sm:py-24 lg:py-32" ref={sectionRef}>
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col items-center text-center sm:mb-10"
        >
          <span className="mb-3 inline-flex rounded-full bg-primary/20 px-4 py-1.5 text-xs font-medium text-white">
            Loan Application
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Get Your Best Rates
          </h2>
          <p className="mt-3 max-w-lg text-base text-white/70 sm:mt-4 sm:text-lg">
            Complete this quick form to receive personalized loan offers from Singapore's leading lenders.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto w-full rounded-2xl border border-white/10 bg-card p-6 shadow-2xl sm:p-8 lg:p-10"
        >
          {/* Singpass Button */}
          <div className="mb-8">
            <SingpassButton />
            <div className="relative my-6">
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

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="mx-auto flex max-w-md items-center justify-center">
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
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                        index <= currentStep
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        step.id
                      )}
                    </motion.div>
                    <span className="mt-2 hidden text-center text-xs font-medium sm:block">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 rounded transition-colors ${
                        index < currentStep ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Title */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              {steps[currentStep].title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Form Steps */}
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

              {/* Error */}
              {methods.formState.errors.root && (
                <p className="mt-4 text-sm text-destructive">
                  {methods.formState.errors.root.message}
                </p>
              )}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
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
                  <Button type="button" onClick={goToNext} className="gap-2">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2"
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
        </motion.div>

        {/* Privacy note */}
        <p className="mt-6 text-center text-xs leading-relaxed text-white/50 sm:text-sm">
          Your data is encrypted and secure. We never share your information
          without your consent. By submitting, you agree to our Terms of Service
          and Privacy Policy.
        </p>
      </div>
    </section>
  );
}
