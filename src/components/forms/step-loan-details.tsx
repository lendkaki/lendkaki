"use client";
"use no memo";

import { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loanPurposeOptions } from "@/lib/loan-data";
import type { LeadFormValues } from "@/lib/schemas";

export function StepLoanDetails() {
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<LeadFormValues>();

  const [loanAmount, setLoanAmount] = useState(
    () => getValues("loanAmount") || 20000
  );
  const [tenure, setTenure] = useState(() => getValues("tenure") || 24);

  const handleLoanAmountChange = useCallback(
    (value: number[]) => {
      const amount = value[0];
      setLoanAmount(amount);
      setValue("loanAmount", amount, { shouldDirty: true });
    },
    [setValue]
  );

  const handleTenureChange = useCallback(
    (value: number[]) => {
      const months = value[0];
      setTenure(months);
      setValue("tenure", months, { shouldDirty: true });
    },
    [setValue]
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Loan Amount Slider */}
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between">
          <Label className="text-sm font-medium">Loan Amount</Label>
          <span className="font-mono text-3xl font-bold text-primary sm:text-2xl">
            ${loanAmount.toLocaleString("en-SG")}
          </span>
        </div>
        <Slider
          min={1000}
          max={300000}
          step={1000}
          value={[loanAmount]}
          onValueChange={handleLoanAmountChange}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$1,000</span>
          <span>$300,000</span>
        </div>
        {errors.loanAmount && (
          <p className="text-sm text-destructive">
            {errors.loanAmount.message}
          </p>
        )}
      </div>

      {/* Loan Purpose */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Purpose of Loan</Label>
        <div
          className={`flex h-11 items-center overflow-hidden rounded-full border border-border bg-background pl-3 transition-all focus-within:ring-2 focus-within:ring-primary/30 ${
            errors.loanPurpose ? "border-destructive focus-within:ring-destructive/30" : ""
          }`}
        >
          <svg className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 5.333v5.334a2.67 2.67 0 0 1-2.667 2.666H4.667A2.67 2.67 0 0 1 2 10.667V5.333m12 0A2.67 2.67 0 0 0 11.333 2.667H4.667A2.67 2.67 0 0 0 2 5.333m12 0v.334c0 .589-.239 1.153-.664 1.569l-2.003 1.953a1.33 1.33 0 0 1-1.853 0L8 7.764 6.52 9.189a1.33 1.33 0 0 1-1.853 0L2.664 7.236A2.22 2.22 0 0 1 2 5.667v-.334" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <Select
            onValueChange={(value) =>
              setValue("loanPurpose", value as LeadFormValues["loanPurpose"], {
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger className="h-full w-full border-0 bg-transparent px-2 shadow-none focus:ring-0">
              <SelectValue placeholder="Select loan purpose" />
            </SelectTrigger>
            <SelectContent>
              {loanPurposeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.loanPurpose && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.loanPurpose.message}
          </p>
        )}
      </div>

      {/* Tenure Slider */}
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between">
          <Label className="text-sm font-medium">Repayment Tenure</Label>
          <span className="font-mono text-xl font-semibold text-foreground sm:text-lg">
            {tenure} months
          </span>
        </div>
        <Slider
          min={3}
          max={72}
          step={3}
          value={[tenure]}
          onValueChange={handleTenureChange}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>3 months</span>
          <span>72 months</span>
        </div>
        {errors.tenure && (
          <p className="text-sm text-destructive">{errors.tenure.message}</p>
        )}
      </div>
    </div>
  );
}
